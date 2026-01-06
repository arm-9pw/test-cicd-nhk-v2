import React from 'react'

import { ClearOutlined, DeleteOutlined, HistoryOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space } from 'antd'

import { useGRStateButton } from '../hooks/useGRStateButton'

type GRFloatingActionButtonsProps = {
  isRequester: boolean
  isSameDepartment: boolean
  grStatus?: string
  onSubmitUpdateGR: () => void
  onClickGRHistory: () => void
  onClickGRClear: () => void
  onDeleteGRHistory: () => void
  isDisableSaveButton?: boolean
}

const GRFloatingActionButtons: React.FC<GRFloatingActionButtonsProps> = ({
  isRequester,
  isSameDepartment,
  grStatus,
  onSubmitUpdateGR,
  onClickGRHistory,
  onClickGRClear,
  onDeleteGRHistory,
  isDisableSaveButton,
}) => {
  const buttons = useGRStateButton({
    isRequester,
    isSameDepartment,
    grStatus,
  })

  const handleCancel = () => {
    // Implement cancel functionality
    onClickGRClear()
  }

  const handleSave = () => {
    // Implement save functionality
    onSubmitUpdateGR()
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: '16px',
        padding: '16px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Space>
        {buttons.includes('delete') && (
          <Popconfirm
            title="Are you sure to delete this GR?"
            onConfirm={onDeleteGRHistory}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="large" color="danger">
              Delete GR.
            </Button>
          </Popconfirm>
        )}

        {buttons.includes('clear') && (
          <Space size="small">
            <Popconfirm
              title="Reload ALL Data on this page?"
              onConfirm={() => {
                handleCancel()
              }}
            >
              <Button icon={<ClearOutlined />} onClick={() => {}} size="large">
                Clear
              </Button>
            </Popconfirm>
          </Space>
        )}

        {buttons.includes('save') && (
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            color="green"
            variant="solid"
            size="large"
            disabled={isDisableSaveButton}
          >
            Save
          </Button>
        )}

        {buttons.includes('grHistory') && (
          <Button
            type="primary"
            icon={<HistoryOutlined />}
            onClick={onClickGRHistory}
            style={{ backgroundColor: '#2a80e0' }}
            size="large"
          >
            GR. History
          </Button>
        )}

        {/* <Popconfirm
          title="Reload ALL Data on this page?"
          onConfirm={() => {
            handleCancel()
          }}
        >
          <Button icon={<ClearOutlined />} onClick={() => {}} size="large">
            Clear
          </Button>
        </Popconfirm>

        <Space size="small">
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            color="green"
            variant="solid"
            size="large"
          >
            Save
          </Button>
        </Space>

        <Button
          type="primary"
          icon={<HistoryOutlined />}
          onClick={onClickGRHistory}
          style={{ backgroundColor: '#2a80e0' }}
          size="large"
        >
          GR. History
        </Button> */}
      </Space>
    </div>
  )
}

export default GRFloatingActionButtons
