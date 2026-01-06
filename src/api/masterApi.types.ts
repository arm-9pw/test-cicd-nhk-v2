export type SiteDeliveryType = {
  organizationId: string
  taxId: string
  siteName: string
  siteBranchNo: string
  siteBranchName: string
  addressTh: string
  addressEn: string
  provinceTh: string
  provinceEn: string
  tel: string
  email: string | null
  siteShortCode: string
  id: string
}

export type PurchaseSectionType = {
  siteCode: string
  siteName: string
  purchaseSectionId: string
  purchaseSectionCode: string
  purchaseSectionName: string
  isMainPoIssuer: boolean | null
  purchaseSectionAltName: string
  mainGroupId: string
  id: string
}

export type SupplierType = {
  id: string
  supplierName: string
  supplierCode: string
  supplierAddress: string
  supplierTelephone: string
  supplierEmail: string
  supplierAttention: string
  supplierPosition: string
  supplierCondition: string
  paymentTermId: string
  paymentTermName: string
  paymentTermDescription: string
  isShowDescription: boolean
  taxId: string | null
}

export type PaymentTermType = GenericDropdownType & {
  isShowDescription: boolean
}

export type GenericDropdownType = {
  name: string
  id: string
}

interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

interface Pageable {
  pageNumber: number
  pageSize: number
  sort: Sort
  offset: number
  paged: boolean
  unpaged: boolean
}

export type PaginatedResponse<T> = {
  content: T[]
  pageable: Pageable
  totalElements: number
  totalPages: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export type DocumentTypeType = {
  label: string
  value: string
}

export type MainGroupType = {
  id: string
  mainGroupCode: string
  mainGroupName: string
  mainGroupDetail: string
}

export type BudgetTypeType = {
  id: string
  budgetTypeName: string
}

export type CurrencyType = {
  id: string
  currencyName: string
  currencySymbol: string
}

export type MsItemsQueryParams = {
  name?: string
  model?: string
  brand?: string
  page?: number
  sizePerPage?: number
  sortDirection?: string
  sortFields?: string
}

export type MsItemType = {
  name: string
  model: string
  brand: string
  detail: string
  qty: number
  unit: string
  unitPrice: number
  id: string
  matCode: string | null
}

export type DocumentStatusType = {
  status: string
}
