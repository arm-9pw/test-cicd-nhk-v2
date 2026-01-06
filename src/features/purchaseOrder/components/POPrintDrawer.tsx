import { PrinterOutlined } from '@ant-design/icons'
import { Drawer, Result, Spin } from 'antd'

import { PurchaseOrderRespType } from 'api/poApi.types'

import HeaderTitle from 'components/HeaderTitle'

import { usePoDocumentPreview } from './hooks/usePoDocumentPreview'

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  minHeight: '80vh',
}

type POPrintDrawerProps = {
  open: boolean
  poData?: PurchaseOrderRespType | null
  onClose: () => void
  previewType: 'signed-po' | 'po-budget'
  modalTitle: string
}

const POPrintDrawer = ({ onClose, open, poData, previewType, modalTitle }: POPrintDrawerProps) => {
  const documentId = poData?.id || null
  const { previewState } = usePoDocumentPreview({
    open,
    documentId,
    previewType,
  })

  const renderPreview = () => {
    if (previewState.isLoading) {
      return (
        <Spin tip="Loading Purchase Order ..." size="large" style={{ minHeight: '80vh' }}>
          <div style={contentStyle} />
        </Spin>
      )
    }

    if (previewState.error) {
      return <Result status="error" title="Preview Error" subTitle={previewState.error} />
    }

    if (previewState.url && previewState.type === 'pdf') {
      return (
        <iframe
          src={previewState.url}
          style={{ width: '100%', minHeight: '80vh', border: 'none' }}
          title="PO preview"
        />
      )
    }

    return <Result status="warning" title="Preview Not Available." />
  }

  return (
    <Drawer
      title={<HeaderTitle title={modalTitle} titlePreIcon={<PrinterOutlined />} />}
      onClose={onClose}
      open={open}
      width="80vw"
      height="100vh"
    >
      {renderPreview()}
    </Drawer>
  )
}

export default POPrintDrawer
