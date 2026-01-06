import { UploadFile } from 'antd'

type DocumentAttachFile = {
  domain: string
  documentType: string
  documentNo: string
  documentDate: string
  fileName: string
}

export type PurchaseLogWithDomainDTO = {
  id: string
  domain: string
  domainId: string
}

export type ApproveCancelDomainType = {
  domainName: string
  domainId: string
}

export type ApprovePurchaseLogDTO = {
  approverName: string
  approverSite: string
  approveDate: string
  approverSection: string
  approveStatus: 'REJECT' | 'APPROVE'
  reasonApprove: string
  id: string
}

export type PurchaseLogType = {
  id: string
  reasonCancel: string
  requesterName: string
  requesterSite: string
  requesterSection: string
  poId: string | null
  poNo: string | null
  poDate: string | null
  prId: string | null
  prNo: string | null
  prDate: string | null
  reasonApprove: string | null
  approverName: string | null
  approverSite: string | null
  approverSection: string | null
  approveDate: string | null
  approveStatus: string | null
  status: string | null
  documentAttachFiles: Array<{
    documentNo: string
    documentDate: string
    domain: string
    refId: string
    documentType: string
    fileName: string
    fileUrl: string
    fileSize: string
    mimeType: string
    id: string
  }>
}

export type PurchaseLogRequest = {
  poId: string | null
  poNo: string | null
  poDate: string | null
  prId: string | null
  prNo: string | null
  prDate: string | null
  reasonCancel: string
  reasonApprove: string | null
  requesterName: string
  requesterSite: string
  requesterSection: string
  approverName: string | null
  approverSite: string | null
  approverSection: string | null
  status: string | null
  documentAttachFiles: DocumentAttachFile[]
}

export type CancelPurchaseLogDTO = {
  files: UploadFile[]
  data: PurchaseLogRequest
}
