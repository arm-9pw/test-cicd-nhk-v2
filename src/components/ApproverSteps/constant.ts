export const STEP_STATUS_LABELS = {
  PENDING: 'Pending',
  ASSIGNED: 'Considering',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  DELEGATED: 'Authorized',
} as const

export type StepStatus = keyof typeof STEP_STATUS_LABELS