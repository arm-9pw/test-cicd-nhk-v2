import { Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'

import { DelegationStatus, DelegationType } from 'api/delegationApi.types'

import { formatDisplayDate } from 'utils/dateHelpers'

import { TAB_KEYS } from '../../constants'

const { Text } = Typography

const getStatusTagColor = (status: DelegationStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'green'
    case 'PENDING':
      return 'gold'
    case 'EXPIRED':
      return 'default'
    case 'INACTIVE':
      return 'volcano'
    case 'CANCELLED':
      return 'red'
    default:
      return 'default'
  }
}

export const getColumns = (delegationType: string): ColumnsType<DelegationType> => [
  {
    title: 'Name',
    dataIndex: delegationType === TAB_KEYS.DELEGATE_TO ? 'delegateName' : 'delegatorName',
    width: 200,
    align: 'center',
    render: (text: string) => <Text style={{ textAlign: 'left' }}>{text}</Text>,
  },
  {
    title: 'Position',
    dataIndex: delegationType === TAB_KEYS.DELEGATE_TO ? 'delegatePosition' : 'delegatorPosition',
    width: 150,
    align: 'center',
    render: (text: string) => <Text style={{ textAlign: 'left' }}>{text}</Text>,
  },
  {
    title: 'Section',
    dataIndex:
      delegationType === TAB_KEYS.DELEGATE_TO ? 'delegateSectionName' : 'delegatorSectionName',
    width: 200,
    align: 'center',
    render: (text: string) => <Text style={{ textAlign: 'left' }}>{text}</Text>,
  },
  {
    title: 'Period',
    dataIndex: 'period',
    width: 200,
    align: 'center',
    render: (_, record) => {
      return (
        <Text>
          {formatDisplayDate(record.activatedAt)} - {formatDisplayDate(record.expiredAt)}
        </Text>
      )
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 80,
    align: 'center',
    render: (status: DelegationStatus) => (
      <Tag color={getStatusTagColor(status)} style={{ marginRight: 0 }}>
        {status}
      </Tag>
    ),
  },
]
