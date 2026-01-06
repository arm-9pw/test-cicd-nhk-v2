import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Popconfirm } from 'antd'

import CustomDatePicker from 'components/CustomDatePicker'

import { formatDisplayDate } from 'utils/dateHelpers'

import PRListDropdown, { PRListDropdownType } from '../PRListDropdown'

type TableRecord = {
  key: string
  prNo?: string
  prDate?: string
  requireDate?: string
  budgetCode?: string
  budgetDescription?: string
  requesterName?: string
}

type Props = {
  isDisabledAllForm: boolean
  selectedPR: PRListDropdownType | undefined
  onSelectPR: (value: PRListDropdownType | undefined) => void
  onAddPR: () => void
  onDeletePR: (key: string) => void
}

export const columns = ({
  isDisabledAllForm,
  selectedPR,
  onSelectPR,
  onAddPR,
  onDeletePR,
}: Props) => {
  return [
    {
      title: 'PR. No.',
      dataIndex: 'prNo',
      key: 'prNo',
      align: 'center' as const,
      width: '20%',
      render: (_: unknown, record: TableRecord) => {
        if (record.key !== 'new') {
          return record.prNo
        }
        return (
          <Form.Item name="prNo" rules={[{ required: true, message: 'Please select a PR.' }]}>
            <PRListDropdown value={selectedPR} onChange={onSelectPR} />
          </Form.Item>
        )
      },
    },
    {
      title: 'PR. Date',
      dataIndex: 'prDate',
      key: 'prDate',
      align: 'center' as const,
      render: (_: unknown, record: TableRecord) => {
        if (record.key !== 'new') {
          return formatDisplayDate(record.prDate)
        }
        return (
          <Form.Item name="prDate">
            <CustomDatePicker disabled placeholder="" />
          </Form.Item>
        )
      },
    },
    {
      title: 'Require Date',
      dataIndex: 'requireDate',
      key: 'requireDate',
      align: 'center' as const,
      render: (_: unknown, record: TableRecord) => {
        if (record.key !== 'new') {
          return formatDisplayDate(record.requireDate)
        }
        return (
          <Form.Item name="requireDate">
            <CustomDatePicker disabled placeholder="" />
          </Form.Item>
        )
      },
    },
    {
      title: 'Budget Code',
      dataIndex: 'budgetCode',
      key: 'budgetCode',
      align: 'center' as const,
      render: (_: unknown, record: TableRecord) => {
        if (record.key !== 'new') {
          return record.budgetCode
        }
        return (
          <Form.Item name="budgetCode">
            <Input disabled />
          </Form.Item>
        )
      },
    },
    {
      title: 'Budget Description',
      dataIndex: 'budgetDescription',
      key: 'budgetDescription',
      align: 'center' as const,
      render: (_: unknown, record: TableRecord) => {
        if (record.key !== 'new') {
          return record.budgetDescription || '-'
        }
        return (
          <Form.Item name="budgetDescription">
            <Input disabled />
          </Form.Item>
        )
      },
    },
    {
      title: 'Requester',
      dataIndex: 'requesterName',
      key: 'requesterName',
      align: 'center' as const,
      render: (_: unknown, record: TableRecord) => {
        if (record.key !== 'new') {
          return record.requesterName || '-'
        }
        return (
          <Form.Item name="requesterName">
            <Input disabled />
          </Form.Item>
        )
      },
    },
    {
      title: 'Action',
      width: 80,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: unknown, record: TableRecord) => {
        if (record.key === 'new') {
          return (
            <>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                onClick={() => onAddPR()}
                disabled={isDisabledAllForm}
              />
            </>
          )
        }

        return (
          <>
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => onDeletePR(record.key)}
            >
              <Button
                danger
                type="primary"
                size="small"
                icon={<DeleteOutlined />}
                disabled={isDisabledAllForm}
              />
            </Popconfirm>
          </>
        )
      },
    },
  ]
}
