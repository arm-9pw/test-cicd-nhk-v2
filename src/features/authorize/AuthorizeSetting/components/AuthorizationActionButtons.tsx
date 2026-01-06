import React from 'react'

import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Button, Col, Popconfirm } from 'antd'

import { DelegationType } from 'api/delegationApi.types'

interface AuthorizationActionButtonsProps {
  selectedAuthorization?: DelegationType
  isLoading?: boolean
  onCancel: () => void
  onCancelAuthorization: () => void
  onExtendAuthorization: () => void
  onCreateAuthorization: () => void
  onUpdateAuthorization: () => void
  onDeleteDelegation: () => void
}

const AuthorizationActionButtons: React.FC<AuthorizationActionButtonsProps> = ({
  selectedAuthorization,
  isLoading = false,
  onCancel,
  onCancelAuthorization,
  onExtendAuthorization,
  onCreateAuthorization,
  onUpdateAuthorization,
  onDeleteDelegation,
}) => {
  const renderExistingDelegationButtons = () => {
    if (!selectedAuthorization || selectedAuthorization.status === 'EXPIRED') return null

    if (selectedAuthorization.status === 'ACTIVE') {
      return (
        <>
          <Col>
            <Button
              danger
              onClick={onCancelAuthorization}
              loading={isLoading}
              icon={<StopOutlined />}
            >
              Cancel Authorization
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={onExtendAuthorization}
              loading={isLoading}
              icon={<ClockCircleOutlined />}
            >
              Extend Authorization
            </Button>
          </Col>
        </>
      )
    }

    if (selectedAuthorization.status === 'CANCELLED') {
      return (
        <Col>
          <Popconfirm
            title="Delete Authorization"
            description={`Are you sure you want to delete the authorization for ${selectedAuthorization.delegateName}?`}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            onConfirm={onDeleteDelegation}
          >
            <Button danger loading={isLoading} icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Col>
      )
    }

    // PENDING, INACTIVE
    return (
      <>
        <Col>
          <Button
            onClick={onUpdateAuthorization}
            loading={isLoading}
            icon={<EditOutlined />}
            type="primary"
          >
            Update
          </Button>
        </Col>
        <Col>
          <Popconfirm
            title="Delete Authorization"
            description={`Are you sure you want to delete the authorization for ${selectedAuthorization.delegateName}?`}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            onConfirm={onDeleteDelegation}
          >
            <Button danger loading={isLoading} icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Col>
      </>
    )
  }

  const renderNewDelegationButtons = () => {
    return (
      <>
        <Col>
          <Button
            type="primary"
            onClick={onCreateAuthorization}
            loading={isLoading}
            icon={<SaveOutlined />}
          >
            Create Authorization
          </Button>
        </Col>
        <Col>
          <Button onClick={onCancel} disabled={isLoading}>
            Close
          </Button>
        </Col>
      </>
    )
  }

  return (
    <>{selectedAuthorization ? renderExistingDelegationButtons() : renderNewDelegationButtons()}</>
  )
}

export default AuthorizationActionButtons
