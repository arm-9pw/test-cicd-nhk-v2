export type SupplierType = { // FIXME: Duplicate with SupplierType in masterApi.types.ts
  supplierName: string
  supplierCode: string
  supplierAddress: string
  supplierTelephone: string
  supplierEmail: string
  supplierAttention: string
  supplierPosition: string
  supplierProvince: string
  supplierCountry: string
  supplierPostcode: string
  supplierFax?: string
  taxId: string
  paymentTermId: string
  paymentTermName: string
  paymentTermDescription: string
  isShowDescription: boolean
  id: string
}