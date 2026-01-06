import { useCallback, useState } from 'react'

import {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} from 'api/attachmentApi'
import { ItemAttachmentDataType } from 'api/itemManagementApiType'
import { useNotification } from 'hooks/useNotification'

interface useItemAttachmentProps {
  mode: 'CREATE' | 'EDIT'| 'VIEW'
  refId?: string | null
}

const useItemAttachment = ({ mode, refId }: useItemAttachmentProps) => {
  const [loading, setLoading] = useState(false)
  const [deleteDocument] = useDeleteDocumentMutation()
  const [saveDocument] = useAddDocumentMutation()
  const [updateDocument] = useUpdateDocumentMutation()

  const { openNotification } = useNotification()

  const handleUpdateDocument = useCallback(
    async (record: ItemAttachmentDataType) => {
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

          const updatedRecord: ItemAttachmentDataType = {
            ...record,
            ...savedDoc,
            key: savedDoc.id?.toString() || record.key,
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
    async (record: ItemAttachmentDataType) => {
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

  const handleAddDocument = useCallback(
    async (newDocument: ItemAttachmentDataType) => {
      if (mode === 'EDIT' && refId) {
        try {
          setLoading(true)
          const response = await saveDocument({
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
    [mode, refId, saveDocument, openNotification],
  )

  return { loading, handleUpdateDocument, handleDelete, handleAddDocument }
}

export default useItemAttachment
