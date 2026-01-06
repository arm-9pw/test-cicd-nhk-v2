import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { clrBlack500 } from 'styles/theme'

import { ProcurementOperation } from 'api/procurementApi.types'

import { getRedirectUrl } from '../utils'

import TableSkeleton from './TableSkeleton'

interface Props {
  data: ProcurementOperation[]
  loading?: boolean
  handleDocumentLocationCellClick: (record: ProcurementOperation) => void
}

const ProcurementOperationsTable = ({ data, loading, handleDocumentLocationCellClick }: Props) => {
  const onClickCell = (record: ProcurementOperation) => {
    const redirectUrl = getRedirectUrl({ id: record.key, domain: record.operationType })
    if (redirectUrl) {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const columns: ColumnsType<ProcurementOperation> = [
    {
      title: 'Document No.',
      dataIndex: 'documentNo',
      key: 'documentNo',
      align: 'center',
      minWidth: 200,
      fixed: 'left',
      render: (text, record) => {
        const redirectUrl = getRedirectUrl({ id: record.key, domain: record.operationType })
        return (
          <div
            className="hover-underline"
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => redirectUrl && window.open(redirectUrl, '_blank', 'noopener,noreferrer')}
          >
            {text || <div style={{ color: clrBlack500 }}>(คลิกเพื่อดู)</div>}
          </div>
        )
      },
      onCell: (record) => {
        return {
          onClick: () => {
            onClickCell(record)
          },
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      minWidth: 180,
      onCell: (record) => {
        return {
          onClick: () => {
            onClickCell(record)
          },
        }
      },
    },
    {
      title: 'Job Name',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center',
      minWidth: 180,
      onCell: (record) => {
        return {
          onClick: () => {
            onClickCell(record)
          },
        }
      },
    },
    {
      title: 'Requester',
      dataIndex: 'requester',
      key: 'requester',
      align: 'center',
      minWidth: 200,
      onCell: (record) => {
        return {
          onClick: () => {
            onClickCell(record)
          },
        }
      },
    },
    {
      title: 'PurchaseInCharge',
      dataIndex: 'purchaseInCharge',
      key: 'purchaseInCharge',
      align: 'center',
      minWidth: 180,
      onCell: (record) => {
        return {
          onClick: () => {
            onClickCell(record)
          },
        }
      },
    },
    {
      title: 'Document Location',
      dataIndex: 'documentLocation',
      key: 'documentLocation',
      align: 'center',
      minWidth: 220,
      render: (text, record) => {
        if (!record.documentNo) return <div style={{ color: clrBlack500 }}>{text}</div>
        return (
          <div className="hover-underline" style={{ textAlign: 'center', cursor: 'pointer' }}>
            {<div>{text ? text : ''}</div>}
          </div>
        )
        // return (
        //   <Button icon={<EyeOutlined />} onClick={() => handleDocumentLocationCellClick(record)}>
        //     Check Status
        //   </Button>
        // )
      },
      onCell: (record) => {
        return {
          onClick: () => {
            handleDocumentLocationCellClick(record)
          },
        }
      },
    },
  ]

  if (data.length === 0 && loading) {
    return <TableSkeleton active={true} />
  }

  return (
    <Table
      rowHoverable
      bordered
      size="small"
      tableLayout="auto"
      columns={columns}
      dataSource={data}
      // dataSource={[]}
      pagination={false}
      scroll={{ x: true }}
      loading={loading}
      rowKey="key"
      rowClassName="clickable-row"
      // rowClassName={(record, index) => {
      //   // Check if this record is a top-level row (exists in data) and has children
      //   const isOutermostParent = data.some(item => item.key === record.key) && record.children && record.children.length > 0;
      //   return isOutermostParent ? 'outermost-parent-row clickable-row' : 'clickable-row';
      // }}
      expandable={{
        defaultExpandAllRows: true,
      }}
      sticky={{ offsetHeader: 0 }}
      // locale={{ emptyText: <Empty description="No Data">TEST</Empty> }}
    />
  )
}

export default ProcurementOperationsTable
