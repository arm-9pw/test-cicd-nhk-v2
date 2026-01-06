import { UploadFile } from 'antd'

export type ItemManagementRespType = {
  name: string
  model: string
  brand: string
  detail: string
  qty: number
  unit: string
  unitPrice: number
  documentAttachFiles: ItemAttachmentDataType[]
  id: string
}

export type ItemAttachmentDataType = {
  key: string 
  documentType: string
  documentNo: string
  documentDate: string
  fileName: string
  domain: string
  isUse?: boolean  
  file?: UploadFile 
  id?: string
  fileUrl?: string
  fileSize?: string
  mimeType?: string
  refId?: string
}

export type CreateItemManagementDTO = Omit<ItemManagementRespType, 'id' | 'itemNo'>

export type CreateItemWithFileDTO = {
  data: CreateItemManagementDTO
  files: UploadFile[]
}