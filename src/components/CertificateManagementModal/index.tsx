import React from 'react'

import { CheckCircleOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Modal, Result, Spin } from 'antd'

import css from './CertificateManagementModal.module.css'

import { useCertificateActions } from 'hooks/useCertificateActions'

export type CertificateModalMode = 'forgot' | 'regenerate'

type CertificateManagementModalProps = {
  isOpen: boolean
  onClose: () => void
  afterClose: () => void
  mode: CertificateModalMode
}

const modeConfig: Record<
  CertificateModalMode,
  {
    title: string
    icon: React.ReactNode
    description: string
    confirmText: string
    successTitle: string
    successDescription: string
  }
> = {
  forgot: {
    title: 'Forgot Passcode',
    icon: <MailOutlined />,
    description:
      'We will send your existing passcode to your registered email address. Please check your inbox after submitting.',
    confirmText: 'Send Passcode',
    successTitle: 'Passcode Sent',
    successDescription: 'Your passcode has been sent to your registered email address.',
  },
  regenerate: {
    title: 'Regenerate Certificate',
    icon: <ReloadOutlined />,
    description:
      'This will generate a new certificate and passcode. Your new passcode will be sent to your registered email address.',
    confirmText: 'Regenerate',
    successTitle: 'Certificate Regenerated',
    successDescription:
      'Your certificate has been regenerated and new passcode sent to your registered email address.',
  },
}

const CertificateManagementModal: React.FC<CertificateManagementModalProps> = ({
  isOpen,
  onClose,
  afterClose,
  mode,
}) => {
  const { requestPasscodeEmail, regenerateCertificate, isRequestingPasscode, isRegenerating } =
    useCertificateActions()

  const [isSuccess, setIsSuccess] = React.useState(false)
  const config = modeConfig[mode]
  const isLoading = isRequestingPasscode || isRegenerating

  const handleConfirm = async () => {
    let result

    if (mode === 'forgot') {
      result = await requestPasscodeEmail()
    } else {
      result = await regenerateCertificate()
    }

    if (result.success) {
      setIsSuccess(true)
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
    onClose()
  }

  const handleAfterClose = () => {
    setIsSuccess(false)
    afterClose()
  }

  return (
    <Modal
      title={
        <div className={css['modal-title']}>
          {config.icon}
          <span>{config.title}</span>
        </div>
      }
      open={isOpen}
      onCancel={isLoading ? undefined : handleClose}
      afterClose={handleAfterClose}
      footer={null}
      destroyOnClose
      centered
      width={450}
      closable={!isLoading}
      maskClosable={!isLoading}
      className={css['certificate-modal']}
    >
      <Spin spinning={isLoading} tip="Processing...">
        {isSuccess ? (
          <Result
            status="success"
            icon={<CheckCircleOutlined className={css['success-icon']} />}
            title={config.successTitle}
            subTitle={config.successDescription}
            extra={[
              <Button key="close" type="primary" onClick={handleClose}>
                Close
              </Button>,
            ]}
          />
        ) : (
          <div className={css['modal-content']}>
            <p className={css['description']}>{config.description}</p>

            <div className={css['button-group']}>
              <Button onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleConfirm} loading={isLoading}>
                {config.confirmText}
              </Button>
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  )
}

export default CertificateManagementModal
