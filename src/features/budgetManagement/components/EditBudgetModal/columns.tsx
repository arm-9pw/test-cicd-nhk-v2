import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, InputNumber, Popconfirm } from 'antd'
import { ColumnsType } from 'antd/es/table'

import { BudgetSiteResponseType } from 'api/budgetManagementApi.types'

// Monthly Budget Columns (existing)
export const columns: ColumnsType = [
  ...Array.from({ length: 12 }, (_, index) => {
    const month = `budgetAmountMonth${index + 1}`
    return {
      title: `M${index + 1}`,
      dataIndex: month,
      key: month,
      align: 'center' as const,
      minWidth: 150,
      render: (value: number) => {
        return (
          <Form.Item name={month}>
            <InputNumber
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
              min={0}
              style={{ width: '100%' }}
              value={value}
            />
          </Form.Item>
        )
      },
    }
  }),
]

// Budget Site Columns (new)
export const budgetSiteColumns = (
  onDeleteBudgetSite: (record: BudgetSiteResponseType) => void,
): ColumnsType<BudgetSiteResponseType> => [
  {
    title: 'Site Code',
    dataIndex: 'siteCode',
    key: 'siteCode',
    align: 'center' as const,
    minWidth: 100,
    render: (text: string) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Organization Name',
    dataIndex: 'organizationName',
    key: 'organizationName',
    align: 'center' as const,
    render: (text: string) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Organization Code',
    dataIndex: 'organizationCode',
    key: 'organizationCode',
    align: 'center' as const,
    render: (text: string) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    key: 'action',
    align: 'center' as const,
    width: 80,
    render: (_: unknown, record: BudgetSiteResponseType) => (
      <Popconfirm
        title="Are you sure you want to delete this budget site?"
        onConfirm={() => onDeleteBudgetSite(record)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger type="text" icon={<DeleteOutlined />} size="small" />
      </Popconfirm>
    ),
  },
]
