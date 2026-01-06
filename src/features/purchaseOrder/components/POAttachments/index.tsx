import { FileSearchOutlined } from '@ant-design/icons'
import { Collapse, CollapseProps, Form, Space, Spin, Table } from 'antd'

import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { PAGE_MODE } from 'constants/index'

import { columns } from './columns'
import usePOAttachments from './hooks/usePOAttachments'

// Create a new row template
const newRow: PRAttachmentDataType = {
  key: 'new',
  domain: 'PURCHASE_ORDER',
  documentType: '',
  documentNo: '',
  documentDate: '',
  fileName: '',
  isUse: true,
}

type Props = {
  isDisabledAllForm: boolean
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  poId?: string
  poAttachmentsList: PRAttachmentDataType[]
  setPoAttachmentsList: React.Dispatch<React.SetStateAction<PRAttachmentDataType[]>>
}

const POAttachments = ({
  isDisabledAllForm,
  mode,
  poId,
  poAttachmentsList,
  setPoAttachmentsList,
}: Props) => {
  const [newFormRef] = Form.useForm()
  const [editFormRef] = Form.useForm()

  const attachmentHook = usePOAttachments({
    mode,
    newFormRef,
    editFormRef,
    setPoAttachmentsList,
    poId,
  })

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space>
          <FileSearchOutlined />
          Attachment/เอกสารแนบ
        </Space>
      ),
      children: (
        <Table
          bordered
          sticky
          size="small"
          tableLayout="auto"
          style={{ marginTop: 0 }}
          columns={columns({
            mode,
            isDisabledAllForm,
            newFormRef,
            editFormRef,
            editingKey: attachmentHook.editingKey,
            onAddNewFile: attachmentHook.onAddNewFile,
            onDownloadFile: attachmentHook.onDownloadFile,
            onEditFile: attachmentHook.onEditFile,
            onCancelEditing: attachmentHook.onCancelEditing,
            onSaveEditingRecord: attachmentHook.onSaveEditingRecord,
            onDeleteFile: attachmentHook.onDeleteFile,
            documentTypelabel: attachmentHook.documentTypelabel,
          })}
          dataSource={isDisabledAllForm ? poAttachmentsList : [...poAttachmentsList, newRow]}
          pagination={false}
          scroll={{ x: true }}
        />
      ),
    },
  ]

  return (
    <Spin spinning={attachmentHook.loading}>
      <Collapse defaultActiveKey={['1']} items={collapseItems} expandIconPosition="end" />
    </Spin>
  )
}

export default POAttachments
