import { useCallback, useEffect, useMemo, useState } from 'react'

import { Form } from 'antd'
import dayjs from 'dayjs'

import { useAddDocumentMutation, useDeleteDocumentMutation } from 'api/attachmentApi'
import {
  useCreateItemManagementMutation,
  useDeleteItemManagementMutation,
  useUpdateItemManagementMutation,
} from 'api/itemManagementApi'
import {
  CreateItemManagementDTO,
  ItemAttachmentDataType,
  ItemManagementRespType,
} from 'api/itemManagementApiType'
import { useNotification } from 'hooks/useNotification'

export const documentTypeItem = 'PRODUCT_IMAGE'

type Props = {
  selectedItems: ItemManagementRespType | null
  closeEditItemModal: () => void
}

const useEditItemModal = ({ selectedItems, closeEditItemModal }: Props) => {
  const [itemFormRef] = Form.useForm()
  const { openNotification } = useNotification()

  const [createItem, { isLoading: isCreating }] = useCreateItemManagementMutation()
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemManagementMutation()
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemManagementMutation()
  const [addDocument] = useAddDocumentMutation()
  const [deleteDocument] = useDeleteDocumentMutation()

  const initialDocumentList = useMemo(() => {
    return (
      selectedItems?.documentAttachFiles?.map((doc) => ({
        ...doc,
        key: doc.id?.toString() || `temp-${Date.now()}`,
      })) || []
    )
  }, [selectedItems])

  const [documentList, setDocumentList] = useState<ItemAttachmentDataType[]>(initialDocumentList)

  useEffect(() => {
    setDocumentList(initialDocumentList)
  }, [initialDocumentList])

  const onSetDocumentList = useCallback((documentAttachment: ItemAttachmentDataType[]) => {
    setDocumentList(
      documentAttachment.map((doc) => ({
        ...doc,
        key: doc.id?.toString() || `temp-${Date.now()}`,
      })),
    )
  }, [])

  useEffect(() => {
    if (!itemFormRef) return
    itemFormRef.setFieldsValue({
      ...selectedItems,
      documentAttachment: documentList.map((file) => ({
        ...file,
        documentDate: dayjs(file.documentDate),
      })),
    })
  }, [documentList, selectedItems, itemFormRef])

  const onSave = async () => {
    try {
      const values = await itemFormRef.validateFields()

      // if (!values.documentAttachment || values.documentAttachment.length === 0) {
      //   openNotification({
      //     type: 'error',
      //     title: 'Error',
      //     description: 'No files to save!',
      //   })
      //   return
      // }

      const documentList = values.documentAttachment.map((attachment: ItemAttachmentDataType) => ({
        ...attachment,
        documentType: documentTypeItem,
        fileName: attachment.file?.name || attachment.fileName,
      }))

      const data: CreateItemManagementDTO = {
        name: values.name,
        brand: values.brand,
        model: values.model,
        detail: values.detail,
        qty: values.qty,
        unit: values.unit,
        unitPrice: values.unitPrice,
        documentAttachFiles: documentList, // ✅ ส่งไฟล์แนบไปที่ API
      }

      let savedItem
      if (selectedItems) {
        savedItem = await updateItem({ id: selectedItems.id, data }).unwrap()
        openNotification({
          type: 'success',
          title: 'Success',
          description: 'Item updated successfully',
        })
      } else {
        const files = documentList
          .map((member: ItemAttachmentDataType) => member.file)
          .filter(Boolean)
        // if (files.length === 0) {
        //   openNotification({
        //     type: 'error',
        //     title: 'Error',
        //     description: 'No files found! Please attach at least one file.',
        //   })
        //   return
        // }

        savedItem = await createItem({ data, files }).unwrap()
        openNotification({
          type: 'success',
          title: 'Success',
          description: 'Item created successfully',
        })
      }

      try {
        await Promise.all(
          documentList.map(async (document: ItemAttachmentDataType) => {
            if (!document.id) {
              await addDocument({
                refId: savedItem.id,
                document,
              }).unwrap()
            }
          }),
        )
      } catch (uploadError) {
        console.error('Error uploading document:', uploadError)
        openNotification({
          type: 'error',
          title: 'Error uploading files',
          description: 'Some files failed to upload.',
        })
      }
      closeEditItemModal()
    } catch (error) {
      console.error('Error saving item:', error)
      openNotification({
        type: 'error',
        title: 'Error saving item',
        description: 'Failed to save item',
      })
    }
  }

  const onDelete = async (id: string) => {
    const documentIds = selectedItems?.documentAttachFiles.map((file) => file.id)

    try {
      documentIds?.forEach(async (documentId) => {
        if (documentId) {
          await deleteDocument(documentId).unwrap()
        }
      })

      try {
        await deleteItem(id).unwrap()

        openNotification({
          type: 'success',
          title: 'Success deleted',
          description: 'Item deleted successfully',
        })

        closeEditItemModal()
      } catch (error) {
        console.error('Error deleting document:', error)
        openNotification({
          type: 'error',
          title: 'Error deleting document',
          description: 'Failed to delete document',
        })
        return
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      openNotification({
        type: 'error',
        title: 'Error deleting document',
        description: 'Failed to delete document',
      })
    }
  }

  return {
    itemFormRef,
    onSave,
    isCreating,
    isUpdating,
    isDeleting,
    onDelete,
    onSetDocumentList,
    documentList,
  }
}

export default useEditItemModal
