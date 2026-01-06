import React, { useMemo } from 'react'

import { Table, TableProps } from 'antd'

import { clrWhite700 } from 'styles/theme'

export interface BudgetData {
  siteName: string
  budgetPlan: number
  totalUse: number
  remaining: number
  percentUse: number
}

const budgetData: BudgetData[] = [
  {
    siteName: 'DDS',
    budgetPlan: 807285590,
    totalUse: 4759750,
    remaining: 802525840,
    percentUse: 0.59,
  },
  {
    siteName: 'Precision',
    budgetPlan: 238259570,
    totalUse: 28354265,
    remaining: 209905305,
    percentUse: 11.9,
  },
  {
    siteName: 'Suspension',
    budgetPlan: 185004620,
    totalUse: 21487570,
    remaining: 163517050,
    percentUse: 11.61,
  },
  {
    siteName: 'Bangpoo',
    budgetPlan: 144721600,
    totalUse: 19384794,
    remaining: 125336806,
    percentUse: 13.39,
  },
  {
    siteName: 'Banpho',
    budgetPlan: 134101500,
    totalUse: 2595671,
    remaining: 131505829,
    percentUse: 1.94,
  },
  {
    siteName: 'Head Office',
    budgetPlan: 80313980,
    totalUse: 12519031,
    remaining: 67794949,
    percentUse: 15.59,
  },
  {
    siteName: 'Hemaraj',
    budgetPlan: 19024050,
    totalUse: 693088,
    remaining: 18330962,
    percentUse: 3.64,
  },
]

const BudgetTable: React.FC = () => {
  const dataWithSummary = useMemo(() => {
    const totals = budgetData.reduce(
      (acc, curr) => {
        acc.budgetPlan += curr.budgetPlan
        acc.totalUse += curr.totalUse
        acc.remaining += curr.remaining
        return acc
      },
      { budgetPlan: 0, totalUse: 0, remaining: 0 },
    )

    const totalPercentUse = (totals.totalUse / totals.budgetPlan) * 100

    return [
      ...budgetData,
      {
        siteName: 'Total',
        budgetPlan: totals.budgetPlan,
        totalUse: totals.totalUse,
        remaining: totals.remaining,
        percentUse: totalPercentUse,
      },
    ]
  }, [])

  const columns: TableProps<BudgetData>['columns'] = [
    {
      title: 'Site Name',
      dataIndex: 'siteName',
      key: 'siteName',
      align: 'center',
      render: (text, _, index) => (
        <div
          style={
            index === budgetData.length
              ? { fontWeight: 'bold', textAlign: 'left' }
              : { textAlign: 'left' }
          }
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Budget Plan',
      dataIndex: 'budgetPlan',
      key: 'budgetPlan',
      align: 'center',
      render: (value: number, _, index) => (
        <div
          style={
            index === budgetData.length
              ? { fontWeight: 'bold', textAlign: 'right' }
              : { textAlign: 'right' }
          }
        >
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Total Use (PO.)',
      dataIndex: 'totalUse',
      key: 'totalUse',
      align: 'center',
      render: (value: number, _, index) => (
        <div
          style={
            index === budgetData.length
              ? { fontWeight: 'bold', textAlign: 'right' }
              : { textAlign: 'right' }
          }
        >
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Remaining',
      dataIndex: 'remaining',
      key: 'remaining',
      align: 'center',
      render: (value: number, _, index) => (
        <div
          style={
            index === budgetData.length
              ? { fontWeight: 'bold', textAlign: 'right' }
              : { textAlign: 'right' }
          }
        >
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: '% Use',
      dataIndex: 'percentUse',
      key: 'percentUse',
      align: 'center',
      render: (value: number, _, index) => (
        <div
          style={
            index === budgetData.length
              ? { fontWeight: 'bold', textAlign: 'right' }
              : { textAlign: 'right' }
          }
        >
          {value.toFixed(2)}%
        </div>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataWithSummary}
      pagination={false}
      size="small"
      rowKey="siteName"
      rowClassName={(_, index) =>
        index === budgetData.length ? 'summary-row' : ''
      }
      onRow={(_, index) => ({
        style:
          index === budgetData.length ? { backgroundColor: clrWhite700 } : {},
      })}
      scroll={{ x: true }}
    />
  )
}

export default BudgetTable
