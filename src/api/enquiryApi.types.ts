// export type poEnquiryQueryParams = {
//   poNo?: string
//   poDate?: string
//   prNo?: string
//   prDate?: string
//   siteId?: string
//   sectionId?: string
//   budgetId?: string
//   status?: string
//   purchaserId?: string
//   supplierId?: string
//   siteDaliveryId?: string
//   siteDeliveryDate?: string
//   siteInvoiceId?: string
// }


// export type poEnquiryResponse = {
//   key: string
//   poNo: string
//   poDate: string
//   status: string
//   supplierId: string
//   supplierName: string
//   requesterId: string
//   requesterName: string
//   siteId: string
//   siteName: string
//   sectionId: string
//   sectionName: string
//   prNo: string
//   totalAmount: number
// }

export type prEnquiryQueryParams = {
  prNo?: string
  prStartDate?: string
  prEndDate?: string
  jobName?: string
  requesterSectionId?: string
  requesterSite?: string
  budgetId?: string
  purchaseStatus?: string[]
  sortFields?: string[]
  page?: number
  sizePerPage?: number
}

export type prEnquiryResponse = {
  id: string
  no?: number
  prNo: string
  prDate: string
  budgetCode: string
  site: string
  section: string
  requester: string
  grandTotal: number
  purchaseStatus: string
}

export type poEnquiryQueryParams = {
  prNo?: string
  poNo?: string
  poStartDate?: string
  poEndDate?: string
  jobName?: string
  budgetId?: string
  page?: number
  sizePerPage?: number
  purchaseStatus?: string[]
  requesterSectionId?: string
  requesterSite?: string
  sortFields?: string[]
  siteDeliveryId?: string
  supplierId?: string
  siteInvoiceTaxId?: string
  purchaserSite?: string
  purchaserSectionId?: string
}

export type poEnquiryResponse = {
  id: string
  no?: number
  poNo: string
  poDate: string
  jobName: string
  purchaserId: string
  purchaserName: string
  purchaserSite: string
  purchaserSection: string
  purchaserSectionId: string
  supplierName: string
  supplierId: string
  budgetCode: string
  budgetId: string
  grandTotal: number
  monetaryBaht: number
  purchaseStatus: string
  prNo?: string
  refPrNo?: string
  site?: string
  section?: string
  requester?: string
  siteDeliveryId?: string
  siteDeliveryName?: string
  siteInvoiceTaxId?: string
  siteInvoiceTaxName?: string
}

export type budgetEnquiryQueryParams = {
  budgetYear: number
  siteCode: string
  orgIds?: string[]
  budgetTypeId?: string
  budgetNo?: string
  page?: number
  sizePerPage?: number
}

export type budgetEnquiryResponse = {
  typeRecord: string
  mainBudgetNo: string
  subBudgetNo?: string
  mainBudgetAmount: number
  subBudgetAmount?: number
  prWaitingPo: number
  finalAmount: number
  estMainBgRemain: number
  estSubBgRemain?: number
  budgetId: string
  subBudgetId?: string
  organizationId?: string
  organizationName?: string
  siteCode: string
  budgetTypeId: string
  budgetTypeName: string
}