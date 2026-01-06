import { Divider, Typography } from 'antd'

import styles from '../styles.module.css'

import { ApprovalStep, ApproverHierarchyItem } from 'api/approvalApi.types'

import ApproverDropdown from 'components/ApproverDropdown'

const { Text } = Typography

type Props = {
  step: ApprovalStep
  selectedApprover: {
    stepId: string
    approver: ApproverHierarchyItem
  } | null
  isUpdatingApprover: boolean
  onApproverChange: (stepId: string, approver: ApproverHierarchyItem) => void
}

const EditNextApproverDropdown = ({
  step,
  selectedApprover,
  isUpdatingApprover,
  onApproverChange,
}: Props) => {
  return (
    <div className={styles['approver-dropdown']}>
      <ApproverDropdown
        positionId={step.positionId}
        // Use the selected value from state if available, otherwise use primaryApproverId as default
        value={
          selectedApprover ? selectedApprover.approver.primaryApproverId : step.primaryApproverId
        }
        placeholder="Select approver"
        onChange={(_: string, option: ApproverHierarchyItem) =>
          onApproverChange(step.stepId, option)
        }
        loading={isUpdatingApprover && selectedApprover?.stepId === step.stepId}
        disabled={isUpdatingApprover}
      />

      <div className={styles['step-description']}>
        {step.isDelegated ? (
          <>
            <div className={styles['delegate-container']}>
              <Divider className={styles['title']} style={{ borderColor: 'var(--status-pending)' }}>
                Authorize To
              </Divider>
              <Text className={styles['delegate-to']}>{step.delegatedApproverName}</Text>
            </div>
            <Text type="secondary" className={styles['step-position']}>
              {step.delegatedApproverPosName}
            </Text>
            <Text type="secondary" className={styles['step-section']}>
              {step.delegatedApproverSectionName}
            </Text>
          </>
        ) : (
          <>
            <Text type="secondary" className={styles['step-position']}>
              {step.positionName}
            </Text>
            <Text type="secondary" className={styles['step-section']}>
              {step.primaryApproverSectionName}
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default EditNextApproverDropdown
