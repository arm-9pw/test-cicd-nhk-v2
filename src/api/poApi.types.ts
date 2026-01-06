export type SiteMasterType = {
  organizationId: string
  organizationName: string | null
  organizationCode: string
  taxId: string
  siteName: string
  siteBranchNo: string
  siteBranchName: string | null
  addressTh: string
  addressEn: string
  provinceTh: string
  provinceEn: string
  tel: string
  email: string | null
  siteShortCode: string
  countryTH: string
  countryEN: string
  districtTH: string
  districtEN: string
  subDistrictTH: string | null
  subDistrictEN: string | null
  fax: string
  postalCode: string
  address2TH: string | null
  address2EN: string | null
  id: string
}

// NOTE: CREATE PO REQUEST BODY TYPE
export type POItemType = {
  id?: string | null
  key: string
  budgetId: string
  budgetCode: string
  budgetSiteId: string
  budgetSiteName: string
  name?: string
  model?: string
  brand?: string
  detail?: string | null
  qty: number
  unit?: string
  unitPrice: number
  unitDiscount: number
  netTotal: number
  prId?: string
  matCode: string | null
}

export type PurchaseOrderItemDTOType = {
  order: number
  budgetId: string
  budgetCode: string
  budgetSiteId: string
  budgetSiteName: string
  name: string
  brand: string
  model: string
  detail: string
  qty: number
  unit: string
  unitPrice: number
  unitDiscount: number
  netTotal: number
  matCode: string | null
}

export type BudgetControlSheetDTOType = {
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
  budgetStatus: string
}

export type PurchaseRequisitionDTOType = {
  prDate: string
  purchaseRequisitionId: string
  prNo: string

  requesterName: string
  requesterPosition: string
  requesterSite: string
  requesterSection: string
  requesterEmail: string
  requesterTel: string

  mainGroupId: string
  mainGroupName: string
  monetaryBaht: number
}

type DocumentAttachFileDTOType = {
  id?: string
  refId?: string
  domain: string
  documentType: string
  documentNo: string
  documentDate: string
  fileName: string
  fileUrl?: string
  isUse?: boolean
}

export type CreatePoDTOType = {
  purchaserId: string
  isReferPr: boolean
  jobName: string

  purchaserName: string
  purchaserSite: string
  purchaserSection: string
  purchaserSectionId: string
  purchaserEmail: string
  purchaserTel: string

  deliveryDate: string
  mainGroupId: string
  mainGroupName: string
  mainGroupCode: string
  siteDeliveryId: string
  siteDeliveryName: string
  siteInvoiceTaxId: string
  siteInvoiceTaxName: string

  isImport: boolean
  incoterm: string | null

  budgetId: string
  budgetCode: string | null
  subBudgetCode: string | null
  assetType: string | null
  budgetYear: number | null
  budgetDescription: string
  budgetTypeId: string
  budgetTypeName: string
  supplierId: string
  supplierName: string
  supplierCode: string
  supplierAddress: string
  supplierTelephone: string
  supplierEmail: string
  supplierTaxId: string | null
  supplierCondition: string
  firstSupplierId?: string | null
  firstSupplierName?: string | null
  firstSupplierCode?: string | null
  firstSupplierPrice?: number | null
  negoTypeId?: string | null
  negoTypeName?: string | null
  definition?: string | null
  costSaving?: number | null

  paymentTermId: string
  paymentTermName: string
  paymentTermDescription: string
  currencyId: string
  currencyName: string
  supplierAttention: string
  supplierAttentionPosition: string
  exchangeRateSource: number
  exchangeRateDestination: number
  itemGrandTotal: number
  monetaryBaht: number
  vatPercentage: number
  vatBaht: number
  grandMonetaryBaht: number
  monetaryWordEn: string
  monetaryWordTh: string
  remarkItem: string
  documentRoute: string
  remarkBudgetControlSheet: string
  purchaseOrderItems: PurchaseOrderItemDTOType[]
  purchaseOrderBudgetControlSheets: BudgetControlSheetDTOType[]
  purchaseRequisitions: PurchaseRequisitionDTOType[]
  documentAttachFiles: DocumentAttachFileDTOType[]
}

// NOTE: CREATE PO RESPONSE TYPE
type PurchaseOrderItemDTORespType = {
  budgetId: string
  budgetCode: string
  budgetSiteId: string
  budgetSiteName: string
  name: string
  model: string
  brand: string
  detail: string | null
  qty: number
  unit: string
  unitPrice: number
  unitDiscount: number
  netTotal: number
  id: string
}

