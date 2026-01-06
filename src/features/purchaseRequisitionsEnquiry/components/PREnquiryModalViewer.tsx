import React from 'react'

import { Modal } from 'antd'

import { PAGE_MODE } from 'constants/index'

import PRDocumentForm from './PRDocumentForm'

interface PREnquiryModalProps {
  prId: string | null
  open: boolean
  onClose: () => void
}

const PREnquiryModalViewer: React.FC<PREnquiryModalProps> = ({ prId, open, onClose }) => {
  const mode = PAGE_MODE.VIEW
  return (
    <Modal centered open={open} onOk={onClose} onCancel={onClose} width="80%" footer={null}>
      {prId !== null && <PRDocumentForm prId={prId} onClose={onClose} open={open} mode={mode} />}
    </Modal>
  )
}

export default PREnquiryModalViewer
