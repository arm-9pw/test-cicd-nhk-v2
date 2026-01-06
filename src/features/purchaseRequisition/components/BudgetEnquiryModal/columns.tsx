import { PlusOutlined } from '@ant-design/icons'
import { Button, TableProps } from 'antd'

import { TBudgetEnquiryItem } from 'api/prApi'

type ColumnsProps = {
  onAdd: (record: TBudgetEnquiryItem) => void
  onCloseModal: () => void
}

export const getColumns = ({
  onAdd,
  onCloseModal,
}: ColumnsProps): TableProps<TBudgetEnquiryItem>['columns'] => [
  { title: 'No.', dataIndex: 'id', key: 'id', align: 'center' }, // FIXME: Implement the key using consequent numbers, maybe we can use index to render the number
  { title: 'Site', dataIndex: 'site', key: 'site', align: 'center' },
  { title: 'Section', dataIndex: 'section', key: 'section', align: 'center' },
  {
    title: 'Budget Code',
    dataIndex: 'budgetCode',
    key: 'budgetCode',
    align: 'center',
  },
  {
    title: 'Asset Name',
    dataIndex: 'assetName',
    key: 'assetName',
    align: 'center',
  },
  {
    title: 'Asset Type',
    dataIndex: 'assetType',
    key: 'assetType',
    align: 'center',
  },
  {
    title: 'Fiscal Year',
    dataIndex: 'fiscalYear',
    key: 'fiscalYear',
    align: 'center',
  },
  { title: 'Status', dataIndex: 'status', key: 'status', align: 'center' },
  {
    title: 'Action',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <Button
        icon={<PlusOutlined />}
        onClick={() => {
          onAdd(record)
          onCloseModal()
        }}
      />
    ),
  },
]
