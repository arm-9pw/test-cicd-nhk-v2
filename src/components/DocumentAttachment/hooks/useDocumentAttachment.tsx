import { useState } from 'react'

import { FormInstance } from 'antd'

import { AttachmentFileType } from 'api/attachmentApi.types'
import useFileManagement from 'hooks/useFileManagement'
import { useNotification } from 'hooks/useNotification'

import { DOMAINS, PAGE_MODE } from 'constants/index'
import { formatToLocalDateTime, getDateFromString } from 'utils/dateHelpers'

type Props = {
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  newFormRef: FormInstance
  editFormRef: FormInstance
  domain: (typeof DOMAINS)[keyof typeof DOMAINS]
  setFileList: React.Dispatch<React.SetStateAction<AttachmentFileType[]>>
  refId?: string
  defaultDocumentType?: string
}

const useDocumentAttachment = ({
  mode,
  newFormRef,
  editFormRef,
  domain,
  setFileList,
  refId,
  defaultDocumentType,
}: Props) => {
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const { openNotification } = useNotification()
  const {
    loading,
    handleSave: handleUpdateFile,
    handleDelete: handleDeleteFile,
    handleAdd: handleAddFile,
    handleDownloadLocalFile,
    handleDownloadRemoteFile,
  } = useFileManagement({ mode, refId })

  const onAddNewFile = async () => {
    /**
     * NOTE: We will have 2 modes:
     * 1. CREATE: We will only add new file to fileList
     * 2. EDIT: We will call ADD API and update fileList
     */

    // Validate form
    try {
      await newFormRef.validateFields()
    } catch (error) {
      console.error('Form validation failed:', error)
      openNotification({
        type: 'error',
        title: 'Error Validating Form',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    const formValue = newFormRef.getFieldsValue()
    const newItem: AttachmentFileType = {
      key: Date.now().toString(),
      domain: domain,
      documentType: formValue.documentType,
      documentNo: formValue.documentNo,
      documentDate: formatToLocalDateTime(formValue.documentDate),
      fileName: formValue.fileName?.file?.name,
      isUse: true,
      file: formValue.fileName?.file,
    }

    if (mode === PAGE_MODE.CREATE) {
      // NOTE: 1. In CREATE MODE, we only set fileList
      setFileList((prevList) => [...prevList, newItem])
    } else {
      // NOTE: 2. In EDIT MODE, we will call ADD API and update fileList
      const savedDoc = await handleAddFile(newItem)
      setFileList((prevList) => [...prevList, savedDoc])
    }

    // Reset form
    if (defaultDocumentType) {
      // NOTE: Only reset documentNo, documentDate, fileName if defaultDocumentType is provided
      newFormRef.resetFields(['documentNo', 'documentDate', 'fileName'])
    } else {
      newFormRef.resetFields()
    }
  }

  const onDownloadFile = async (record: AttachmentFileType) => {
    // NOTE: Download local file
    if (mode === PAGE_MODE.CREATE && !record.id) {
      // Ensure record.file is converted to File type
      const fileToDownload =
        record.file instanceof File ? record.file : (record.file?.originFileObj as File | undefined)
      if (!fileToDownload) {
        openNotification({
          type: 'error',
          title: 'Error',
          description: 'Failed to download file',
        })
        return
      }
      handleDownloadLocalFile(fileToDownload)
      return
    }

    // NOTE: Download remote file
    if (record.id) {
      await handleDownloadRemoteFile(record.id)
    }
  }

  const onEditFile = (record: AttachmentFileType) => {
    editFormRef.setFieldsValue({
      ...record,
      documentType: record.documentType,
      documentNo: record.documentNo,
      documentDate: getDateFromString(record.documentDate),
      fileName: record.fileName,
    })
    setEditingKey(record.key)
  }

  const onCancelEditing = () => {
    setEditingKey(null)
    editFormRef.resetFields()
  }

  const onSaveEditingRecord = async (record: AttachmentFileType) => {
    /**
     * NOTE: * We will have 2 modes:
     * 1. CREATE: Only update local state
     * 2. EDIT: Call UPDATE API and update local state
     */

    // Validate form
    try {
      await editFormRef.validateFields()
    } catch (error) {
      console.error('Form validation failed:', error)
      openNotification({
        type: 'error',
        title: 'Error Validating Form',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    const formValue = editFormRef.getFieldsValue()
    const editedRecord: AttachmentFileType = {
      key: record.key,
      id: record.id,
      refId: record.refId,
      domain: record.domain,
      documentType: formValue.documentType,
      documentNo: formValue.documentNo,
      documentDate: formatToLocalDateTime(formValue.documentDate),
      fileName: formValue.fileName?.file?.name,
      isUse: true,
      file: formValue.fileName?.file,
    }

    if (mode === PAGE_MODE.CREATE) {
      // NOTE: 1. In CREATE MODE, we only update local state
      setFileList((prevList) =>
        prevList.map((item) => (item.key === record.key ? editedRecord : item)),
      )
    } else {
      // NOTE: 2. In EDIT MODE, we will call UPDATE API and update local state
      const savedItem = await handleUpdateFile(editedRecord)
      setFileList((prevList) => prevList.map((item) => (item.id === record.id ? savedItem : item)))
    }

    // Reset Edit State
    setEditingKey(null)
    editFormRef.resetFields()
  }

  const onDeleteFile = async (record: AttachmentFileType) => {
    /**
     * NOTE: We will have 2 modes:
     * 1. CREATE: Only update local state
     * 2. EDIT: Call DELETE API and update local state
     */
    if (record.domain === domain && record.id) {
      await handleDeleteFile(record)
    }
    setFileList((prevList) => prevList.filter((item) => item.key !== record.key))
  }

  return {
    loading,
    editingKey,
    onAddNewFile,
    onDownloadFile,
    onEditFile,
    onCancelEditing,
    onSaveEditingRecord,
    onDeleteFile,
  }
}

export default useDocumentAttachment
