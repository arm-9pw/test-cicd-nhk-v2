import { useCallback, useMemo, useState } from 'react'

import { Form, Spin, Table } from 'antd'
import dayjs from 'dayjs'

import { downloadDocument } from 'api/attachmentApi'
import { ItemAttachmentDataType } from 'api/itemManagementApiType'
import useFileManagement from 'hooks/useFileManagement'
import { useNotification } from 'hooks/useNotification'

import { formatToLocalDateTime } from 'utils/dateHelpers'

import { useImagePreview } from '../hooks/useImagePreview'

import { columns } from './columns'
import EditableCell from './components/EditableCell'
import ImagePreview from './components/ImagePreview'
import useItemAttachment from './hooks/useItemAttachment'

type ITemAttachmentProps = {
  mode: 'CREATE' | 'EDIT'| 'VIEW'
  domain: string
  refId?: string | null
  documentList: ItemAttachmentDataType[]
  onSetDocumentList: (documentList: ItemAttachmentDataType[]) => void
  isDisabledAllForm: boolean
}

const ItemAttachment = ({
  mode,
  documentList,
  onSetDocumentList,
  isDisabledAllForm,
  refId,
}: ITemAttachmentProps) => {
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const { openNotification } = useNotification()
  const { handleDownloadLocalFile } = useFileManagement({})

  const { previewOpen, setPreviewOpen, previewImage, handlePreviewImage } = useImagePreview()

  const {
    loading,
    handleAddDocument: apiSave,
    handleUpdateDocument: apiUpdate,
    handleDelete: apiDelete,
  } = useItemAttachment({ mode, refId })

  const initialEmptyRow: ItemAttachmentDataType = {
    key: 'new',
    documentType: 'PRODUCT_IMAGE',
    documentNo: '',
    documentDate: '',
    fileName: '',
    domain: 'MASTER_ITEM',
  }

  const dataSource = documentList.length > 0 ? documentList : [initialEmptyRow]

  const isEditing = useCallback(
    (record: ItemAttachmentDataType) => record.key === editingKey,
    [editingKey],
  )

  const edit = useCallback(
    (record: ItemAttachmentDataType) => {
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

          const saveItem = await apiUpdate(updatedItem)
          newData.splice(index, 1, saveItem)
          onSetDocumentList(newData)
          setEditingKey(null)
        }
      } catch (errInfo) {
        console.error('Validate Failed:', errInfo)
      }
    },
    [documentList, form, onSetDocumentList, apiUpdate],
  )

  const handleDelete = useCallback(
    async (record: ItemAttachmentDataType) => {
      await apiDelete(record)

      onSetDocumentList(documentList.filter((item) => item.id !== record.id))
    },
    [documentList, onSetDocumentList, apiDelete],
  )

  const handleDownload = useCallback(
    async (record: ItemAttachmentDataType) => {
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

  const handleAddDocument = useCallback(async () => {
    try {
      const tableRow = await form.validateFields()

      if (!tableRow['newItem-fileName']?.file) {
        openNotification({
          type: 'error',
          title: 'Error',
          description: 'Please select a file before adding.',
        })
        return
      }

      const newItem: ItemAttachmentDataType = {
        key: Date.now().toString(),
        documentType: 'PRODUCT_IMAGE',
        documentNo: tableRow['newItem-documentNo'] || '',
        documentDate: formatToLocalDateTime(tableRow['newItem-documentDate']) || '',
        file: tableRow['newItem-fileName']?.file,
        fileName: tableRow['newItem-fileName']?.file?.name || '',
        domain: 'MASTER_ITEM',
      }

      const savedItem = await apiSave(newItem)

      onSetDocumentList([savedItem])
      form.resetFields()
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to add document',
      })
    }
  }, [form, onSetDocumentList, openNotification, apiSave])

  const _columns = useMemo(
    () =>
      columns({
        editingKey,
        isEditing,
        edit,
        cancel,
        save,
        handleDelete,
        handleDownload,
        isDisabledAllForm,
        handleAddDocument,
        handlePreview: handlePreviewImage,
      }),
    [
      editingKey,
      isEditing,
      edit,
      cancel,
      save,
      handleDelete,
      handleDownload,
      isDisabledAllForm,
      handleAddDocument,
      handlePreviewImage,
    ],
  )

  const mergedColumns = useMemo(
    () =>
      _columns.map((col) => {
        if (!col.editable) {
          return col
        }
        return {
          ...col,
          onCell: (record: ItemAttachmentDataType) => ({
            form,
            record,
            inputType: col.inputType,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        }
      }),
    [_columns, form, isEditing],
  )

  return (
    <Spin spinning={loading}>
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
          dataSource={dataSource}
          columns={mergedColumns}
          pagination={false}
          scroll={{ x: true }}
          rowClassName="editable-row"
        />
        {previewOpen && (
          <ImagePreview
            previewOpen={previewOpen}
            setPreviewOpen={setPreviewOpen}
            previewImage={previewImage}
          />
        )}
      </Form>
    </Spin>
  )
}

export default ItemAttachment
