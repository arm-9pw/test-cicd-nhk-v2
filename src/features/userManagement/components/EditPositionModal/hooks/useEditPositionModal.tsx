import { useEffect, useState } from 'react'

import { Form } from 'antd'
import dayjs from 'dayjs'

import {
  useCreatePositionMutation,
  useDeletePositionMutation,
  useUpdateEmployeePositionMutation,
} from 'api/employeeApi'
import { PositionCreateRequest } from 'api/employeeApi.types'
import {
  EmployeeUserType,
  PositionType,
  UpdateEmployeePositionRequest,
} from 'api/employeeApi.types'
import { useNotification } from 'hooks/useNotification'

type PositionFormValues = Omit<PositionType, 'startJobDate' | 'endJobDate'> & {
  startJobDate?: dayjs.Dayjs
  endJobDate?: dayjs.Dayjs
  isCurrentlyWorking?: boolean
}

type Props = {
  selectedPosition: PositionType | null
  selectedEmployee: EmployeeUserType | null
  hidePositionModal: () => void
  setIsCurrentlyWorking: (value: boolean) => void
}

const useEditPositionModal = ({
  selectedPosition,
  hidePositionModal,
  selectedEmployee,
  setIsCurrentlyWorking,
}: Props) => {
  const [positionFormRef] = Form.useForm()
  const { openNotification } = useNotification()
  const [updateEmployeePosition, { isLoading: isUpdating }] = useUpdateEmployeePositionMutation()
  const [createPosition, { isLoading: isCreating }] = useCreatePositionMutation()
  const [deletePosition, { isLoading: isDeleting }] = useDeletePositionMutation()
  const [selectedSiteCode, setSelectedSiteCode] = useState<string | null>(null)

  const onSavePosition = async () => {
    try {
      await positionFormRef.validateFields()
    } catch (error) {
      console.error('Form validation failed:', error)
      openNotification({
        type: 'error',
        title: 'Error Validating Form',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    try {
      const formValues = positionFormRef.getFieldsValue()

      if (!selectedEmployee?.id) {
        openNotification({
          type: 'error',
          title: 'Error',
          description: 'No employee selected, please try again.',
        })
        return
      }

      // Process job dates
      let startJobDate = ''
      let endJobDate: string | undefined = undefined

      if (formValues.startJobDate) {
        // Add time part for LocalDateTime format (T00:00:00)
        startJobDate = formValues.startJobDate.format('YYYY-MM-DD') + 'T00:00:00'
      }

      // Only set endJobDate if not currently working and end date is provided
      if (!formValues.isCurrentlyWorking && formValues.endJobDate) {
        // Add time part for LocalDateTime format (T23:59:59 for end date)
        endJobDate = formValues.endJobDate.format('YYYY-MM-DD') + 'T23:59:59'
      }
      // If currently working, endJobDate remains undefined (null in API)

      if (selectedPosition?.id) {
        // (Update Position)**
        const updateData: UpdateEmployeePositionRequest = {
          id: selectedPosition.id,
          employeeId: selectedEmployee.id,
          organizationId: formValues.organizationId,
          positionId: formValues.positionId,
          startJobDate,
          ...(endJobDate && { endJobDate }), // Only include endJobDate if it exists
          positionType: formValues.positionType || selectedPosition.positionType,
          permissionApprove: formValues.permissionApprove || false,
        }

        await updateEmployeePosition(updateData).unwrap()
        openNotification({
          type: 'success',
          title: 'Success',
          description: 'Position updated successfully.',
        })
      } else {
        // (Create Position)**
        const createData: PositionCreateRequest = {
          employeeId: selectedEmployee.id,
          organizationId: formValues.organizationId,
          positionId: formValues.positionId,
          startJobDate,
          ...(endJobDate && { endJobDate }),
          positionType: formValues.positionType,
          permissionApprove: formValues.permissionApprove || false,
        }

        await createPosition(createData).unwrap()
        openNotification({
          type: 'success',
          title: 'Success',
          description: 'Position added successfully.',
        })
      }

      positionFormRef.resetFields()
      hidePositionModal()
    } catch (error) {
      console.error('Error saving position:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to save position.',
      })
    }
  }

  useEffect(() => {
    if (selectedPosition) {
      setSelectedSiteCode(selectedPosition.siteCode)

      const formValues: PositionFormValues = {
        ...selectedPosition,
        startJobDate: undefined,
        endJobDate: undefined,
        isCurrentlyWorking: undefined,
      }

      // Convert date strings to dayjs objects for DatePicker
      if (selectedPosition.startJobDate) {
        formValues.startJobDate = dayjs(selectedPosition.startJobDate)
      }

      if (selectedPosition.endJobDate) {
        formValues.endJobDate = dayjs(selectedPosition.endJobDate)
        formValues.isCurrentlyWorking = false
        setIsCurrentlyWorking(false)
      } else {
        // No end date means currently working
        formValues.isCurrentlyWorking = true
        setIsCurrentlyWorking(true)
      }

      positionFormRef.setFieldsValue(formValues)
    } else {
      // For new position, default to not currently working (need to set end date)
      setIsCurrentlyWorking(false)
      // Set default values for new position
      positionFormRef.setFieldsValue({
        positionType: 'Main',
        permissionApprove: false,
        isCurrentlyWorking: false,
      })
    }
  }, [selectedPosition, positionFormRef, setIsCurrentlyWorking])

  const onDeletePosition = async () => {
    if (!selectedPosition) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'No position selected, please try again.',
      })
      return
    }

    try {
      // (Delete Position)**
      await deletePosition(selectedPosition.id).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Position deleted successfully.',
      })

      hidePositionModal()
    } catch (error) {
      console.error('Error deleting position:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete position.',
      })
    }
  }

  return {
    onSavePosition,
    positionFormRef,
    isCreating,
    isUpdating,
    isDeleting,
    onDeletePosition,
    selectedSiteCode,
    setSelectedSiteCode,
  }
}

export default useEditPositionModal
