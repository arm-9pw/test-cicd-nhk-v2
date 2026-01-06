import { Gutter } from 'antd/es/grid/row'

// Page Mode
export const PAGE_MODE = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW',
} as const

// Grid & Responsive Layout
export const gutter: [Gutter, Gutter] = [8, 0]
export const responsiveLayout = { xs: 24, sm: 16, md: 12, lg: 10, xl: 8 }

// File Upload Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

export const scrollIntoViewOptions: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'center',
}

// Budget Control Sheet
export const BCS_STATUS = {
  OVER_BUDGET: 'OVER BUDGET',
  NOT_OVER_BUDGET: 'ON BUDGET',
}

// Pagination
export const PAGE_SIZE = 10

export const DOMAINS = {
  PURCHASE_REQUISITION: 'PURCHASE_REQUISITION',
  PURCHASE_ORDER: 'PURCHASE_ORDER',
  GOOD_RECEIVE: 'GOOD_RECEIVE',
  MASTER_ITEM: 'MASTER_ITEM',
}

export const PR_STATUS = {
  PR_DRAFT: 'PR_DRAFT',
  PR_WAITING_APPROVED: 'PR_WAITING_APPROVED',
  PR_RETURNED: 'PR_RETURNED',
  PR_APPROVED: 'PR_APPROVED',
  RECEIVING_PR: 'RECEIVING_PR',
  PR_REVISED: 'PR_REVISED',
  PR_WAITING_PO: 'PR_WAITING_PO',
  PR_CANCELED: 'PR_CANCELED',
  PR_DELETE: 'PR_DELETE', // TODO: Need confirmation
  PO_DRAFT: 'PO_DRAFT',
  PO_WAITING_APPROVED: 'PO_WAITING_APPROVED',
  PO_RETURNED: 'PO_RETURNED',
  PO_APPROVED: 'PO_APPROVED',
  PO_REVISED: 'PO_REVISED',
  PO_CANCELING: 'PO_CANCELING',
  PO_CANCELED: 'PO_CANCELED',
  GR_PENDING: 'GR_PENDING',
  GR_COMPLETE: 'GR_COMPLETE',
}

export const PR_STATUS_LABELS = {
  PR_DRAFT: 'Draft / ร่าง',
  PR_WAITING_APPROVED: 'Waiting Approval / กำลังรอการอนุมัติ',
  PR_RETURNED: 'Returned / ถูกตีกลับ',
  PR_APPROVED: 'Approved / อนุมัติ',
  PR_REVISED: 'Revised / ถูกแก้ไข',
  PR_WAITING_PO: 'Waiting PO. / กำลังรอ PO.',
  PR_CANCELED: 'Canceled / ถูกยกเลิก',
  PO_DRAFT: 'PO Draft / ร่าง PO.',
  PO_WAITING_APPROVED: 'PO Waiting Approval / กำลังรอการอนุมัติ PO.',
  PO_RETURNED: 'PO Returned / ถูกตีกลับ PO.',
  PO_APPROVED: 'PO Approved / อนุมัติ PO.',
  PO_REVISED: 'PO Revised / ถูกแก้ไข PO.',
  PO_CANCELING: 'PO Canceling / กำลังยกเลิก PO.',
  PO_CANCELED: 'PO Canceled / ถูกยกเลิก PO.',
  GR_PENDING: 'GR Pending / กำลังรอการรับสินค้า',
  GR_COMPLETE: 'GR Complete / รับสินค้าเสร็จสิ้น',
}

export const PO_STATUS = {
  PO_DRAFT: 'PO_DRAFT',
  PO_WAITING_APPROVED: 'PO_WAITING_APPROVED',
  PO_RETURNED: 'PO_RETURNED',
  PO_APPROVED: 'PO_APPROVED',
  PO_REVISED: 'PO_REVISED',
  PO_CANCELING: 'PO_CANCELING',
  PO_CANCELED: 'PO_CANCELED',
  GR_PENDING: 'GR_PENDING',
  GR_COMPLETE: 'GR_COMPLETE',
}

export const PO_STATUS_LABELS = {
  PO_DRAFT: 'Draft / ร่าง',
  PO_WAITING_APPROVED: 'Waiting Approval / กำลังรอการอนุมัติ',
  PO_RETURNED: 'Returned / ถูกตีกลับ',
  PO_APPROVED: 'Approved / อนุมัติ',
  PO_REVISED: 'Revised / ถูกแก้ไข',
  PO_CANCELING: 'Canceling / กำลังยกเลิก',
  PO_CANCELED: 'Canceled / ถูกยกเลิก',
  GR_PENDING: 'GR Pending / กำลังรอการรับสินค้า',
  GR_COMPLETE: 'GR Complete / รับสินค้าเสร็จสิ้น',
}

export const GR_STATUS = {
  GR_PENDING: 'GR_PENDING',
  GR_COMPLETE: 'GR_COMPLETE',
}

export const GR_STATUS_LABELS = {
  GR_PENDING: 'Pending / กำลังรอการรับสินค้า',
  GR_COMPLETE: 'Complete / รับสินค้าเสร็จสิ้น',
}

export const MAIN_GROUP_CODE = {
  GENERAL_ADM: '8',
  INFORMATION_SYSTEM: '9',
}

export const REPORT_NAME = {
  FOLLOW_UP: 'prPoFollowupReportCSVJob',
  BUDGET_REPORT: 'budgetFollowUpCSVJob',
  INVOICE_SUMMARY: 'invoiceCSVJob',
}

// Gender Detection
export const GENDER_PREFIXES = {
  FEMALE: ['ms.', 'miss', 'mrs.', 'นาง', 'นางสาว', 'คุณผู้หญิง', 'สาว'],
  MALE: ['mr.', 'นาย', 'คุณผู้ชาย', 'ชาย'],
}

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown',
} as const
