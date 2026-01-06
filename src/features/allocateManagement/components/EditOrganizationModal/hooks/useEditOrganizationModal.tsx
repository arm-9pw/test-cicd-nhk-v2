import { useState } from 'react'

import { Form } from 'antd'

import {
  useAddBudgetSiteMutation,
  useDeleteBudgetSiteMutation,
  useGetBudgetSiteInfoQuery,
} from 'api/allocateManagementApi'
import { NewBudgetSiteInfoType, OrganizationListType } from 'api/allocateManagementApi.types'
import { useNotification } from 'hooks/useNotification'

import { BudgetDropdownType } from 'components/BudgetDropdown'

type Props = {
  selectedOrganization: OrganizationListType | null
}

const useEditOrganizationModal = ({ selectedOrganization }: Props) => {
  const [formRef] = Form.useForm()
  const { openNotification } = useNotification()

  const [selectedBudget, setSelectedBudget] = useState<BudgetDropdownType | null>(null)
  const { data: budgetSites, isLoading: isBudgetSitesLoading } = useGetBudgetSiteInfoQuery(
    selectedOrganization?.id || '',
    {
      skip: !selectedOrganization?.id,
    },
  )
  const [addBudgetSite, { isLoading: isAddingBudgetSite }] = useAddBudgetSiteMutation()
  const [deleteBudgetSite, { isLoading: isDeletingBudgetSite }] = useDeleteBudgetSiteMutation()

  const onSelectBudgetCode = (option: BudgetDropdownType) => {
    formRef.setFieldsValue({
      budgetTypeName: option.budgetTypeName,
      budgetYear: option.budgetYear,
      budgetAmount: option.budgetAmount,
    })
    setSelectedBudget(option)
  }

  const onAddBudget = async () => {
    try {
      await formRef.validateFields()
    } catch (error) {
      console.error('Validation Failed:', error)
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    if (!selectedBudget) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Please select a budget.',
      })
      return
    }

    if (!selectedOrganization) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Please select an organization.',
      })
      return
    }

    const data = {
      budgetId: selectedBudget.id,
      organizationId: selectedOrganization.id,
      organizationName: selectedOrganization.name,
    }

    try {
      await addBudgetSite(data).unwrap()
      openNotification({
        type: 'success',
        title: 'Budget added successfully',
        description: 'The budget has been added successfully.',
      })
      formRef.resetFields()
      setSelectedBudget(null)
    } catch (error) {
      console.error('Failed to add budget:', error)
      openNotification({
        type: 'error',
        title: 'Failed to add budget',
        description: 'Please try again later.',
      })
    }
  }

  const onDeleteBudget = async (record: NewBudgetSiteInfoType) => {
    try {
      await deleteBudgetSite(record.id).unwrap()
      openNotification({
        type: 'success',
        title: 'Budget deleted successfully',
        description: 'The budget has been deleted successfully.',
      })
    } catch (error) {
      console.error('Failed to delete budget:', error)
      openNotification({
        type: 'error',
        title: 'Failed to delete budget',
        description: 'Please try again later.',
      })
    }
  }

  return {
    formRef,
    onSelectBudgetCode,
    onAddBudget,
    onDeleteBudget,
    budgetSites,
    isBudgetSitesLoading,
    isAddingBudgetSite,
    isDeletingBudgetSite,
  }
}

export default useEditOrganizationModal
