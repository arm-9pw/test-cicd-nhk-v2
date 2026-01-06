import { ColumnsType } from 'antd/es/table'

import { BudgetsResponseType } from 'api/budgetManagementApi.types'

import { formatNumber } from 'utils/generalHelpers'

export const columns: ColumnsType<BudgetsResponseType> = [
  {
    title: 'Budget Type',
    dataIndex: 'budgetTypeName',
    key: 'budgetType',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
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
    title: 'Budget Year',
    dataIndex: 'budgetYear',
    key: 'budgetYear',
    align: 'center',
  },
  {
    title: 'Budget Amount',
    dataIndex: 'budgetAmount',
    key: 'budgetAmount',
    align: 'center',
    render: (value: number) => {
      return <div style={{ textAlign: 'right' }}>{formatNumber(value)}</div>
    },
  },
  {
    title: 'Status',
    dataIndex: 'isActiveBudget',
    key: 'isActiveBudget',
    align: 'center',
    render: (value: boolean) => {
      return value ? 'Active' : 'Inactive'
    },
  },
]
