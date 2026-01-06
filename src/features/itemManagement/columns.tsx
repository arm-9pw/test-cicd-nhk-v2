import { ColumnsType } from 'antd/es/table'

import { ItemManagementRespType } from 'api/itemManagementApiType'

export const columns: ColumnsType<ItemManagementRespType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align: 'center' as const,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    align: 'center',
    width: 180,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
    align: 'center',
    width: 180,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Detail',
    dataIndex: 'detail',
    key: 'detail',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Qty',
    dataIndex: 'qty',
    key: 'qty',
    align: 'center',
    width: 100,
    render: (text) => <div style={{ textAlign: 'right' }}>{text}</div>,
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    key: 'unit',
    align: 'center',
    width: 100,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Unit Price',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    align: 'center',
    width: 100,
    render: (text) => <div style={{ textAlign: 'right' }}>{text}</div>,
  },
]
