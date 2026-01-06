import React from 'react'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Space } from 'antd'

import css from './CertificateExpiredModal.module.css'

import HeaderTitle from 'components/HeaderTitle'

type CertificateExpiredModalProps = {
  isOpen: boolean
  onClose: () => void
  afterClose: () => void
  onRegenerateClick: () => void
  hasCertificate: boolean
  message?: string
}

const CertificateExpiredModal: React.FC<CertificateExpiredModalProps> = ({
  isOpen,
  onClose,
  afterClose,
  onRegenerateClick,
  hasCertificate,
  message,
}) => {
  const handleRegenerate = () => {
    onClose()
    onRegenerateClick()
  }

  // Determine title and messages based on whether user has a certificate
  const title = hasCertificate ? 'Certificate Expired' : 'Certificate Required'
  const buttonText = hasCertificate ? 'Regenerate Certificate' : 'Generate Certificate'
  const defaultMessage = hasCertificate
    ? 'Your certificate has expired. Please regenerate your certificate to continue using approval features.'
    : 'You do not have a certificate. Please generate a certificate to use approval features.'

  return (
    <Modal
      title={
        <HeaderTitle
          title={title}
          titlePreIcon={<ExclamationCircleOutlined className={css['warning-icon']} />}
        />
      }
      open={isOpen}
      onCancel={onClose}
      afterClose={afterClose}
      footer={
        <Space>
          <Button onClick={onClose}>Close</Button>
          <Button type="primary" onClick={handleRegenerate}>
            {buttonText}
          </Button>
        </Space>
      }
      className={css['expired-modal']}
      destroyOnClose
    >
      <div className={css['modal-content']}>
        <p className={css['expired-message']}>{message || defaultMessage}</p>
        <p className={css['info-text']}>
          A passcode will be sent to your registered email address after generation.
        </p>
      </div>
    </Modal>
  )
}

export default CertificateExpiredModal
