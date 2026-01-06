import { PrinterOutlined } from '@ant-design/icons'
import { Drawer, Result, Spin } from 'antd'

import { PurchaseRequisitionRespType } from 'api/prApi.types'

import HeaderTitle from 'components/HeaderTitle'

import { usePrDocumentPreview } from './hooks/usePrDocumentPreview'

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  minHeight: '80vh',
}

type PRPrintDrawerProps = {
  open: boolean
  prData?: PurchaseRequisitionRespType
  onClose: () => void
}

const PRPrintDrawer = ({ onClose, open, prData }: PRPrintDrawerProps) => {
  const documentId = prData?.purchaseRequisitionId || prData?.id || null
  const { previewState } = usePrDocumentPreview({
    open,
    documentId,
  })

  const renderPreview = () => {
    if (previewState.isLoading) {
      return (
        <Spin tip="Loading Purchase Requisition ..." size="large" style={{ minHeight: '80vh' }}>
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
          title="PR preview"
        />
      )
    }

    return <Result status="warning" title="Preview Not Available." />
  }

  return (
    <Drawer
      title={
        <HeaderTitle
          title="พิมพ์ใบขอสั่งซื้อ/PURCHASE REQUISITION(PR.)"
          titlePreIcon={<PrinterOutlined />}
        />
      }
      onClose={onClose}
      open={open}
      width="80vw"
      height="100vh"
    >
      {renderPreview()}
    </Drawer>
  )
}

export default PRPrintDrawer
