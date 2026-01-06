import { useEffect, useState } from 'react'

import { Form } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import {
  useCreateBudgetMutation,
  useDeleteBudgetMutation,
  useUpdateBudgetMutation,
} from 'api/budgetManagementApi'
import { BudgetsResponseType } from 'api/budgetManagementApi.types'
import { useNotification } from 'hooks/useNotification'

type BudgetFormValues = {
  budgetAmountMonth1?: number
  budgetAmountMonth2?: number
  budgetAmountMonth3?: number
  budgetAmountMonth4?: number
  budgetAmountMonth5?: number
  budgetAmountMonth6?: number
  budgetAmountMonth7?: number
  budgetAmountMonth8?: number
  budgetAmountMonth9?: number
  budgetAmountMonth10?: number
  budgetAmountMonth11?: number
  budgetAmountMonth12?: number
  dateRange?: [Dayjs, Dayjs]
  budgetType?: {
    value: string
    label: string
  }
  mainBudget?: {
    value: string
    label: string
  }
  budgetCode?: string
  budgetName?: string
  budgetYear?: number
  budgetDescription?: string
  budgetAmount?: number
  costCenter?: string
  assetType?: string
  isActive?: boolean
  isActiveBudget?: boolean
  mainBudgetName?: string
}

type Props = {
  selectedBudget: BudgetsResponseType | null
  closeEditBudgetModal: () => void
}

