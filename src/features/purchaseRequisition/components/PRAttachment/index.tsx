import { useCallback, useMemo, useState } from 'react'

import { FileSearchOutlined } from '@ant-design/icons'
import { Collapse, CollapseProps, Form, FormInstance, Space, Spin, Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'

import { downloadDocument } from 'api/attachmentApi'
import useFileManagement from 'hooks/useFileManagement'
import { useNotification } from 'hooks/useNotification'

import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { formatToLocalDateTime } from 'utils/dateHelpers'

import { PRAttachmentColumnType, columns } from './columns'
import EditableCell from './components/EditableCell'
import usePRAttachment from './hooks/usePRAttachment'

type PRAttachmentProps = {
  mode: 'CREATE' | 'EDIT' | 'VIEW'
  refId?: string | null
  documentList: PRAttachmentDataType[]
  domain: string
  onSetDocumentList: (documentList: PRAttachmentDataType[]) => void
  isDisabledAllForm: boolean
}

const PRAttachment = ({
  mode,
  documentList,
  onSetDocumentList,
  domain,
  refId,
  isDisabledAllForm,
}: PRAttachmentProps) => {
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const { openNotification } = useNotification()
  const { handleDownloadLocalFile } = useFileManagement({})

  const {
    loading,
    handleSave: apiSave,
    handleDelete: apiDelete,
    handleAdd: apiAdd,
  } = usePRAttachment({ mode, refId })

  // Create a new row template
  const newRow: PRAttachmentDataType = {
    key: 'new',
    domain,
    documentType: '',
    documentNo: '',
    documentDate: '',
    fileName: '',
  }

  const isEditing = useCallback(
    (record: PRAttachmentDataType) => record.key === editingKey,
    [editingKey],
  )

  const edit = useCallback(
    (record: PRAttachmentDataType) => {
      form.setFieldsValue({
        ...record,
        documentType: record.documentType,
        documentNo: record.documentNo,
        documentDate: dayjs(record.documentDate),
        fileName: record.fileName,
      })
      setEditingKey(record.key)
    },
    [form],
  )

  const cancel = useCallback(() => {
    setEditingKey(null)
  }, [])

  const save = useCallback(
    async (key: string) => {
      try {
        const row = await form.validateFields([
          'documentType',
          'documentNo',
          'documentDate',
          'fileName',
          'file',
        ])
        const newData = [...documentList]
        const index = newData.findIndex((item) => key === item.key)

        if (index > -1) {
          const item = newData[index]
          const updatedItem = {
            ...item,
            ...row,
            file: row.fileName?.file,
            documentDate: formatToLocalDateTime(row.documentDate),
            fileName: row.fileName?.file?.name ? row.fileName?.file?.name : item.fileName,
          }

          const savedItem = await apiSave(updatedItem)
          newData.splice(index, 1, savedItem)
          onSetDocumentList(newData)
          setEditingKey(null)
        }
      } catch (errInfo) {
        console.error('Validate Failed:', errInfo)
      }
    },
    [documentList, form, apiSave, onSetDocumentList],
  )

  const handleDelete = useCallback(
    async (record: PRAttachmentDataType) => {
      await apiDelete(record)
      onSetDocumentList(documentList.filter((item) => item.key !== record.key))
    },
    [documentList, apiDelete, onSetDocumentList],
  )

  const handleDownload = useCallback(
    async (record: PRAttachmentDataType) => {
      try {
        if (record.id) {
          await downloadDocument(record.id)
        } else {
          const fileToDownload =
            record.file instanceof File
              ? record.file
              : (record.file?.originFileObj as File | undefined)
          if (!fileToDownload) {
            openNotification({
              type: 'error',
              title: 'Error',
              description: 'Failed to download file',
            })
            return
          }
          handleDownloadLocalFile(fileToDownload)
        }
      } catch (error) {
        console.error('Error downloading document:', error)
        openNotification({
          type: 'error',
          title: 'Error',
          description: 'Failed to download document',
        })
      }
    },
    [openNotification, handleDownloadLocalFile],
  )

  const handleAdd = useCallback(async () => {
    let row
    try {
      // First try-catch: Form validation
      row = await form.validateFields()
    } catch (validationError) {
      console.error('Validation Failed:', validationError)
      openNotification({
        type: 'error',
        title: 'Validation Error',
        description: 'Please check the form fields and try again',
      })
      return
    }

    // If validation passes, proceed with API call
    try {
      const newItem: PRAttachmentDataType = {
        key: Date.now().toString(),
        documentType: row['newItem-documentType'],
        documentNo: row['newItem-documentNo'],
        documentDate: formatToLocalDateTime(row['newItem-documentDate']),
        file: row['newItem-fileName']?.file,
        fileName: row['newItem-fileName']?.file?.name,
        domain,
      }

      const addedItem = await apiAdd(newItem)
      onSetDocumentList([...documentList, addedItem])
      form.resetFields()
    } catch (apiError) {
      console.error('API Call Failed:', apiError)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to add document. Please try again later.',
      })
    }
  }, [documentList, form, apiAdd, onSetDocumentList, domain, openNotification])

  // Define the type for the cell props passed to EditableCell
  interface EditableCellProps {
    form: FormInstance
    record: PRAttachmentDataType
    inputType?: 'text' | 'select' | 'date' | 'upload'
    dataIndex: string
    editing: boolean
    title: React.ReactNode
  }

  const _columns = useMemo(
    () =>
      columns({
        editingKey,
        handleAdd,
        isEditing,
        edit,
        cancel,
        save,
        handleDelete,
        handleDownload,
        isDisabledAllForm,
      }),
    [
      editingKey,
      handleAdd,
      isEditing,
      edit,
      cancel,
      save,
      handleDelete,
      handleDownload,
      isDisabledAllForm,
    ],
  )

  // We need to use a type assertion here because the Ant Design Table component expects
  // ColumnType<T> but our custom columns have additional properties like 'editable' and 'inputType'
  const mergedColumns = useMemo(
    () =>
      _columns.map((col: PRAttachmentColumnType) => {
        if (!col.editable) {
          // For non-editable columns, we can just return as is
          // TypeScript will handle the conversion to ColumnType
          return col
        }

        // For editable columns, we need to add the onCell property
        // This is used by the EditableCell component
        const editableCol = {
          ...col,
          onCell: (record: PRAttachmentDataType) => {
            // Create a custom object for the EditableCell component
            const cellProps: EditableCellProps = {
              form,
              record,
              inputType: col.inputType,
              dataIndex: col.dataIndex as string,
              editing: isEditing(record),
              title: col.title,
            }
            return cellProps
          },
        }

        // Return the column with the onCell property
        return editableCol
      }) as ColumnType<PRAttachmentDataType>[],
    [_columns, form, isEditing],
  )

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
        <Form form={form} component={false}>
          <Table
            style={{ marginTop: 0 }}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            sticky
            size="small"
            tableLayout="auto"
            columns={mergedColumns}
            dataSource={isDisabledAllForm ? documentList : [...documentList, newRow]}
            pagination={false}
            scroll={{ x: true }}
            rowClassName="editable-row"
          />
        </Form>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <Collapse defaultActiveKey={['1']} items={collapseItems} expandIconPosition="end" />
    </Spin>
  )
}

export default PRAttachment
