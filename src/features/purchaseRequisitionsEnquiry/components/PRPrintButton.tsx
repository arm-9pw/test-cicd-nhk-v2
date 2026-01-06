// components/PrintButtonWithDrawer.tsx
import React from 'react'

import { PrinterOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { PurchaseRequisitionRespType } from 'api/prApi.types'
import useDrawer from 'hooks/useDrawer'

import PRPrintDrawer from 'features/purchaseRequisition/components/PRPrintDrawer'

type Props = {
  prData: PurchaseRequisitionRespType // หรือใช้ PRDataType ถ้าระบุ type ได้
}

const PRPrintButton: React.FC<Props> = ({ prData }) => {
  const printDrawer = useDrawer()

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
      <Button
        icon={<PrinterOutlined />}
        onClick={printDrawer.showDrawer}
        type="primary"
        style={{ backgroundColor: '#2a80e0' }}
        size="large"
      >
        Print
      </Button>

      <PRPrintDrawer onClose={printDrawer.onClose} open={printDrawer.open} prData={prData} />
    </div>
  )
}

export default PRPrintButton
