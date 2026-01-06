export type TPRItem = {
  key: string
  budgetCode: string
  name: string
  model: string
  brand: string
  detail: string
  qty: number
  unit: string
  unitPrice: number
  unitDiscount: number
  netTotal: number
}

export type TDropdownValue = {
  label: string
  value: string
  id: number
  title?: string
}

export type TPrDetailsData = {
  mainGroupId: number
  mainGroupName: string
  requiredDate: string
  budgetTypeId: number
  budgetTypeName: string
  budetCodeId: number
  budgetCode: string
  line: string
  purpose: string
  currencyId: number
  currencyName: string
  exchangeRateSource: number
  exchangeRateDestination: number
}

export type TPrQuotationFormValues = {
  quotationNo: string
  quotationDate: string
  supplier: string
}


