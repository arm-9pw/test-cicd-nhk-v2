// NOTE: ไม่ได้ render pdf ที่ frontend แล้ว เป็นการใช้ API แล้ว [25 Nov 2025]
import { PrinterOutlined } from '@ant-design/icons'
import { Drawer, Spin } from 'antd'

import { PurchaseOrderRespType } from 'api/poApi.types'

import HeaderTitle from 'components/HeaderTitle'

import BCSpdfBuilder from './pdf/BCSpdfBuilder'

// import PdfBCSContainer from './PdfPORender/PdfBCSContainer'

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
}

const content = <div style={contentStyle} />

type POBCSPrintDrawerProps = {
  open: boolean
  poData?: PurchaseOrderRespType | null
  onClose: () => void
}

const POBCSPrintDrawer = ({ onClose, open, poData }: POBCSPrintDrawerProps) => {
  return (
    <Drawer
      title={<HeaderTitle title="พิมพ์ BUDGET CONTROL SHEET" titlePreIcon={<PrinterOutlined />} />}
      onClose={onClose}
      open={open}
      width="80vw"
      height="100vh"
    >
      {poData ? (
        <BCSpdfBuilder poData={poData} />
      ) : (
        <Spin tip="Loading Data ..." size="large">
          {content}
        </Spin>
      )}
    </Drawer>
  )
}

export default POBCSPrintDrawer
