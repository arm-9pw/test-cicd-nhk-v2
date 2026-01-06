import { useEffect } from 'react'

import { Form } from 'antd'
import dayjs from 'dayjs'

import { DelegationType } from 'api/delegationApi.types'
import { useAppSelector } from 'app/hook'

import { selectUser } from 'features/auth/authSlice'

import { AuthorizationFormValues } from '../types'

interface UseAuthorizationFormProps {
  selectedAuthorization?: DelegationType
  open: boolean
  onCancel: () => void
  onCreateDelegation?: (formData: AuthorizationFormValues) => void
  onUpdateDelegation?: (formData: AuthorizationFormValues) => void
}

export const useAuthorizationForm = ({
  selectedAuthorization,
  open,
  onCancel,
  onCreateDelegation,
  onUpdateDelegation,
}: UseAuthorizationFormProps) => {
  const user = useAppSelector(selectUser)
  const [formRef] = Form.useForm()

  // Disable form when:
  // 1) The current user is not the delegator (owner)
  // 2) The selected authorization has status ACTIVE or CANCELLED
  const isOwner = selectedAuthorization?.delegatorId === user?.employeeId
  const lockedStatuses = ['ACTIVE', 'CANCELLED', 'EXPIRED']
  const isLockedStatus = selectedAuthorization
    ? lockedStatuses.includes(selectedAuthorization.status)
    : false
  const isDisabledForm = selectedAuthorization ? !isOwner || isLockedStatus : false

  // Populate form when selectedAuthorization changes
  useEffect(() => {
    if (selectedAuthorization && open) {
      const activatedAt = selectedAuthorization.activatedAt
        ? dayjs(selectedAuthorization.activatedAt)
        : null
      const expiredAt = selectedAuthorization.expiredAt
        ? dayjs(selectedAuthorization.expiredAt)
        : null

      formRef.setFieldsValue({
        delegateId: selectedAuthorization.delegateId,
        delegateName: selectedAuthorization.delegateName,
        delegatePosition: selectedAuthorization.delegatePositionName,
        delegatePositionName: selectedAuthorization.delegatePositionName,
        delegatePositionCode: selectedAuthorization.delegatePositionCode,
        delegatePositionId: selectedAuthorization.delegatePositionId,
        delegateEmail: selectedAuthorization.delegateEmail,
        delegateSectionName: selectedAuthorization.delegateSectionName,
        delegateSectionId: selectedAuthorization.delegateSectionId,
        delegateSite: selectedAuthorization.delegateSite,
        authorizePeriod: activatedAt && expiredAt ? [activatedAt, expiredAt] : undefined,
        reasonDetails: selectedAuthorization.reasonDetails,
        isActive: selectedAuthorization.isActive,
      })
    } else if (!selectedAuthorization && open) {
      // Reset form for new authorization
      formRef.resetFields()
    }
  }, [selectedAuthorization, open, formRef])

  const handleCreateAuthorization = async () => {
    try {
      // Validate form first
      const values: AuthorizationFormValues = await formRef.validateFields()

      if (onCreateDelegation) {
        onCreateDelegation(values)
        formRef.resetFields()
      }
    } catch (error) {
      // Handle validation errors - form will show field errors
      console.error('Form validation failed:', error)
    }
  }

  const handleUpdateAuthorization = async () => {
    try {
      // Validate form first
      const values: AuthorizationFormValues = await formRef.validateFields()

      if (onUpdateDelegation) {
        onUpdateDelegation(values)
      }
    } catch (error) {
      // Handle validation errors - form will show field errors
      console.error('Form validation failed:', error)
    }
  }

  const handleCancel = () => {
    formRef.resetFields()
    onCancel()
  }

  return {
    formRef,
    handleCreateAuthorization,
    handleUpdateAuthorization,
    handleCancel,
    isDisabledForm,
    isOwner,
  }
}
