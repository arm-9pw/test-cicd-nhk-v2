import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, Form, FormInstance, Input, Popconfirm, Space } from 'antd'

// import { clrErrorRed } from 'styles/theme'
import CustomDatePicker from 'components/CustomDatePicker'
import DocumentTypeDropdown from 'components/DocumentTypeDropdown'
import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { formatDisplayDate } from 'utils/dateHelpers'

import UploadCell from './components/UploadCell'
import { PAGE_MODE } from 'constants/index'

type Props = {
  isDisabledAllForm: boolean
  newFormRef: FormInstance
  editFormRef: FormInstance
  editingKey: string | null
  documentTypelabel: Record<string, string>
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  onAddNewFile: () => void
  onDownloadFile: (record: PRAttachmentDataType) => void
  onEditFile: (record: PRAttachmentDataType) => void
  onCancelEditing: () => void
  onSaveEditingRecord: (record: PRAttachmentDataType) => void
  onDeleteFile: (record: PRAttachmentDataType) => void
}

export const columns = ({
  isDisabledAllForm,
  newFormRef,
  editFormRef,
  editingKey,
  onAddNewFile,
  onDownloadFile,
  onEditFile,
  onCancelEditing,
  onSaveEditingRecord,
  onDeleteFile,
  documentTypelabel,
  mode
}: Props) => {
  const getFormRef = (key: string) => {
    if (key === 'new') {
      return newFormRef
    }
    return editFormRef
  }

  const getDomain = (domain: string) => {
    switch (domain) {
      case 'PURCHASE_ORDER':
        return 'Purchase Order'
      case 'PURCHASE_REQUISITION':
        return 'Purchase Requisition'
      default:
        return domain
    }
  }

  const getIsNewOrEdit = (record: PRAttachmentDataType) => {
    return record.key === 'new' || editingKey === record.key
  }

  return [
    {
      title: 'Document Domain',
      dataIndex: 'domain',
      width: 210,
      align: 'center' as const,
      render: (value: string, record: PRAttachmentDataType) => {
        if (getIsNewOrEdit(record)) {
          return <Input disabled value={getDomain(value)} />
        }
        return getDomain(value)
      },
    },
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          Document Type
        </>
      ),
      dataIndex: 'documentType',
      width: 180,
      align: 'center' as const,
      render: (_value: unknown, record: PRAttachmentDataType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return (
            <Form form={formRef}>
              <Form.Item
                name="documentType"
                rules={[{ required: true, message: `Please select a document type` }]}
              >
                <DocumentTypeDropdown domain="PO" />
              </Form.Item>
            </Form>
          )
        }
        return documentTypelabel[record.documentType]
      },
    },
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          Document No.
        </>
      ),
      dataIndex: 'documentNo',
      width: 180,
      align: 'center' as const,
      render: (_value: unknown, record: PRAttachmentDataType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return (
            <Form form={formRef}>
              <Form.Item
                name="documentNo"
                rules={[{ required: true, message: `Please input document no.` }]}
              >
                <Input />
              </Form.Item>
            </Form>
          )
        }
        return record.documentNo
      },
    },
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          Document Date
        </>
      ),
      dataIndex: 'documentDate',
      width: 180,
      align: 'center' as const,
      render: (_value: unknown, record: PRAttachmentDataType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return (
            <Form form={formRef}>
              <Form.Item
                name="documentDate"
                rules={[{ required: true, message: `Please select document date` }]}
              >
                <CustomDatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          )
        }
        return formatDisplayDate(record.documentDate)
      },
    },
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          File Name
        </>
      ),
      dataIndex: 'fileName',
      minWidth: 200,
      align: 'center' as const,
      render: (_value: unknown, record: PRAttachmentDataType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return <UploadCell formRef={formRef} record={record} />
        }
        return record.fileName
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_value: unknown, record: PRAttachmentDataType) => {
        // NOTE: New Row
        if (record?.key === 'new') {
          return (
            <Button
              icon={<PlusOutlined />}
              onClick={() => onAddNewFile()}
              color="primary"
              variant="outlined"
              size="small"
              disabled={editingKey !== null || isDisabledAllForm}
            />
          )
        }

        // NOTE: Editing Row
        if (editingKey === record.key) {
          return (
            <Space size="small">
              <Button
                icon={<SaveOutlined />}
                onClick={() => onSaveEditingRecord(record)}
                type="primary"
                size="small"
                disabled={isDisabledAllForm}
              />
              <Popconfirm title="Cancel editing?" onConfirm={() => onCancelEditing()}>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<CloseOutlined />}
                  disabled={isDisabledAllForm}
                />
              </Popconfirm>
            </Space>
          )
        }

        // NOTE: Default Existing Row
        if (record?.key !== 'new') {
          return (
            <Space size="small">
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="small"
                onClick={() => onDownloadFile(record)}
              />
              {record.domain === 'PURCHASE_ORDER' && ( // NOTE: Can edit only if domain is PO
                <Button
                  color="primary"
                  variant="outlined"
                  icon={<EditOutlined />}
                  onClick={() => onEditFile(record)}
                  size="small"
                  disabled={editingKey !== null || isDisabledAllForm}
                />
              )}
              <Popconfirm
                title="Are you sure you want to delete?"
                onConfirm={() => onDeleteFile(record)}
              >
                <Button
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  size="small"
                  disabled={
                    editingKey !== null || 
                    isDisabledAllForm || 
                    (mode === PAGE_MODE.CREATE && record.domain !== 'PURCHASE_ORDER')
                  }
                />
              </Popconfirm>
            </Space>
          )
        }
      },
    },
  ]
}
