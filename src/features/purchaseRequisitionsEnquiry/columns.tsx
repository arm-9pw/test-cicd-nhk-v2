import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

import { prEnquiryResponse } from 'api/enquiryApi.types'

import { DISPLAY_DATE_FORMAT } from 'utils/dateHelpers'
import { formatNumber } from 'utils/generalHelpers'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'GR_COMPLETE':
      return 'green'
    case 'PR_REVISED':
      return 'orange'
    case 'PO_APPROVED':
      return 'blue'
    default:
      return 'default'
  }
}

export const columns: ColumnsType<prEnquiryResponse> = [
  { title: 'NO.', dataIndex: 'no', key: 'no', align: 'center', fixed: 'left' as const },
  {
    title: 'PR. No.',
    dataIndex: 'prNo',
    key: 'prNo',
    align: 'center',
    minWidth: 150,
    fixed: 'left' as const,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'PR. Date',
    dataIndex: 'prDate',
    key: 'prDate',
    align: 'center',
    minWidth: 120,
    render: (text) => (
      <div style={{ textAlign: 'left' }}>
        {text ? dayjs(text).format(DISPLAY_DATE_FORMAT) : '-'}
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    minWidth: 180,
    render: (text) => (
      <span style={{ color: getStatusColor(text), textAlign: 'left' }}>{text}</span>
    ),
  },
  {
    title: 'Budget Code',
    dataIndex: 'budgetCode',
    key: 'budgetCode',
    align: 'center',
    minWidth: 250,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Requester',
    dataIndex: 'requester',
    key: 'requester',
    align: 'center',
    minWidth: 260,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Grand Total',
    dataIndex: 'grandTotal',
    key: 'grandTotal',
    align: 'center',
    minWidth: 120,
    render: (value: number) => <div style={{ textAlign: 'right' }}>{formatNumber(value)}</div>,
  },
  {
    title: 'Site',
    dataIndex: 'site',
    key: 'site',
    align: 'center',
    minWidth: 80,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Section',
    dataIndex: 'section',
    key: 'section',
    align: 'center',
    minWidth: 180,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
]
