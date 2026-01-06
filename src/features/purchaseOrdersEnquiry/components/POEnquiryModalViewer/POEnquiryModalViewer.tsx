import React from 'react'

import { Modal } from 'antd'

import { PAGE_MODE } from 'constants/index'

import PODocumentForm from './PODocumentForm'

interface POEnquiryModalViewerProps {
  poId: string | null
  open: boolean
  onClose: () => void
}

const POEnquiryModalViewer: React.FC<POEnquiryModalViewerProps> = ({ poId, open, onClose }) => {
  const mode = PAGE_MODE.VIEW

  return (
    <Modal centered open={open} onOk={onClose} onCancel={onClose} width="80%" footer={null}>
      {poId !== null && <PODocumentForm mode={mode} poId={poId} />}
    </Modal>
  )
}

export default POEnquiryModalViewer
