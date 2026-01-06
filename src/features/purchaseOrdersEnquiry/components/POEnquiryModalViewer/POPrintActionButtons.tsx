// components/POPrintActionButtons.tsx
import React from 'react'

import { PrinterOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'

import { PurchaseOrderRespType } from 'api/poApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import useDrawer from 'hooks/useDrawer'

// import POBCSPrintDrawer from 'features/purchaseOrder/components/POBCSPrintDrawer'
import POPrintDrawer from 'features/purchaseOrder/components/POPrintDrawer'

const POPrintActionButtons: React.FC<{ poData: PurchaseOrderRespType }> = ({ poData }) => {
  const printDrawer = useDrawer()
  const bcsPrintDrawer = useDrawer()
  const dispatch = useAppDispatch()

  const handlePrint = () => {
    dispatch(showLoading())
    printDrawer.showDrawer()
    setTimeout(() => dispatch(hideLoading()), 1200)
  }

  const handlePrintBCS = () => {
    dispatch(showLoading())
    bcsPrintDrawer.showDrawer()
    setTimeout(() => dispatch(hideLoading()), 1200)
  }

  return (
    <>
      <Space
        style={{ marginTop: 16, marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button
          size="large"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          style={{ backgroundColor: '#2a80e0', color: '#fff' }}
        >
          Print PO
        </Button>

        <Button
          size="large"
          icon={<PrinterOutlined />}
          onClick={handlePrintBCS}
          style={{ backgroundColor: '#2a80e0', color: '#fff' }}
        >
          Print Budget Control Sheet
        </Button>
      </Space>

      <POPrintDrawer
        onClose={printDrawer.onClose}
        open={printDrawer.open}
        poData={poData}
        previewType="signed-po"
        modalTitle="พิมพ์ใบสั่งซื้อสินค้า/PURCHASE ORDER(PO.)"
      />
      <POPrintDrawer
        onClose={bcsPrintDrawer.onClose}
        open={bcsPrintDrawer.open}
        poData={poData}
        previewType="po-budget"
        modalTitle="พิมพ์ BUDGET CONTROL SHEET"
      />
    </>
  )
}

export default POPrintActionButtons
