import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Space } from 'antd'

import { ItemAttachmentDataType } from 'api/itemManagementApiType'

type ColumnsProps = {
  editingKey: string | null
  isDisabledAllForm: boolean
  isEditing: (record: ItemAttachmentDataType) => boolean
  edit: (record: ItemAttachmentDataType) => void
  cancel: () => void
  save: (key: string) => void
  handleDelete: (record: ItemAttachmentDataType) => void
  handleDownload: (record: ItemAttachmentDataType) => void
  handleAddDocument: () => void
  handlePreview: (record: ItemAttachmentDataType) => void
}

export const columns = ({
  editingKey,
  isEditing,
  edit,
  cancel,
  save,
  handleDelete,
  handleDownload,
  isDisabledAllForm,
  handleAddDocument,
  handlePreview,
}: ColumnsProps) => {
  return [
    {
      title: 'Document No.',
      dataIndex: 'documentNo',
      editable: true,
      width: 250,
      inputType: 'text' as const,
      align: 'center' as const,
    },
    {
      title: 'Document Date',
      dataIndex: 'documentDate',
      editable: true,
      width: 250,
      inputType: 'date' as const,
      align: 'center' as const,
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      editable: true,
      Width: 250,
      inputType: 'upload' as const,
      align: 'center' as const,
      render: (_: unknown, record: ItemAttachmentDataType) => {
        return (
          <Space>
            {record.fileUrl || record.file ? (
              <Button icon={<EyeOutlined />} size="small" onClick={() => handlePreview(record)}>
                {record.fileName}
              </Button>
            ) : (
              <span>{record.fileName}</span>
            )}
          </Space>
        )
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, record: ItemAttachmentDataType) => {
        if (record?.key === 'new') {
          return (
            <Button
              icon={<SaveOutlined />}
              type="primary"
              variant="outlined"
              size="small"
              onClick={handleAddDocument}
              disabled={editingKey !== null || isDisabledAllForm}
            />
          )
        }
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Button
              icon={<SaveOutlined />}
              onClick={() => save(record.key)}
              type="primary"
              size="small"
              disabled={isDisabledAllForm}
            />
            <Popconfirm title="Cancel editing?" onConfirm={cancel}>
              <Button type="default" icon={<CloseOutlined />} size="small" />
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => handleDownload(record)}
            />
            <Button
              type="primary"
              variant="outlined"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              size="small"
              disabled={editingKey !== null || isDisabledAllForm}
            />
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleDelete(record)}
            >
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                size="small"
                disabled={editingKey !== null || isDisabledAllForm}
              />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]
}