const useEditBudgetModal = ({ selectedBudget, closeEditBudgetModal }: Props) => {
  const [formRef] = Form.useForm()
  const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation()
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation()
  const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation()
  const { openNotification } = useNotification()

  const [isSubBudget, setIsSubBudget] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState(0)

  useEffect(() => {
    if (selectedBudget) {
      let dateRange: [Dayjs, Dayjs] | undefined = undefined
      if (selectedBudget.startDate && selectedBudget.endDate) {
        dateRange = [dayjs(selectedBudget.startDate), dayjs(selectedBudget.endDate)]
      }

      const formValues = {
        ...selectedBudget,
        budgetType: {
          value: selectedBudget.budgetTypeId,
          label: selectedBudget.budgetTypeName,
        },
        mainBudget: selectedBudget.mainBudgetId
          ? {
              value: selectedBudget.mainBudgetId,
              label: selectedBudget.mainBudgetCode,
            }
          : undefined,
        mainBudgetName: selectedBudget.mainBudgetName,
        dateRange: dateRange,
        budgetSites: selectedBudget.budgetSites || [],
      }

      formRef.setFieldsValue(formValues)
      setIsSubBudget(selectedBudget.isSubBudget)
      setBudgetAmount(selectedBudget.budgetAmount)
    }
  }, [selectedBudget, formRef, setIsSubBudget, setBudgetAmount])

  const onFormValuesChange = (_: unknown, allValues: BudgetFormValues) => {
    // Get all monthly values (m1-m12) with proper type checking
    const monthlyValues = [
      allValues.budgetAmountMonth1 || 0,
      allValues.budgetAmountMonth2 || 0,
      allValues.budgetAmountMonth3 || 0,
      allValues.budgetAmountMonth4 || 0,
      allValues.budgetAmountMonth5 || 0,
      allValues.budgetAmountMonth6 || 0,
      allValues.budgetAmountMonth7 || 0,
      allValues.budgetAmountMonth8 || 0,
      allValues.budgetAmountMonth9 || 0,
      allValues.budgetAmountMonth10 || 0,
      allValues.budgetAmountMonth11 || 0,
      allValues.budgetAmountMonth12 || 0,
    ]

    // Calculate total
    const total = monthlyValues.reduce((sum, value) => sum + value, 0)

    // Update budgetAmount field
    formRef.setFieldsValue({ budgetAmount: total })

    // Update budgetAmount state
    setBudgetAmount(total)
  }

  const onSave = async () => {
    try {
      await formRef.validateFields()
    } catch (error) {
      console.error('Form validation failed:', error)
      openNotification({
        type: 'error',
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    if (budgetAmount <= 0) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Budget amount must be greater than zero.',
      })
      return
    }

    try {
      const values = await formRef.getFieldsValue()

      let startDate: string = ''
      let endDate: string = ''

      if (values.dateRange && Array.isArray(values.dateRange) && values.dateRange.length === 2) {
        const [start, end] = values.dateRange
        if (start && end) {
          // Set start date to beginning of day (00:00:00)
          startDate = start.startOf('day').format('YYYY-MM-DDTHH:mm:ss')
          // Set end date to end of day (23:59:59)
          endDate = end.endOf('day').format('YYYY-MM-DDTHH:mm:ss')
        }
      }

      let data: Partial<BudgetsResponseType> = {
        budgetTypeId: values.budgetType.value,
        budgetTypeName: values.budgetType.label,
        isSubBudget,
        budgetCode: values.budgetCode,
        budgetAmount,
        budgetName: values.budgetName,
        budgetYear: values.budgetYear,
        budgetDescription: values.budgetDescription,
        isBudgetCenter: selectedBudget?.isBudgetCenter,
        budgetAmountMonth1: values.budgetAmountMonth1,
        budgetAmountMonth2: values.budgetAmountMonth2,
        budgetAmountMonth3: values.budgetAmountMonth3,
        budgetAmountMonth4: values.budgetAmountMonth4,
        budgetAmountMonth5: values.budgetAmountMonth5,
        budgetAmountMonth6: values.budgetAmountMonth6,
        budgetAmountMonth7: values.budgetAmountMonth7,
        budgetAmountMonth8: values.budgetAmountMonth8,
        budgetAmountMonth9: values.budgetAmountMonth9,
        budgetAmountMonth10: values.budgetAmountMonth10,
        budgetAmountMonth11: values.budgetAmountMonth11,
        budgetAmountMonth12: values.budgetAmountMonth12,
        costCenter: values.costCenter,
        isActive: values.isActive,
        isActiveBudget: values.isActiveBudget,
        startDate: startDate,
        endDate: endDate,
        assetType: values.assetType,
      }

      if (values.mainBudget) {
        data = {
          ...data,
          mainBudgetCode: values.mainBudget.label,
          mainBudgetId: values.mainBudget.value,
          mainBudgetName: values.mainBudgetName,
        }
      }

      if (selectedBudget) {
        // Update existing budget
        await updateBudget({ ...data, id: selectedBudget.id }).unwrap()
        openNotification({
          type: 'success',
          title: 'Success',
          description: 'Budget updated successfully.',
        })
      } else {
        // Create new budget
        await createBudget(data).unwrap()
        openNotification({
          type: 'success',
          title: 'Success',
          description: 'Budget created successfully.',
        })
      }

      // Reset form and close modal
      formRef.resetFields()
      setIsSubBudget(false)
      setBudgetAmount(0)
      closeEditBudgetModal()
    } catch (error) {
      console.error('Error saving budget:', error)
      // Handle validation or API errors
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to save budget. Please try again.',
      })
    }
  }

  const onDelete = async () => {
    if (!selectedBudget) {
      openNotification({
        type: 'error',
        title: 'Error, no budget selected',
        description: 'Please try again.',
      })
      return
    }

    try {
      await deleteBudget(selectedBudget.id).unwrap()
      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Budget deleted successfully.',
      })
      closeEditBudgetModal()
    } catch (error) {
      console.error('Error deleting budget:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete budget. Please try again.',
      })
    }
  }

  return {
    formRef,
    isSubBudget,
    budgetAmount,
    onFormValuesChange,
    onSave,
    onDelete,
    setIsSubBudget,
    isCreating,
    isUpdating,
    isDeleting,
  }
}

export default useEditBudgetModal
