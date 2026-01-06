import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Popconfirm } from 'antd'
import { ColumnsType } from 'antd/es/table'

import { NewBudgetSiteInfoType } from 'api/allocateManagementApi.types'

import BudgetDropdown, { BudgetDropdownType } from 'components/BudgetDropdown'

import { formatNumber } from 'utils/generalHelpers'

type ColumnProps = {
  onSelectBudgetCode: (option: BudgetDropdownType) => void
  onAddBudget: (record: NewBudgetSiteInfoType) => void
  onDeleteBudget: (record: NewBudgetSiteInfoType) => void
}

export const columns = ({
  onSelectBudgetCode,
  onAddBudget,
  onDeleteBudget,
}: ColumnProps): ColumnsType<NewBudgetSiteInfoType> => {
  return [
    {
      title: 'Budget Code',
      dataIndex: 'budgetCode',
      key: 'budgetCode',
      align: 'center',
      minWidth: 300,
      render: (value: string, record) => {
        if (record.key === 'new') {
          return (
            <Form.Item name="budgetCode" rules={[{ required: true }]}>
              <BudgetDropdown
                onChange={(_value, option) => {
                  const optionValue = option as BudgetDropdownType
                  onSelectBudgetCode(optionValue)
                }}
              />
            </Form.Item>
          )
        }
        return <div style={{ textAlign: 'center' }}>{value}</div>
      },
    },
    {
      title: 'Budget Type',
      dataIndex: 'budgetTypeName',
      key: 'budgetTypeName',
      align: 'center',
      render: (value: string, record) => {
        if (record.key === 'new') {
          return (
            <Form.Item name="budgetTypeName">
              <Input disabled />
            </Form.Item>
          )
        }
        return <div style={{ textAlign: 'center' }}>{value}</div>
      },
    },
    {
      title: 'Budget Year',
      dataIndex: 'budgetYear',
      key: 'budgetYear',
      align: 'center',
      render: (value: number, record) => {
        if (record.key === 'new') {
          return (
            <Form.Item name="budgetYear">
              <Input disabled />
            </Form.Item>
          )
        }
        return <div style={{ textAlign: 'center' }}>{value}</div>
      },
    },
    {
      title: 'Budget Amount',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      align: 'center',
      render: (value: number, record) => {
        if (record.key === 'new') {
          return (
            <Form.Item name="budgetAmount">
              <InputNumber
                disabled
                style={{ width: '100%' }}
                min={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          )
        }
        return <div style={{ textAlign: 'right' }}>{formatNumber(value)}</div>
      },
    },
    {
      title: 'Action',
      width: 80,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: unknown, record) => {
        if (record.key === 'new') {
          return (
            <Button
              size="small"
              color="primary"
              variant="outlined"
              icon={<PlusOutlined />}
              onClick={() => onAddBudget(record)}
            />
          )
        }
        return (
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => onDeleteBudget(record)}
          >
            <Button danger type="primary" size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        )
      },
    },
  ]
}
