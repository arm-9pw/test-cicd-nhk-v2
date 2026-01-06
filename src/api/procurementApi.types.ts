export type PurchaserStatus =
  | 'PUR_PR_APPROVED'
  | 'PUR_PO_PENDING'
  | 'PUR_PO_WAIT_APPROVED'
  | 'PUR_PO_APPROVED'
  | 'PUR_GR_COMPLETE_CANCEL'

export type RequesterStatus =
  | 'REQ_PR_PENDING'
  | 'REQ_PR_APPROVED'
  | 'REQ_PO_PENDING'
  | 'REQ_PO_APPROVED'
  | 'REQ_GR_COMPLETE_CANCEL'

export type ProcurementStatus = PurchaserStatus | RequesterStatus

export type ProcurementContext = 'PURCHASER' | 'REQUESTER'

export interface ProcurementOperation {
  key: string
  operationType: 'PURCHASE_REQUISITION' | 'PURCHASE_ORDER'
  documentNo: string
  status: string
  projectName: string | null
  requester: string
  purchaseInCharge: string | null
  documentLocation: string | null
  children?: ProcurementOperation[]
}

export interface ProcurementQueryParams {
  groupState?: string
  domain?: ProcurementContext
  prNo?: string
  prStartDate?: string
  prEndDate?: string
  poNo?: string
  poStartDate?: string
  poEndDate?: string
  siteId?: string
  supplierId?: string
  budgetId?: string
  budgetTypeId?: string
  requesterId?: string
  purchaserId?: string
  jobName?: string
  status?: string
  requesterSectionId?: string
  purchaserSectionId?: string
  page?: number
  sizePerPage?: number
}

export interface StatusBoxConfig {
  status: ProcurementStatus
  text: string
  color: 'red' | 'blue' | 'green' | 'purple' | 'yellow'
  icon: React.ReactNode
  count: number
}

export interface ProcurementCount {
  status: ProcurementStatus
  amount: number
}

// export interface ProcurementCountsQueryParams {
//   domain: ProcurementContext
// }

export type DocumentLocationDataType = {
  prId: string
  prNo: string
  poId: string
  poNo: string
  name: string
  action: string
  date: string
  id: string
}

export type DocumentLocationQueryParams = {
  page?: string
  sizePerPage?: string
  documentNo?: string
  prNo?: string
  poNo?: string
}
