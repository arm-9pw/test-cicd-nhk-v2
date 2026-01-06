export interface ApprovalStep {
  stepId: string
  routeId: string
  stepOrder: number
  stepLevel: string
  positionId: string
  positionCode: string
  positionName: string
  minAmount: number
  maxAmount: number
  isRequired: boolean
  isFinalApprover: boolean
  primaryApproverId: string
  primaryApproverName: string
  primaryApproverEmail: string | null
  primaryApproverSectionId: string
  primaryApproverSectionName: string
  primaryApproverSiteCode: string
  primaryApprovalLimit: number | null
  isDelegated: boolean
  delegatedApproverId: string | null
  delegatedApproverName: string | null
  delegatedApproverEmail: string | null
  delegatedApproverSectionId: string | null
  delegatedApproverSectionName: string | null
  delegatedApproverSiteCode: string | null
  delegationId: string | null
  delegationStart: string | null
  delegationEnd: string | null
  delegatedApproverPositionId: string | null
  delegatedApproverPosCode: string | null
  delegatedApproverPosName: string | null
  stepStatus: string
  assignedAt: string | null
  approvedAt: string | null
  approvedById: string | null
  approvedByName: string | null
  comments: string | null
  activeApproverEmail: string | null
  activeApproverSectionId: string
  activeApproverSiteCode: string
  activeApproverPositionId: string | null
  activeApproverPosCode: string | null
  activeApproverPosName: string | null
  pending: boolean
  approved: boolean
  rejected: boolean
  skipped: boolean
  activeApproverSectionName: string
  active: boolean
  completed: boolean
  assigned: boolean
  activeApproverId: string
  activeApproverName: string
}

export interface ApprovalRouteResponse {
  routeId: string
  documentId: string
  documentType: string
  documentNumber: string
  totalAmount: number
  organizationId: string
  organizationName: string | null
  siteCode: string
  routeStatus: string
  totalSteps: number
  completedSteps: number
  currentStepNumber: number
  approvalSteps: ApprovalStep[]
  active: boolean
  cancelled: boolean
  completed: boolean
}

// Document type constants
export type DocumentType = 'PR' | 'PO' | 'RECEIVE_PR'

export interface GetApprovalRouteParams {
  documentId: string
  documentType: DocumentType
  routeId?: string
}

export interface GetApprovalQueueParams {
  page?: number
  sizePerPage?: number
  documentTypes?: DocumentType
}

export interface ApprovalQueueItem {
  routeId: string
  stepId: string
  documentType: DocumentType
  documentId: string
  documentNumber: string
  documentDate: string
  documentStatus: string
  title: string
  budgetCode: string
  totalAmount: number
  currency: string
  requesterId: string
  requesterName: string
  requesterPosition: string
  requesterDepartment: string | null
  requesterSite: string
  stepOrder: number
  stepLevel: string
  positionCode: string
  positionName: string
  stepStatus: 'PENDING' | 'ASSIGNED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  primaryApproverId: string
  primaryApproverName: string
  delegatedApproverId: string | null
  delegatedApproverName: string | null
  isDelegated: boolean
  submittedAt: string
  assignedAt: string
  dueDate: string
  approvedAt: string | null
  statusLabel: string
  comments: string | null
  isFinalApprover: boolean
  minAmount: number
  maxAmount: number
  organizationName: string | null
  siteCode: string
  remindersSent: number
  activeApproverId: string
  activeApproverName: string
  receivingWorkflow: boolean
  statusDescription: string
  isRead: boolean
  isOverBudget: boolean
}

export type ApprovalQueueResponse = {
  data: ApprovalQueueItem[]
  totalItems: number
  totalPOItems: number
  totalPRItems: number
  totalReceivePRItems: number
}

// Decision types for approval/rejection
export type DecisionType = 'APPROVE' | 'REJECT'

// Request payload for approving a route step
export interface ApproveStepRequest {
  routeId: string
  stepId: string
  decision: DecisionType
  comments?: string
  passcode?: string
}

// Interface for approver hierarchy item
export interface ApproverHierarchyItem {
  primaryApproverId: string
  primaryApproverName: string
  primaryApproverEmail: string
  primaryApproverSectionId: string
  primaryApproverSectionName: string
  primaryApproverSiteCode: string
  primaryApproverPositionId: string
  primaryApproverPosCode: string
  primaryApproverPosName: string
  delegatedApproverId: string | null
  delegatedApproverName: string | null
  delegatedApproverEmail: string | null
  delegatedApproverSectionId: string | null
  delegatedApproverSectionName: string | null
  delegatedApproverSiteCode: string | null
  delegatedApproverPositionId: string | null
  delegatedApproverPosCode: string | null
  delegatedApproverPosName: string | null
  delegationId: string | null
  delegationStart: string | null
  delegationEnd: string | null
  isDelegated: boolean
}

// Interface for get approver hierarchy params
export interface GetApproverHierarchyParams {
  positionId: string
}

export type ApproverHierarchyResponse = ApproverHierarchyItem[]

// Request payload for updating a step approver
export interface UpdateStepApproverRequest extends ApproverHierarchyItem {
  stepId: string
  routeId: string
}

// Request payload for calculating an approval route
export interface CalculateApprovalRouteRequest {
  documentId: string
  documentType: string
  documentNumber: string
  totalAmount: number
}

// Request payload for updating read status
export interface UpdateReadStatusRequest {
  routeId: string
  stepId: string
  isRead: boolean
}
