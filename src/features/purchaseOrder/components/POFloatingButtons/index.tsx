import React from 'react'

import {
  // CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileExclamationOutlined,
  FileSearchOutlined,
  HistoryOutlined,
  PrinterOutlined,
  SaveOutlined,
  SendOutlined, // StopOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Space } from 'antd'

import { useAppDispatch, useAppSelector } from 'app/hook'
import { hideLoading, selectLoading, showLoading } from 'app/slices/loadingSlice'

import ExpandableButtonGroup from 'components/ExpandableButtonGroup'
// import ExpandableButtonGroup from 'components/ExpandableButtonGroup'
import { selectUser } from 'features/auth/authSlice'

import { PO_STATUS } from 'constants/index'

import useGetCancelPOData from '../../hooks/useGetCancelPOData'
import usePOFlowOperations from '../../hooks/usePOFlowOperations'

import { usePOStateButton } from './hooks/usePOStateButton'

type POFloatingButtonsProps = {
  purchaserId?: string
  poStatus?: string
  poId?: string
  disabledAll?: boolean
  onSave: () => void
  onPrint?: () => void
  onCancel?: () => void
  onApproveCancel?: () => void
  onGRHistory?: () => void
  onPrintBCS?: () => void
  handleSubmitWithValidation?: () => void
  handleCheckStatus?: () => void
}

const POFloatingButtons: React.FC<POFloatingButtonsProps> = ({
  purchaserId,
  poStatus,
  poId,
  disabledAll = false,
  onSave,
  onPrint,
  onCancel,
  onApproveCancel,
  onGRHistory,
  onPrintBCS,
  handleSubmitWithValidation,
  handleCheckStatus,
}) => {
  const { isLoading } = useAppSelector(selectLoading)
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const disabled = disabledAll || isLoading

  const isPurchaser = user?.employeeId === purchaserId

  const { cancelData } = useGetCancelPOData({
    poId,
    domainStatus: poStatus,
  })
  const { handleDeletePO, handleRevisePO } = usePOFlowOperations()

  const buttons = usePOStateButton({
    isPurchaser,
    poStatus,
    approveStatus: cancelData?.approveStatus,
  })

  const isDisplayCancelDetailLabel = poStatus
    ? [PO_STATUS.PO_CANCELING, PO_STATUS.PO_CANCELED].includes(poStatus)
    : false
  const isDisplayApproveCancelDetailLabel = poStatus
    ? [PO_STATUS.PO_CANCELED].includes(poStatus)
    : false

  // Print handlers with loading
  const handlePrint = () => {
    dispatch(showLoading())
    if (onPrint) onPrint()
    setTimeout(() => dispatch(hideLoading()), 1500)
  }
  const handlePrintBCS = () => {
    dispatch(showLoading())
    if (onPrintBCS) onPrintBCS()
    setTimeout(() => dispatch(hideLoading()), 1500)
  }

  const handleSave = () => {
    // Implement save functionality
    if (onSave) {
      onSave()
      return
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
      return
    }
  }

  const handleApproveCancel = () => {
    if (onApproveCancel) {
      onApproveCancel()
      return
    }
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
      <Space wrap style={{ justifyContent: 'flex-end' }}>
        {buttons.includes('checkStatus') && (
          <Button
            icon={<EyeOutlined />}
            onClick={handleCheckStatus}
            disabled={disabled}
            size="large"
          >
            Check Status
          </Button>
        )}

        {buttons.includes('cancel') && (
          <Button
            danger={isDisplayCancelDetailLabel ? false : true}
            icon={<CloseCircleOutlined />}
            onClick={handleCancel}
            disabled={disabled}
          >
            {isDisplayCancelDetailLabel ? 'Canceled Detail' : 'Cancel PO.'}
          </Button>
        )}

        {buttons.includes('approveCancel') && (
          <Button
            danger={isDisplayApproveCancelDetailLabel ? false : true}
            type={isDisplayApproveCancelDetailLabel ? 'default' : 'primary'}
            icon={<FileExclamationOutlined />}
            onClick={handleApproveCancel}
            disabled={disabled}
          >
            {isDisplayApproveCancelDetailLabel ? 'Canceled Approval Details' : 'Approve Cancel'}
          </Button>
        )}

        {buttons.includes('print') && (
          <ExpandableButtonGroup triggerLabel="Prints">
            <Button
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              style={{
                backgroundColor: '#e1f5fe',
                borderColor: '#2a80e0',
              }}
              variant="solid"
              size="large"
            >
              Print PO.
            </Button>
            <Button
              icon={<PrinterOutlined />}
              onClick={handlePrintBCS}
              style={{
                backgroundColor: '#e1f5fe',
                borderColor: '#2a80e0',
              }}
              variant="solid"
              size="large"
            >
              Print Budget Control Sheet
            </Button>
          </ExpandableButtonGroup>
        )}

        {/*{buttons.includes('print') && (
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            style={{ backgroundColor: '#2a80e0' }}
            type="primary"
            size="large"
          >
            Print PO.
          </Button>
        )}*/}

        {/* NOTE: Approve and reject flow has been moved to My Approvals Page. Users must perform these actions from that page instead.
        {buttons.includes('reject') && (
          <Popconfirm
            title="Reject Purchase Order"
            description="Are you sure you want to reject this PO.?"
            onConfirm={() => handleRejectPO(poId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              color="danger"
              variant="outlined"
              icon={<StopOutlined />}
              disabled={disabled}
              size="large"
            >
              Reject PO.
            </Button>
          </Popconfirm>
        )} */}

        {buttons.includes('delete') && (
          <Popconfirm
            title="Delete Purchase Order"
            description="Are you sure you want to delete this PO.?"
            onConfirm={() => handleDeletePO(poId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              disabled={disabled}
              size="large"
            >
              Delete PO.
            </Button>
          </Popconfirm>
        )}

        {buttons.includes('revise') && (
          <Popconfirm
            title="Revise Purchase Order"
            description="Are you sure you want to revise this PO.?"
            onConfirm={() => handleRevisePO(poId)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<FileSearchOutlined />} disabled={disabled} size="large">
              Revise PO.
            </Button>
          </Popconfirm>
        )}

        {/* NOTE: Approve and reject flow has been moved to My Approvals Page. Users must perform these actions from that page instead.
        {buttons.includes('approve') && (
          <Popconfirm
            title="Approve Purchase Order"
            description="Are you sure you want to approve this PO.?"
            onConfirm={() => handleApprovePO(poId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<CheckCircleOutlined />}
              disabled={disabled}
              color="green"
              variant="solid"
              size="large"
            >
              Approve PO.
            </Button>
          </Popconfirm>
        )} */}

        {buttons.includes('save') && (
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={disabled}
            color="green"
            variant="solid"
            size="large"
          >
            Save
          </Button>
        )}

        {buttons.includes('submit') && (
          <Button
            icon={<SendOutlined />}
            disabled={disabled || !handleSubmitWithValidation}
            color="green"
            variant="solid"
            size="large"
            onClick={handleSubmitWithValidation}
          >
            Submit
          </Button>
        )}

        {buttons.includes('grHistory') && (
          <Button
            style={{ backgroundColor: '#2a80e0', color: '#fff' }}
            variant="solid"
            icon={<HistoryOutlined />}
            onClick={onGRHistory}
            disabled={disabled}
            size="large"
          >
            GR History
          </Button>
        )}
      </Space>
    </div>
  )
}

export default POFloatingButtons
