import { ValueType } from 'rc-input-number'

export const ACTIVE_BUDGET_CODE_INPUT = {
  prDetails: 'prDetailsBudgetCodeInput',
  prItems: 'prItemsBudgetCodeInput',
}

// Document types for GR
// Invoice/Bill/receipt
// Hand over form
// Delivery note
// Report
// Other
// *Import - Duty
// *Import - Custom clearance Charge
// *Import - Shipping
// *Import - Transportation
// Import - Import declaration
// Import - Bill of Lading / Air Way Bill
// Import - Invoice
// Import - Packing List
// Import - Other
export const GR_DOC_TYPES_LABEL_VALUE = [
  { label: 'Invoice/Bill/Receipt', value: 'INVOICE_BILL_RECEIPT' },
  { label: 'Hand over form', value: 'HAND_OVER_FROM' },
  { label: 'Delivery note', value: 'DELIVERY_NOTE' },
  { label: 'Report', value: 'REPORT' },
  { label: 'Other', value: 'OTHER' },
  { label: 'Import - Duty', value: 'IMPORT_DUTY' },
  { label: 'Import - Custom clearance Charge', value: 'IMPORT_CUSTOM_CLEARANCE_CHARGE' },
  { label: 'Import - Shipping', value: 'IMPORT_SHIPPING' },
  { label: 'Import - Transportation', value: 'IMPORT_TRANSPORTATION' },
  { label: 'Import - Import declaration', value: 'IMPORT_IMPORT_DECLARATION' },
  { label: 'Import - Bill of Lading / Air Way Bill', value: 'IMPORT_BILL_OF_LADING' },
  { label: 'Import - Invoice', value: 'IMPORT_INVOICE' },
  { label: 'Import - Packing List', value: 'IMPORT_PACKING_LIST' },
  { label: 'Import - Other', value: 'IMPORT_OTHER' },
]

// documentType that has * is required budgetCode
// Invoice/Bill/receipt
// Hand over form
// Delivery note
// Report
// Other
// *Import - Duty
// *Import - Custom clearance Charge
// *Import - Shipping
// *Import - Transportation
// Import - Import declaration
// Import - Bill of Lading / Air Way Bill
// Import - Invoice
// Import - Packing List
// Import - Other
export const isGRDoctypeRequireBudgetCode = (docType: string) => {
  return (
    docType === 'IMPORT_DUTY' ||
    docType === 'IMPORT_CUSTOM_CLEARANCE_CHARGE' ||
    docType === 'IMPORT_SHIPPING' ||
    docType === 'IMPORT_TRANSPORTATION'
  )
}

export const insertCommaToNumber = (value: ValueType | undefined) => {
  if (!value) return ''

  // const newValue = `${value}`.replace(/\d(?=(\d{3})+(?!\d)\.)/g, '$&,')
  let newValue = `${value}`.replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')
  
  // split the string by decimal point
  const [integer, decimal] = newValue.split('.')
  // remove commas from decimal part
  if (decimal) {
    newValue = `${integer}.${decimal.replace(/,/g, '')}`
  }

  return newValue
}
