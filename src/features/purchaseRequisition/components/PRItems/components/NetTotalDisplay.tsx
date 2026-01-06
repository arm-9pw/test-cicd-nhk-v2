import { Form } from 'antd'

import { PrItemType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { formatNumber } from 'utils/generalHelpers'

import { calculateNetTotal } from '../utils'

type NetTotalDisplayProps = {
  record: PrItemType
  isEditOrNew: boolean
}

const NetTotalDisplay = ({ record, isEditOrNew }: NetTotalDisplayProps) => (
  <Form.Item noStyle dependencies={['qty', 'unitPrice', 'unitDiscount']}>
    {({ getFieldsValue }) => {
      const { qty = 0, unitPrice = 0, unitDiscount = 0 } = getFieldsValue()
      const total = isEditOrNew ? calculateNetTotal(qty, unitPrice, unitDiscount) : record.netTotal
      return formatNumber(total) || 0
    }}
  </Form.Item>
)

export default NetTotalDisplay
