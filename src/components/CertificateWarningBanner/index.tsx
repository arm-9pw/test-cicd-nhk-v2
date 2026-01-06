import React, { useState } from 'react'

import { CloseOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert, Button } from 'antd'

import css from './CertificateWarningBanner.module.css'

import { useCertificateStatus } from 'hooks/useCertificateStatus'

type CertificateWarningBannerProps = {
  onRenewClick: () => void
}

const CertificateWarningBanner: React.FC<CertificateWarningBannerProps> = ({ onRenewClick }) => {
  const { isExpiring, daysUntilExpiry, message } = useCertificateStatus()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isExpiring || isDismissed) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  const warningMessage =
    daysUntilExpiry === 1
      ? 'Your certificate expires tomorrow'
      : daysUntilExpiry === 0
        ? 'Your certificate expires today'
        : `Your certificate expires in ${daysUntilExpiry} days`

  return (
    <div className={css['banner-container']}>
      <Alert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message={
          <div className={css['banner-content']}>
            <span className={css['banner-message']}>
              {warningMessage}. {message}
            </span>
            <div className={css['banner-actions']}>
              <Button type="primary" size="small" onClick={onRenewClick}>
                Renew Now
              </Button>
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={handleDismiss}
                className={css['dismiss-button']}
                aria-label="Dismiss warning"
              />
            </div>
          </div>
        }
        className={css['warning-banner']}
        banner
      />
    </div>
  )
}

export default CertificateWarningBanner
