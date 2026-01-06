import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, Form, FormInstance, Input, Popconfirm, Space } from 'antd'

import { AttachmentFileType } from 'api/attachmentApi.types'

import CustomDatePicker from 'components/CustomDatePicker'
import DocumentTypeDropdown from 'components/DocumentTypeDropdown'

import { DOMAINS } from 'constants/index'
import { formatDisplayDate } from 'utils/dateHelpers'

import UploadCell from './components/UploadCell'

type Props = {
  domain: (typeof DOMAINS)[keyof typeof DOMAINS]
  newFormRef: FormInstance
  editFormRef: FormInstance
  editingKey: string | null
  isDisabledDocumentType: boolean
  isDisabledForm: boolean
  onAddNewFile: () => void
  onDownloadFile: (record: AttachmentFileType) => void
  onEditFile: (record: AttachmentFileType) => void
  onCancelEditing: () => void
  onSaveEditingRecord: (record: AttachmentFileType) => void
  onDeleteFile: (record: AttachmentFileType) => void
}

export const columns = ({
  domain,
  newFormRef,
  editFormRef,
  editingKey,
  onAddNewFile,
  onDownloadFile,
  onEditFile,
  onCancelEditing,
  onSaveEditingRecord,
  onDeleteFile,
  isDisabledDocumentType,
  isDisabledForm,
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

  const getIsNewOrEdit = (record: AttachmentFileType) => {
    return record.key === 'new' || editingKey === record.key
  }

  const getDocumentTypeDomain = () => {
    switch (domain) {
      case DOMAINS.PURCHASE_ORDER:
        return 'PO'
      case DOMAINS.PURCHASE_REQUISITION:
        return 'PR'
      default:
        return ''
    }
  }

  return [
    {
      title: 'Document Domain',
      dataIndex: 'domain',
      width: 210,
      align: 'center' as const,
      render: (value: string, record: AttachmentFileType) => {
        if (getIsNewOrEdit(record)) {
          return <Input disabled value={getDomain(value)} />
        }
        return getDomain(value)
      },
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      width: 180,
      align: 'center' as const,
      render: (_value: unknown, record: AttachmentFileType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return (
            <Form form={formRef}>
              <Form.Item
                name="documentType"
                rules={[{ required: true, message: `Please select a document type` }]}
              >
                <DocumentTypeDropdown
                  domain={getDocumentTypeDomain()}
                  disabled={isDisabledDocumentType || isDisabledForm}
                />
              </Form.Item>
            </Form>
          )
        }
        return record.documentType
      },
    },
    {
      title: 'Document No.',
      dataIndex: 'documentNo',
      width: 180,
      align: 'center' as const,
      render: (_value: unknown, record: AttachmentFileType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return (
            <Form form={formRef}>
              <Form.Item
                name="documentNo"
                rules={[{ required: true, message: `Please input document no.` }]}
              >
                <Input disabled={isDisabledForm} />
              </Form.Item>
            </Form>
          )
        }
        return record.documentNo
      },
    },
    {
      title: 'Document Date',
      dataIndex: 'documentDate',
      width: 180,
      align: 'center' as const,
      render: (_value: unknown, record: AttachmentFileType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return (
            <Form form={formRef}>
              <Form.Item
                name="documentDate"
                rules={[{ required: true, message: `Please select document date` }]}
              >
                <CustomDatePicker style={{ width: '100%' }} disabled={isDisabledForm} />
              </Form.Item>
            </Form>
          )
        }
        return formatDisplayDate(record.documentDate)
      },
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      minWidth: 200,
      align: 'center' as const,
      render: (_value: unknown, record: AttachmentFileType) => {
        const formRef = getFormRef(record.key)
        if (getIsNewOrEdit(record)) {
          return <UploadCell formRef={formRef} record={record} disabled={isDisabledForm} />
        }
        return record.fileName
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_value: unknown, record: AttachmentFileType) => {
        // NOTE: New Row
        if (record?.key === 'new') {
          return (
            <Button
              icon={<PlusOutlined />}
              onClick={() => onAddNewFile()}
              color="primary"
              variant="outlined"
              size="small"
              disabled={editingKey !== null || isDisabledForm}
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
                disabled={isDisabledForm}
              />
              <Popconfirm title="Cancel editing?" onConfirm={() => onCancelEditing()}>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<CloseOutlined />}
                  disabled={isDisabledForm}
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
              <Button
                color="primary"
                variant="outlined"
                icon={<EditOutlined />}
                onClick={() => onEditFile(record)}
                size="small"
                disabled={editingKey !== null || isDisabledForm}
              />
              <Popconfirm
                title="Are you sure you want to delete?"
                onConfirm={() => onDeleteFile(record)}
              >
                <Button
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  size="small"
                  disabled={editingKey !== null || isDisabledForm}
                />
              </Popconfirm>
            </Space>
          )
        }
      },
    },
  ]
}
