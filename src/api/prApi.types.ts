import { UploadFile } from 'antd'

import {
  PRAttachmentDataType,
  PrItemType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

export type PrBudgetControlSheetType = {
  budgetStatus?: string
  id?: string
  budgetSiteId: string
  budgetSiteName: string
  budgetId: string
  budgetYear: string
  mainBudgetCode: string
  mainBudgetAmount: number
  subBudgetCode: string | null
  subBudgetAmount: number | null
  pendingAmount: number
  approveAmount: number
  thisOrderAmount: number
  purchaseOrderAmount: number
  budgetRemain: number
  isOverBudget: boolean
  numOfPendingAmount: number
  numOfApproveAmount: number
}

export type PurchaseRequisitionRespType = {
  requesterId?: string
  purchaseRequisitionId?: string
  id: string | null
  prNo: string
  prDate: string

  requesterName: string
  requesterPosition: string
  requesterSite: string
  requesterSection: string
  requesterSectionId: string
  requesterTel: string
  requesterEmail: string

  jobName: string
  mainGroupId: string
  mainGroupName: string
  mainGroupCode: string
  requireDate: string
  budgetTypeId: string
  budgetTypeName: string
  budgetId: string
  budgetCode: string
  subBudgetCode: string | null
  budgetYear: number | null
  budgetSiteId: string
  budgetSiteName: string
  budgetDescription: string
  assetType: string | null
  line: string
  purpose: string
  isImport: boolean
  remarkItem: string
  currencyId: string
  currencyName: string
  exchangeRateSource: number
  exchangeRateDestination: number
  isMultipleBudget: boolean
  itemGrandTotal: number
  monetaryBaht: number
  monetaryWordEn: string
  monetaryWordTh: string
  purchaseInChargeSectionId: string
  purchaseInChargeSectionName: string
  documentRoute: string
  purchaseStatus: string
  budgetControlSheetRemark: string
  purchaseRequisitionItems: PrItemTypeWOKey[]
  purchaseRequisitionBudgetControlSheets: PrBudgetControlSheetTypeWOKey[]
  documentAttachFiles: PRAttachmentDataWOKeyType[]
}

export type PrBudgetControlSheetTypeWOKey = Omit<PrBudgetControlSheetType, 'id'>
export type PrItemTypeWOKey = Omit<PrItemType, 'key'>
export type PRAttachmentDataWOKeyType = Omit<PRAttachmentDataType, 'key'>

export type CreatePurchaseRequisitionDTO = Omit<
  PurchaseRequisitionRespType,
  'id' | 'prNo' | 'prDate'
>

export type CreatePRWithFileDTO = {
  data: CreatePurchaseRequisitionDTO
  files: UploadFile[]
}

export type CalculatedBCSParams = {
  budgetSiteId: string
  budgetId: string
  thisOrderAmount: number
  purchaseRequisitionId?: string
}

export type BudgetQueryParams = {
  organizationId?: string | number
  budgetCode?: string
  budgetTypeId?: string
  page?: number
  sizePerPage?: number
  sortDirection?: 'ASC' | 'DESC'
  sortFields?: string
  isBudgetCenter?: boolean
  mainGroupId?: string
}

export type BudgetItemType = {
  id?: string
  budgetId: string
  budgetCode: string
  budgetSiteId: string
  subBudgetCode?: string | null
  budgetSiteName?: string
  organizationName?: string
  budgetTypeId?: string
  budgetTypeName?: string
  budgetDescription?: string
  mainBudgetCode?: string
  isSubBudget?: boolean
  budgetAmount?: number
  budgetName?: string
  budgetYear?: number
  isBudgetCenter?: boolean
  organizationId?: string
  assetType?: string
}

export type TransferPRDTO = {
  purchaseInChargeSectionId: number
  purchaseInChargeSectionName: string
}
