import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

import { poEnquiryResponse } from 'api/enquiryApi.types'

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

export const columns: ColumnsType<poEnquiryResponse> = [
  {
    title: 'NO.',
    dataIndex: 'no',
    key: 'no',
    align: 'center',
    fixed: 'left' as const,
  },
  {
    title: 'PO. No.',
    dataIndex: 'poNo',
    key: 'poNo',
    align: 'center',
    minWidth: 140,
    fixed: 'left' as const,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'PO. Date',
    dataIndex: 'poDate',
    key: 'poDate',
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
    dataIndex: 'purchaseStatus',
    key: 'purchaseStatus',
    align: 'center',
    minWidth: 120,
    render: (text) => <span style={{ color: getStatusColor(text) }}>{text}</span>,
  },
  {
    title: 'Ref PR. No.',
    dataIndex: 'prNo',
    key: 'prNo',
    align: 'center',
    minWidth: 150,
    render: (text) => <div style={{ textAlign: 'left' }}>{text || '-'}</div>,
  },
  {
    title: 'Requester',
    dataIndex: 'purchaserName',
    key: 'purchaserName',
    align: 'center',
    minWidth: 250,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Grand Total',
    dataIndex: 'monetaryBaht',
    key: 'monetaryBaht',
    align: 'center',
    minWidth: 120,
    render: (value: number) => <div style={{ textAlign: 'right' }}>{formatNumber(value)}</div>,
  },
  {
    title: 'Supplier Name',
    dataIndex: 'supplierName',
    key: 'supplierName',
    align: 'center',
    minWidth: 350,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },

  {
    title: 'Site',
    dataIndex: 'purchaserSite',
    key: 'purchaserSite',
    align: 'center',
    minWidth: 80,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Section',
    dataIndex: 'purchaserSection',
    key: 'purchaserSection',
    align: 'center',
    minWidth: 180,
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
]
