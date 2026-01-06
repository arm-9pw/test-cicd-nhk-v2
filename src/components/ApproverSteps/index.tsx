import { useMemo } from 'react'

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Typography } from 'antd'

import styles from './styles.module.css'
import ManMockAvatar from 'assets/images/man_profile.png'
import WomanMockAvatar from 'assets/images/woman_profile.png'

import { ApprovalRouteResponse, ApprovalStep, ApproverHierarchyItem } from 'api/approvalApi.types'

import { GENDER } from 'constants/index'
import { DISPLAY_DATE_FORMAT, formatUTCToBangkokDisplayDateTime } from 'utils/dateHelpers'
import { getGenderByName } from 'utils/generalHelpers'

import ApproverDescription from './components/ApproverDescription'
import AuthorizedApproverDescription from './components/AuthorizedApproverDescription'
import EditNextApproverDropdown from './components/EditNextApproverDropdown'
import { STEP_STATUS_LABELS } from './constant'
import { useChangeApprover } from './useChangeApprover'

const { Text } = Typography

type ApproverStepsProps = {
  approvalRoute?: ApprovalRouteResponse
  small?: boolean
  canEditNextApprover?: boolean
  onApproverChange?: (stepId: string, approver: ApproverHierarchyItem) => void
}

const ApproverSteps = ({
  approvalRoute,
  small = false,
  canEditNextApprover = false,
  onApproverChange,
}: ApproverStepsProps) => {
  const { selectedApprover, isUpdatingApprover, handleApproverChange } = useChangeApprover({
    routeId: approvalRoute?.routeId,
    onApproverChange,
  })

  // Manipulate approval steps: if all steps are pending, set first step to ASSIGNED
  const processedApprovalSteps = useMemo(() => {
    if (!approvalRoute) return []

    const steps = [...approvalRoute.approvalSteps]

    /* 
      NOTE: Request ตอนสร้างมาทีแรกมันจะเป็น status PENDING แต่ต้องแสดงผลเป็น ASSIGNED
    */
    // Filter out DELEGATED steps first, then check if all remaining steps are PENDING
    const nonDelegatedSteps = steps.filter((step) => !step.isDelegated)
    const allStepsPending = nonDelegatedSteps.every((step) => step.stepStatus === 'PENDING')

    if (allStepsPending && steps.length > 0) {
      // Modify the first step to be ASSIGNED
      steps[0] = {
        ...steps[0],
        stepStatus: 'ASSIGNED',
        active: true,
        pending: false,
        assigned: true,
      }
    }

    return steps
  }, [approvalRoute])

  if (!approvalRoute) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text>No approval route data available</Text>
      </div>
    )
  }

  const getStatusIcon = (step: ApprovalStep) => {
    if (step.approved) {
      return <CheckCircleOutlined className={styles['status-icon']} />
    }
    if (step.active || step.pending) {
      return <ClockCircleOutlined className={styles['status-icon']} />
    }
    if (step.rejected || step.stepStatus === 'CANCELLED') {
      return <CloseCircleOutlined className={styles['status-icon']} />
    }
    // Default icon for other statuses
    return <ClockCircleOutlined className={styles['status-icon']} />
  }

  const assignedIndex = processedApprovalSteps.findIndex((step) => step.stepStatus === 'ASSIGNED')
  const nextApproverIndex = assignedIndex === -1 ? -1 : assignedIndex + 1

  return (
    <div className={`${styles['steps-container']} ${small ? styles['small'] : ''}`}>
      {processedApprovalSteps.map((step, index) => (
        <div
          key={step.stepId}
          className={styles['step-box']}
          data-status={step.stepStatus.toLowerCase()}
        >
          <div className={styles['avatar-container']}>
            {index < processedApprovalSteps.length - 1 && (
              <div className={styles['connecting-line']} />
            )}
            {/* TODO:M Change avartar based on gender */}
            <Avatar
              size={small ? 70 : 90}
              icon={<UserOutlined />}
              src={
                getGenderByName(step.activeApproverName || '') === GENDER.FEMALE
                  ? WomanMockAvatar
                  : ManMockAvatar
              }
              className={styles.avatar}
            />
            <div className={styles['status-badge']}>{getStatusIcon(step)}</div>
          </div>
          <div className={styles['step-status']}>
            <p>
              {STEP_STATUS_LABELS[step.stepStatus as keyof typeof STEP_STATUS_LABELS] ||
                step.stepStatus}
            </p>
          </div>

          {canEditNextApprover && nextApproverIndex === index ? (
            <EditNextApproverDropdown
              step={step}
              selectedApprover={selectedApprover}
              isUpdatingApprover={isUpdatingApprover}
              onApproverChange={handleApproverChange}
            />
          ) : step.isDelegated ? (
            <AuthorizedApproverDescription step={step} />
          ) : (
            <ApproverDescription step={step} />
          )}

          {/* Show approval or rejection status with timestamp */}
          {step.completed && step.approvedAt && (
            <div className={styles['status-timestamp-container']}>
              {step.approved && (
                <Text className={`${styles['status-timestamp']} ${styles['status-approved']}`}>
                  Approved:{' '}
                  {formatUTCToBangkokDisplayDateTime(step.approvedAt, DISPLAY_DATE_FORMAT)}
                </Text>
              )}
              {step.rejected && (
                <Text className={`${styles['status-timestamp']} ${styles['status-rejected']}`}>
                  Rejected:{' '}
                  {formatUTCToBangkokDisplayDateTime(step.approvedAt, DISPLAY_DATE_FORMAT)}
                </Text>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ApproverSteps
