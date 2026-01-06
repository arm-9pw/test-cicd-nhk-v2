import { useCallback, useState } from 'react'

import {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} from 'api/attachmentApi'
import { useNotification } from 'hooks/useNotification'

import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

interface usePRAttachmentProps {
  mode: 'CREATE' | 'EDIT'| 'VIEW'
  refId?: string | null
}

const usePRAttachment = ({ mode, refId }: usePRAttachmentProps) => {
  const [loading, setLoading] = useState(false)
  const [deleteDocument] = useDeleteDocumentMutation()
  const [addDocument] = useAddDocumentMutation()
  const [updateDocument] = useUpdateDocumentMutation()

  const { openNotification } = useNotification()

  const handleSave = useCallback(
    async (record: PRAttachmentDataType) => {
      if (mode === 'EDIT' && refId && record.id) {
        try {
          setLoading(true)
          const savedDoc = await updateDocument({
            document: {
              id: record.id,
              domain: record.domain,
              documentType: record.documentType,
              documentNo: record.documentNo,
              documentDate: record.documentDate,
              fileName: record.fileName,
              refId,
              file: record.file,
            },
          }).unwrap()

          // Return complete record with both existing and new data
          const updatedRecord: PRAttachmentDataType = {
            ...record,
            ...savedDoc,
            key: savedDoc.id?.toString() || record.key, // Use new ID as key if available
          }

          openNotification({
            type: 'success',
            title: 'Success',
            description: 'Document saved successfully',
          })
          return updatedRecord
        } catch (error) {
          openNotification({
            type: 'error',
            title: 'Error',
            description: 'Failed to save document',
          })
          throw error
        } finally {
          setLoading(false)
        }
      }
      return record
    },
    [mode, refId, openNotification, updateDocument],
  )

  const handleDelete = useCallback(
    async (record: PRAttachmentDataType) => {
      if (mode === 'EDIT' && record.id) {
        try {
          setLoading(true)
          await deleteDocument(record.id.toString()).unwrap()
          openNotification({
            type: 'success',
            title: 'Success',
            description: 'Document deleted successfully',
          })
        } catch (error) {
          openNotification({
            type: 'error',
            title: 'Error',
            description: 'Failed to delete document',
          })
          throw error
        } finally {
          setLoading(false)
        }
      }
    },
    [mode, deleteDocument, openNotification],
  )

  const handleAdd = useCallback(
    async (newDocument: PRAttachmentDataType) => {
      if (mode === 'EDIT' && refId) {
        try {
          setLoading(true)
          const response = await addDocument({
            refId,
            document: newDocument,
          }).unwrap()
          openNotification({
            type: 'success',
            title: 'Success',
            description: 'Document added successfully',
          })
          return { ...response, key: newDocument.key }
        } catch (error) {
          openNotification({
            type: 'error',
            title: 'Error',
            description: 'Failed to add document',
          })
          throw error
        } finally {
          setLoading(false)
        }
      }
      return newDocument
    },
    [mode, refId, addDocument, openNotification],
  )

  return {
    loading,
    handleSave,
    handleDelete,
    handleAdd,
  }
}

export default usePRAttachment
