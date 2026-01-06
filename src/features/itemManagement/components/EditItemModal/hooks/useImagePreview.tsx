import { useState } from 'react'

import { ItemAttachmentDataType } from 'api/itemManagementApiType'
import { useNotification } from 'hooks/useNotification'

const getBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const useImagePreview = () => {
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const { openNotification } = useNotification()

  const handlePreviewImage = async (record: ItemAttachmentDataType) => {
    let previewSrc = record.fileUrl || record.file?.url || record.file?.preview

    if (!previewSrc && record.file) {
      const fileObject = record.file.originFileObj || record.file
      if (fileObject instanceof File || fileObject instanceof Blob) {
        previewSrc = await getBase64(fileObject)
      } else {
        console.warn('⚠️ No valid file found for preview', record.file)
      }
    }

    if (!previewSrc) {
      console.log('⚠️ No preview available!')
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'No preview available for this file',
      })
      return
    }
    setPreviewImage(previewSrc as string)
    setPreviewOpen(true) // ✅ เปิดรูปทันที ไม่ต้องใช้ Modal
  }

  return { previewImage, previewOpen, setPreviewOpen, handlePreviewImage }
}
