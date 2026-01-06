import React from 'react'

import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Divider, Form, Modal, Row, Spin } from 'antd'

import { DelegationType } from 'api/delegationApi.types'

import HeaderTitle from 'components/HeaderTitle'

import { useAuthorizationForm } from '../hooks/useAuthorizationForm'
import { useAuthorizationModalActions } from '../hooks/useAuthorizationModalActions'
import { AuthorizationFormValues } from '../types'

import AuthorizationActionButtons from './AuthorizationActionButtons'
import AuthorizationFormFields from './AuthorizationFormFields'
import DelegationStatusAlert from './DelegationStatusAlert'

interface NewAuthorizationModalProps {
  open: boolean
  onCancel: () => void
  afterClose?: () => void
  selectedAuthorization?: DelegationType
  isLoading?: boolean
  onCancelDelegation?: () => void
  onExtendDelegation?: () => void
  onCreateDelegation?: (formData: AuthorizationFormValues) => void
  onUpdateDelegation?: (formData: AuthorizationFormValues) => void
  onDeleteDelegation?: () => void
}

const AuthorizationModal: React.FC<NewAuthorizationModalProps> = ({
  open,
  onCancel,
  afterClose,
  selectedAuthorization,
  isLoading = false,
  onCancelDelegation,
  onExtendDelegation,
  onCreateDelegation,
  onUpdateDelegation,
  onDeleteDelegation,
}) => {
  const {
    formRef,
    handleCreateAuthorization,
    handleUpdateAuthorization,
    handleCancel,
    isDisabledForm,
    isOwner,
  } = useAuthorizationForm({
    selectedAuthorization,
    open,
    onCancel,
    onCreateDelegation,
    onUpdateDelegation,
  })

  const { handleCancelAuthorization, handleExtendAuthorization, handleDeleteDelegation } =
    useAuthorizationModalActions({
      onCancelDelegation,
      onExtendDelegation,
      onDeleteDelegation,
    })

  const isCreateMode = !selectedAuthorization
  const isDisabledDelegatePerson = !!selectedAuthorization && !isOwner

  const getModalTitle = () => {
    if (selectedAuthorization) {
      return <HeaderTitle title="Edit Authorization" titlePreIcon={<EditOutlined />} />
    }
    return <HeaderTitle title="Add Authorization" titlePreIcon={<PlusOutlined />} />
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          {getModalTitle()}
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={open}
      onCancel={handleCancel}
      afterClose={afterClose}
      footer={null}
    >
      <Spin spinning={isLoading}>
        {/* Show status alert only for existing delegations */}
        {selectedAuthorization && selectedAuthorization.status && (
          <DelegationStatusAlert status={selectedAuthorization.status} />
        )}
        <Form labelWrap layout="vertical" form={formRef} disabled={isDisabledForm}>
          <AuthorizationFormFields
            formRef={formRef}
            isDisabledDelegatePerson={isDisabledDelegatePerson}
          />
        </Form>
        {(isOwner || isCreateMode) && (
          <Row gutter={[8, 8]} justify="end" style={{ marginTop: 16 }}>
            <AuthorizationActionButtons
              selectedAuthorization={selectedAuthorization}
              isLoading={isLoading}
              onCancel={handleCancel}
              onCancelAuthorization={handleCancelAuthorization}
              onExtendAuthorization={handleExtendAuthorization}
              onCreateAuthorization={handleCreateAuthorization}
              onUpdateAuthorization={handleUpdateAuthorization}
              onDeleteDelegation={handleDeleteDelegation}
            />
          </Row>
        )}
      </Spin>
    </Modal>
  )
}

export default AuthorizationModal
