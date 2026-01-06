import { GetProp, UploadFile, UploadProps } from 'antd'

import { GRDocumentItemType } from './grApi.types'

export type AddDocumentRequest = {
  refId: string
  document: {
    domain: string
    documentType: string
    documentNo: string
    documentDate: string
    fileName: string
    file?: UploadFile
    key?: string
    isUse?: boolean
  }
}

export type AttachmentFileType = {
  id?: string
  key: string
  documentType: string
  documentNo: string
  documentDate: string
  fileName: string
  domain: string
  file?: UploadFile
  refId?: string
  fileUrl?: string
  fileSize?: string
  mimeType?: string
  isUse?: boolean
}

export type UpdateDocumentRequest = {
  document: {
    id: string
    refId: string
    domain: string
    documentType: string
    documentNo: string
    documentDate: string
    fileName?: string
    file?: UploadFile
  }
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export type AddGRDocumentRequest = {
  grId: string
  document: Partial<GRDocumentItemType>
}