type BudgetControlSheetDTORespType = {
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
  budgetStatus: string
  id: string
}

type DocumentAttachFileDTORespType = {
  documentNo: string
  documentDate: string
  domain: string
  refId: string
  documentType: string
  fileName: string
  fileUrl: string
  fileSize: string
  mimeType: string
  isUse: boolean
  id: string
}

type PrPoDocumentFileDTORespType = {
  documentAttachFileId: number
  prId: number | null
  poId: number
  isActive: boolean
  fileName: string
  fileUrl: string
  documentType: string
  documentNo: string
  documentDate: string
  id: number
}

export type PRListDTORespType = {
  id: string
  prDate: string
  purchaseRequisitionId: string
  prNo: string
  requesterName: string
  requesterPosition: string
  requesterSite: string
  requesterSection: string
  requesterEmail: string
  requesterTel: string
  mainGroupId: string
  mainGroupName: string
  monetaryBaht: number
  budgetCode: string
  subBudgetCode: string | null
  budgetTypeName: string
  budgetYear: number
}

export type PurchaseOrderDTORespType = {
  poNo: string
  poDate: string
  jobName: string
  purchaserName: string
  purchaserSite: string
  purchaserSection: string
  purchaserSectionId: string
  mainGroupId: string
  mainGroupName: string
  deliveryDate: string
  budgetId: string
  budgetCode: string
  budgetDescription: string
  budgetTypeId: string | null
  budgetTypeName: string | null
  siteDeliveryId: string
  siteDeliveryName: string
  siteInvoiceTaxId: string
  siteInvoiceTaxName: string
  isImport: boolean
  currencyId: string
  currencyName: string
  exchangeRateSource: number
  exchangeRateDestination: number
  supplierAttention: string
  supplierAttentionPosition: string
  supplierId: string
  supplierCode: string
  supplierName: string
  supplierAddress: string
  supplierTelephone: string
  supplierEmail: string | null
  paymentTermId: string
  paymentTermName: string | null
  paymentTermDescription: string
  itemGrandTotal: number
  monetaryBaht: number
  vatPercentage: number
  vatBaht: number
  grandMonetaryBaht: number
  monetaryWordEn: string
  monetaryWordTh: string
  purchaseStatus: string
  remarkItem: string
  documentRoute: string
  remarkBudgetControlSheet: string | null
  isReferPr: boolean | null
  isShowDescription: boolean | null
  purchaseOrderItems: PurchaseOrderItemDTORespType[]
  purchaseOrderBudgetControlSheets: BudgetControlSheetDTORespType[]
  documentAttachFiles: DocumentAttachFileDTORespType[]
  purchaseRequisitions: PRListDTORespType[]
  prPoDocumentFiles: PrPoDocumentFileDTORespType[]
  id: string
}

// NOTE: GET PO RESPONSE TYPE
export type BudgetControlSheetRespType = {
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
  budgetStatus?: string
  id?: string
  numOfApproveAmount: number
  numOfPendingAmount: number
}

export type PurchaseOrderItemRespType = {
  budgetId: string
  budgetCode: string
  budgetSiteId: string
  budgetSiteName: string
  name: string
  model: string
  brand: string
  detail: string | null
  qty: number
  unit: string
  unitPrice: number
  unitDiscount: number
  netTotal: number
  id: string
  matCode: string | null
}

export type DocumentAttachFileRespType = {
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
}

type PrPoDocumentFileRespType = {
  documentAttachFileId: string
  prId: string | null
  poId: string
  isActive: boolean | null
  id: string
}

