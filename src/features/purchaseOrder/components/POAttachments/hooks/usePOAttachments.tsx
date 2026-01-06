import { useMemo, useState } from 'react'

import { FormInstance } from 'antd'

import { downloadDocument } from 'api/attachmentApi'
import { useGetDocumentTypesQuery } from 'api/masterApi'
import useFileManagement from 'hooks/useFileManagement'
import { useNotification } from 'hooks/useNotification'

import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'
import usePRAttachment from 'features/purchaseRequisition/components/PRAttachment/hooks/usePRAttachment'

import { PAGE_MODE } from 'constants/index'
import { formatToLocalDateTime, getDateFromString } from 'utils/dateHelpers'
import { transformArrayToObject } from 'utils/generalHelpers'

const PO_DOMAIN = 'PURCHASE_ORDER'

type Props = {
  poId?: string
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  newFormRef: FormInstance
  editFormRef: FormInstance
  setPoAttachmentsList: React.Dispatch<React.SetStateAction<PRAttachmentDataType[]>>
}

/**
 * MODE: CREATE | EDIT
 * FILE TYPE: PR FILE | PO FILE
 */

const usePOAttachments = ({ mode, newFormRef, editFormRef, setPoAttachmentsList, poId }: Props) => {
  const { data: docTypesPO = [] } = useGetDocumentTypesQuery({ domain: 'PO' })
  const { data: docTypesPR = [] } = useGetDocumentTypesQuery({ domain: 'PR' })
  const documentTypelabel = useMemo(
    () => transformArrayToObject([...docTypesPO, ...docTypesPR]),
    [docTypesPO, docTypesPR],
  )

  const [editingKey, setEditingKey] = useState<string | null>(null)
  const { handleDownloadLocalFile } = useFileManagement({})
  const { openNotification } = useNotification()
  const {
    loading,
    handleSave: handleUpdateFile,
    handleDelete: handleDeleteFile,
    handleAdd: handleAddFile,
  } = usePRAttachment({ mode, refId: poId })

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
    const newItem: PRAttachmentDataType = {
      key: Date.now().toString(),
      domain: PO_DOMAIN,
      documentType: formValue.documentType,
      documentNo: formValue.documentNo,
      documentDate: formatToLocalDateTime(formValue.documentDate),
      fileName: formValue.fileName?.file?.name,
      isUse: true,
      file: formValue.fileName?.file,
    }

    if (mode === PAGE_MODE.CREATE) {
      // NOTE: 1. In CREATE MODE, we only set fileList
      setPoAttachmentsList((prevList) => [...prevList, newItem])
    } else {
      // NOTE: 2. In EDIT MODE, we will call ADD API and update fileList
      const savedDoc = await handleAddFile(newItem)
      setPoAttachmentsList((prevList) => [...prevList, savedDoc])
    }

    // Reset form
    newFormRef.resetFields()
  }

  const onDownloadFile = async (record: PRAttachmentDataType) => {
    /**
     * NOTE: We will have 2 modes:
     * 1. CREATE
     *  1.1: PR: We will download from API
     *  1.2: PO: We will download from local**
     * 2. EDIT:
     *  2.1: PR: We will download from API
     *  2.2: PO: We will download from API
     */

    if (mode === PAGE_MODE.CREATE && !record.id) {
      onDownloadLocalFile(record)
      return
    }

    if (record.id) {
      await downloadDocument(record.id)
    }
  }

  const onEditFile = (record: PRAttachmentDataType) => {
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

  const onSaveEditingRecord = async (record: PRAttachmentDataType) => {
    /**
     * NOTE: Only PO FILE can be edited
     * We will have 2 modes:
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
    const editedRecord: PRAttachmentDataType = {
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
      setPoAttachmentsList((prevList) =>
        prevList.map((item) => (item.key === record.key ? editedRecord : item)),
      )
    } else {
      // NOTE: 2. In EDIT MODE, we will call UPDATE API and update local state
      const savedItem = await handleUpdateFile(editedRecord)
      setPoAttachmentsList((prevList) =>
        prevList.map((item) => (item.id === record.id ? savedItem : item)),
      )
    }

    // Reset Edit State
    setEditingKey(null)
    editFormRef.resetFields()
  }

  const onDownloadLocalFile = (record: PRAttachmentDataType) => {
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
  }

  const onDeleteFile = async (record: PRAttachmentDataType) => {
    /**
     * NOTE: We will have 2 modes:
     * 1. CREATE: Only update local state
     * 2. EDIT:
     *  2.1 PR: Only update local state
     *  2.2 PO: Call DELETE API and update local state
     *
     * [24 Nov 2025] Update
     * Now we can delete both PR, PO file
     */

    // if (record.domain === PO_DOMAIN && record.id) {
    if (record.id) {
      await handleDeleteFile(record)
    }
    setPoAttachmentsList((prevList) => prevList.filter((item) => item.key !== record.key))
  }

  return {
    loading,
    onAddNewFile,
    onDownloadFile,
    onEditFile,
    editingKey,
    onCancelEditing,
    onSaveEditingRecord,
    onDeleteFile,
    documentTypelabel,
  }
}

export default usePOAttachments
