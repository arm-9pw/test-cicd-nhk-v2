import { Divider, Typography } from 'antd'

import styles from '../styles.module.css'

import { ApprovalStep } from 'api/approvalApi.types'

const { Text } = Typography

type Props = {
  step: ApprovalStep
}

const AuthorizedApproverDescription = ({ step }: Props) => {
  return (
    <div className={styles['step-description']}>
      <Text
        className={`${styles['step-name']} ${step.isDelegated ? styles['delegator-name'] : ''}`}
      >
        {step.primaryApproverName}
      </Text>
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
    </div>
  )
}

export default AuthorizedApproverDescription
