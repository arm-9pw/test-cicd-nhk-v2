import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Space } from 'antd'
import { ColumnType } from 'antd/es/table'

// import { clrErrorRed } from 'styles/theme'

import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

// Define a custom column type that extends the Ant Design ColumnType
export interface PRAttachmentColumnType extends Omit<ColumnType<PRAttachmentDataType>, 'title'> {
  title: React.ReactNode
  editable?: boolean
  inputType?: 'text' | 'select' | 'date' | 'upload'
}

type ColumnsProps = {
  editingKey: string | null
  isDisabledAllForm: boolean
  handleAdd: () => void
  isEditing: (record: PRAttachmentDataType) => boolean
  edit: (record: PRAttachmentDataType) => void
  cancel: () => void
  save: (key: string) => void
  handleDelete: (record: PRAttachmentDataType) => void
  handleDownload: (record: PRAttachmentDataType) => void
}

export const columns = ({
  editingKey,
  handleAdd,
  isEditing,
  edit,
  cancel,
  save,
  handleDelete,
  handleDownload,
  isDisabledAllForm,
}: ColumnsProps): PRAttachmentColumnType[] => {
  return [
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          Document Type
        </>
      ),
      dataIndex: 'documentType',
      editable: true,
      width: 180,
      inputType: 'select' as const,
      align: 'center' as const,
    },
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          Document No.
        </>
      ),
      dataIndex: 'documentNo',
      editable: true,
      width: 180,
      inputType: 'text' as const,
      align: 'center' as const,
    },
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          Document Date
        </>
      ),
      dataIndex: 'documentDate',
      editable: true,
      width: 180,
      inputType: 'date' as const,
      align: 'center' as const,
    },
    {
      title: (
        <>
          {/* <span style={{ color: clrErrorRed }}>*</span>  */}
          File Name
        </>
      ),
      dataIndex: 'fileName',
      editable: true,
      minWidth: 200,
      inputType: 'upload' as const,
      align: 'center' as const,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: PRAttachmentDataType) => {
        if (record?.key === 'new') {
          return (
            <Button
              icon={<PlusOutlined />}
              onClick={handleAdd}
              color="primary"
              variant="outlined"
              size="small"
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
              <Button size="small" icon={<CloseOutlined />} />
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
              color="primary"
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
