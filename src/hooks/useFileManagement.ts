import { useCallback, useState } from 'react'

import {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} from 'api/attachmentApi'
import { downloadDocument } from 'api/attachmentApi'
import { AttachmentFileType } from 'api/attachmentApi.types'

import { useNotification } from './useNotification'

type useFileManagementProps = {
  mode?: string
  refId?: string
}

const useFileManagement = ({ mode, refId }: useFileManagementProps) => {
  const { openNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [deleteDocument] = useDeleteDocumentMutation()
  const [addDocument] = useAddDocumentMutation()
  const [updateDocument] = useUpdateDocumentMutation()

  const handleDownloadLocalFile = (bufferedFile: File) => {
    if (!bufferedFile) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to add document',
      })
      return
    }

    const url = URL.createObjectURL(bufferedFile)
    const link = document.createElement('a')
    link.href = url
    link.download = bufferedFile.name
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }

  const handleSave = useCallback(
    async (record: AttachmentFileType) => {
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
          const updatedRecord: AttachmentFileType = {
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
    async (record: AttachmentFileType) => {
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
    async (newDocument: AttachmentFileType) => {
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

  const handleDownloadRemoteFile = async (id: string) => {
    try {
      await downloadDocument(id)
    } catch (error) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to download document',
      })
      throw error
    }
  }

  return {
    loading,
    handleDownloadLocalFile,
    handleDownloadRemoteFile,
    handleSave,
    handleDelete,
    handleAdd,
  }
}

export default useFileManagement
