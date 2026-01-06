import { Typography } from 'antd'

import styles from '../styles.module.css'

import { ApprovalStep } from 'api/approvalApi.types'

const { Text } = Typography

type Props = {
  step: ApprovalStep
}

const ApproverDescription = ({ step }: Props) => {
  return (
    <div className={styles['step-description']}>
      <Text
        className={`${styles['step-name']} ${step.isDelegated ? styles['delegator-name'] : ''}`}
      >
        {step.primaryApproverName}
      </Text>
      <Text type="secondary" className={styles['step-position']}>
        {step.positionName}
      </Text>
      <Text type="secondary" className={styles['step-section']}>
        {step.primaryApproverSectionName}
      </Text>
    </div>
  )
}

export default ApproverDescription
