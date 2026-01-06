import { Button, Spin } from 'antd'

import styles from './styles.module.css'

import { ApprovalRouteResponse } from 'api/approvalApi.types'
import useCustomModal from 'hooks/useCustomModal'

import ApproverSteps from 'components/ApproverSteps'

import EditNextApproverModal from '../EditNextApproverModal'

interface ApprovalFlowProps {
  approvalRoute?: ApprovalRouteResponse
  isLoading?: boolean
  error?: Error | unknown
}

const ApprovalFlow = ({ approvalRoute, isLoading, error }: ApprovalFlowProps) => {
  const editNextApproverModalHook = useCustomModal()
  if (isLoading) {
    return (
      <div className={styles['approval-flow-container']}>
        <div className={styles['loading-container']}>
          <Spin tip="Loading approval flow..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles['approval-flow-container']}>
        <div className={styles['error-container']}>
          <p>Failed to load approval flow. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['approval-flow-container']}>
      <div className={styles['approval-flow-header']}>
        <p>APPROVAL FLOW</p>
        <Button onClick={editNextApproverModalHook.showModal}>Edit Next Approver</Button>
      </div>
      <div className={styles['approval-flow-content']}>
        <ApproverSteps small approvalRoute={approvalRoute} />
      </div>

      {/* Edit Next Approver Modal */}
      {editNextApproverModalHook.isModalMounted && (
        <EditNextApproverModal
          modalHook={editNextApproverModalHook}
          approvalRoute={approvalRoute}
        />
      )}
    </div>
  )
}

export default ApprovalFlow
