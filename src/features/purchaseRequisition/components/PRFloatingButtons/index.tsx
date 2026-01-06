import React from 'react'

import {
  // CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileSearchOutlined,
  PrinterOutlined,
  RetweetOutlined,
  SaveOutlined,
  SendOutlined, // StopOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Space } from 'antd'

import { PurchaseRequisitionRespType } from 'api/prApi.types'
import { useAppDispatch, useAppSelector } from 'app/hook'
import { hideLoading, selectLoading, showLoading } from 'app/slices/loadingSlice'

import { selectUser } from 'features/auth/authSlice'

import { PR_STATUS } from 'constants/index'

import usePRFlowOperations from '../../hooks/usePRFlowOperations'

import { usePRStateButton } from './hooks/usePRStateButton'

type PrFloatingActionButtonsProps = {
  disabledAll?: boolean
  prStatus?: string
  prId?: string | null
  requesterId?: string
  handleSave: () => void
  composeUpdatePrData: () => Partial<PurchaseRequisitionRespType> | null
  handlePrint?: () => void
  handleCancel?: () => void
  handleTransfer?: () => void
  handleSubmitWithApproval?: () => void
  handleCheckStatus?: () => void
  handleReceivePR?: () => void
  purchaseInChargeSectionId?: string
}

const PrFloatingActionButtons: React.FC<PrFloatingActionButtonsProps> = ({
  prStatus,
  prId,
  handleSave,
  handlePrint,
  handleCancel,
  handleTransfer,
  handleSubmitWithApproval,
  handleCheckStatus,
  handleReceivePR,
  requesterId,
  purchaseInChargeSectionId,
  // composeUpdatePrData,
  disabledAll = false,
}) => {
  const { handleDeletePR, handleRevisePR } = usePRFlowOperations()
  const { isLoading } = useAppSelector(selectLoading)
  const user = useAppSelector(selectUser)
  const disabled = disabledAll || isLoading
  const dispatch = useAppDispatch()

  /*
   * There are 3 major roles in the PR process:
   * 1. Requester: The one who created PR
   *     => isRequester
   * 2. Other Requesters: The one who are in the same organization with the creator of the PR
   *     => !isRequester && !purchaser (ไม่ได้ check จาก organization ว่าเป็น org เดียวกันมั้ยเพราะถ้าอยู่คนละ org จะมองไม่เห็น PR ใบนี้อยู่แล้ว)
   * 3. Purchaser
   *     => isPurchaser
   * 4. **กรณีที่เป็นทั้ง Other Requester และ Purchaser
   *     => ให้ยึด action buttons จาก Purchaser
   */

  const isRequester = user?.employeeId === requesterId
  const isPurchaser = user?.currentRoleName.includes('PURCHASER')
  const isOtherRequester = !isRequester && !isPurchaser
  const isPurchaserWithSameDepartment =
    isPurchaser && user?.currentMainDepartmentId === purchaseInChargeSectionId
  const buttons = usePRStateButton({
    prStatus,
    isRequester,
    isPurchaser,
    isOtherRequester,
    isPurchaserWithSameDepartment,
  })

  const onPrint = () => {
    dispatch(showLoading())
    // Implement print functionality
    if (handlePrint) handlePrint()
    setTimeout(() => dispatch(hideLoading()), 1500)
  }

  const onCancel = () => {
    // Implement cancel functionality
    if (handleCancel) {
      handleCancel()
      return
    }
  }

  const onSave = () => {
    // Implement save functionality
    if (handleSave) {
      handleSave()
      return
    }
  }

  const onTransfer = () => {
    // Implement transfer functionality
    if (handleTransfer) {
      handleTransfer()
      return
    }
  }

  // const onCreatePO = () => {
  //   // Implement create PO functionality
  //   console.log('Create PO clicked')
  // }

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

        {buttons.includes('print') && (
          <Button
            icon={<PrinterOutlined />}
            onClick={onPrint}
            disabled={disabled}
            type="primary"
            style={{ backgroundColor: '#2a80e0' }}
            size="large"
          >
            Print
          </Button>
        )}

        {buttons.includes('delete') && (
          <Popconfirm
            title="Delete Purchase Requisition"
            description="Are you sure you want to delete this PR.?"
            onConfirm={() => handleDeletePR(prId)}
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
              Delete PR.
            </Button>
          </Popconfirm>
        )}

        {/* NOTE: Approve and reject flow has been moved to My Approvals Page. Users must perform these actions from that page instead.
          {buttons.includes('reject') && (
          <Popconfirm
            title="Reject Purchase Requisition"
            description="Are you sure you want to reject this PR.?"
            onConfirm={() => handleRejectPR(prId)}
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
              Reject PR.
            </Button>
          </Popconfirm>
        )}

        {buttons.includes('approve') && (
          <Popconfirm
            title="Approve Purchase Requisition"
            description="Are you sure you want to approve this PR.?"
            onConfirm={() => handleApprovePR(prId)}
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
              Approve PR.
            </Button>
          </Popconfirm>
        )} */}

        {buttons.includes('cancel') && (
          <Button
            danger={prStatus !== PR_STATUS.PR_CANCELED}
            icon={<CloseCircleOutlined />}
            disabled={disabled}
            onClick={onCancel}
          >
            {prStatus === PR_STATUS.PR_CANCELED ? 'Canceled Detail' : 'Cancel PR.'}
          </Button>
        )}

        {buttons.includes('transfer') && (
          <Button icon={<RetweetOutlined />} onClick={onTransfer} disabled={disabled} size="large">
            Transfer PR.
          </Button>
        )}

        {buttons.includes('revise') && (
          <Popconfirm
            title="Revise Purchase Requisition"
            description="Are you sure you want to revise this PR.?"
            onConfirm={() => handleRevisePR(prId)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<FileSearchOutlined />} disabled={disabled} size="large">
              Revise PR.
            </Button>
          </Popconfirm>
        )}

        {buttons.includes('receive') && (
          // <Popconfirm
          //   title="Receive Purchase Requisition"
          //   description="Are you sure you want to receive this PR.?"
          //   onConfirm={handleReceivePR}
          //   okText="Yes"
          //   cancelText="No"
          //   disabled={disabled || !handleReceivePR}
          // >
          <Button
            onClick={handleReceivePR}
            icon={<UserAddOutlined />}
            disabled={disabled || !handleReceivePR}
            color="green"
            variant="solid"
            size="large"
          >
            Receive PR.
          </Button>
          // </Popconfirm>
        )}

        {buttons.includes('save') && (
          <Button
            icon={<SaveOutlined />}
            onClick={onSave}
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
            disabled={disabled || !handleSubmitWithApproval}
            color="green"
            variant="solid"
            size="large"
            onClick={handleSubmitWithApproval}
          >
            Submit
          </Button>
        )}

        {/* {buttons.includes('createPO') && (
          <Button
            icon={<FileAddOutlined />}
            onClick={onCreatePO}
            disabled={disabled}
            color="green"
            variant="solid"
          >
            Create PO.
          </Button>
        )} */}
      </Space>
    </div>
  )
}

export default PrFloatingActionButtons