export type PurchaseOrderRespType = {
  isShowDescription: boolean
  isReferPr: boolean
  poNo: string
  poDate: string
  jobName: string
  assetType: string | null

  purchaserId: string
  purchaserName: string
  purchaserSite: string
  purchaserSection: string
  purchaserSectionId: string
  purchaserEmail: string
  purchaserTel: string

  mainGroupId: string
  mainGroupName: string
  mainGroupCode: string
  deliveryDate: string
  budgetId: string
  budgetCode: string
  subBudgetCode: string | null
  budgetDescription: string
  budgetTypeId: string | null
  budgetTypeName: string | null
  siteDeliveryId: string
  siteDeliveryName: string
  siteInvoiceTaxId: string
  siteInvoiceTaxName: string

  isImport: boolean
  incoterm: string | null

  currencyId: string
  currencyName: string
  exchangeRateSource: number
  exchangeRateDestination: number
  supplierAttention: string
  supplierAttentionPosition: string
  supplierId: string
  supplierCode: string
  supplierName: string
  supplierAddress: string
  supplierTelephone: string
  supplierEmail: string | null
  supplierTaxId: string | null
  supplierCondition: string

  firstSupplierId?: string | null
  firstSupplierName?: string | null
  firstSupplierCode?: string | null
  firstSupplierPrice?: number | null
  negoTypeId?: string | null
  negoTypeName?: string | null
  definition?: string | null
  costSaving?: number | null

  paymentTermId: string
  paymentTermName: string | null
  paymentTermDescription: string
  itemGrandTotal: number
  monetaryBaht: number
  vatPercentage: number
  vatBaht: number
  grandMonetaryBaht: number
  monetaryWordEn: string
  monetaryWordTh: string
  purchaseStatus: string
  remarkItem: string
  documentRoute: string
  remarkBudgetControlSheet: string | null
  siteMaster: SiteMasterType
  purchaseOrderItems: PurchaseOrderItemRespType[]
  purchaseOrderBudgetControlSheets: BudgetControlSheetRespType[]
  documentAttachFiles: DocumentAttachFileRespType[]
  purchaseRequisitions: PRListDTORespType[]
  prPoDocumentFiles: PrPoDocumentFileRespType[]
  id: string
}

// NOTE: UPDATE PO REQUEST BODY TYPE
export type POItemUpdateDTOType = {
  order: number
  budgetId: string
  budgetCode: string
  budgetSiteId: string
  budgetSiteName: string
  name: string
  model: string
  brand: string
  detail: string | null
  qty: number
  unit: string
  unitPrice: number
  unitDiscount: number
  netTotal: number
  id: string
  matCode: string | null
}

export type BudgetControlSheetUpdateDTOType = {
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
  budgetStatus: string
  id: string
  numOfApproveAmount: number
  numOfPendingAmount: number
}

export type PRUpdateDTOType = {
  prDate: string
  purchaseRequisitionId: string
  prNo: string

  requesterName: string
  requesterPosition: string
  requesterSite: string
  requesterSection: string
  requesterSectionId: string
  requesterEmail: string
  requesterTel: string

  mainGroupId: string
  mainGroupName: string
  monetaryBaht: number
  id: string
}

// type PrPoDocumentFileDTOType = {
//   documentAttachFileId: string
//   prId: string | null
//   poId: string
//   isActive: boolean | null
//   id: string | null
// }

export type UpdatePoDTOType = {
  purchaserId: string
  isReferPr: boolean
  poNo: string
  poDate: string
  jobName: string

  purchaserName: string
  purchaserSite: string
  purchaserSection: string
  purchaserSectionId: string
  purchaserEmail: string
  purchaserTel: string

  mainGroupId: string
  mainGroupName: string
  mainGroupCode: string
  deliveryDate: string
  budgetId: string
  budgetCode: string | null
  subBudgetCode: string | null
  budgetYear: number | null
  assetType: string | null
  budgetDescription: string
  budgetTypeId: string
  budgetTypeName: string
  siteDeliveryId: string
  siteDeliveryName: string
  siteInvoiceTaxId: string
  siteInvoiceTaxName: string

  isImport: boolean
  incoterm: string | null

  currencyId: string
  currencyName: string
  exchangeRateSource: number
  exchangeRateDestination: number
  supplierAttention: string
  supplierAttentionPosition: string
  supplierId: string
  supplierCode: string
  supplierName: string
  supplierAddress: string
  supplierTelephone: string
  supplierEmail: string | null
  supplierTaxId: string | null
  supplierCondition: string

  firstSupplierId?: string | null
  firstSupplierName?: string | null
  firstSupplierCode?: string | null
  firstSupplierPrice?: number | null
  negoTypeId?: string | null
  negoTypeName?: string | null
  definition?: string | null
  costSaving?: number | null

  paymentTermId: string
  paymentTermName: string
  paymentTermDescription: string
  itemGrandTotal: number
  monetaryBaht: number
  vatPercentage: number
  vatBaht: number
  grandMonetaryBaht: number
  monetaryWordEn: string
  monetaryWordTh: string
  purchaseStatus: string
  remarkItem: string
  documentRoute: string
  remarkBudgetControlSheet: string | null
  purchaseOrderItems: POItemUpdateDTOType[]
  purchaseOrderBudgetControlSheets: BudgetControlSheetUpdateDTOType[]
  purchaseRequisitions: PRUpdateDTOType[]
  // prPoDocumentFiles: PrPoDocumentFileDTOType[]
  id: string
}
