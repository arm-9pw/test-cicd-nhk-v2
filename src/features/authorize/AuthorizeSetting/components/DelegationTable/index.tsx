import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'

import { DelegationType } from 'api/delegationApi.types'

import HeaderTitle from 'components/HeaderTitle'

import { TAB_KEYS } from '../../constants'

import { getColumns } from './columns'

interface DelegationTableProps {
  data: DelegationType[]
  loading?: boolean
  delegationType: string
  onNewAuthorization?: () => void
  onRowClick?: (record: DelegationType) => void
}

const DelegationTable = ({
  data,
  loading = false,
  delegationType,
  onNewAuthorization,
  onRowClick,
}: DelegationTableProps) => {
  return (
    <div>
      <Table
        bordered
        columns={getColumns(delegationType)}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'auto' }}
        size="small"
        className="clickable-row"
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
        })}
        title={() => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              padding: '3px',
            }}
          >
            <HeaderTitle title="ผลการค้นหา" titlePreIcon={<SearchOutlined />} />
            {delegationType === TAB_KEYS.DELEGATE_TO && (
              <Button icon={<PlusOutlined />} type="primary" onClick={onNewAuthorization}>
                New Authorization
              </Button>
            )}
          </div>
        )}
      />
    </div>
  )
}

export default DelegationTable
