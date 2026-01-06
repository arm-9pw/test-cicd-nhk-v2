import { ColumnsType } from 'antd/es/table'

import { SupplierType } from 'api/supplierApi.types'

export const columns: ColumnsType<SupplierType> = [
  {
    title: 'Supplier Name',
    dataIndex: 'supplierName',
    key: 'supplierName',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Address',
    dataIndex: 'supplierAddress',
    key: 'supplierAddress',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Payment Term',
    dataIndex: 'paymentTermName',
    key: 'paymentTermName',
    width: 150,
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
]
