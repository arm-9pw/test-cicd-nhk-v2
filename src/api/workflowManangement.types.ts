// ✅ ปรับปรุงตาม API response
export type WorkflowStepType = {
  id: string
  templateId: string
  stepOrder: number
  positionId: string
  positionCode: string
  positionName: string
  minAmount: number
  maxAmount: number
  approverId: string | null
  approverName: string | null
  approverEmail: string | null
  approverSectionId?: string | null
  approverSectionName?: string | null
  approverSiteCode: string | null
  isFinalApprover?: boolean
}

export type WorkflowManagemantType = {
  id: string
  workflowType: string
  siteCode: string
  organizationId: string
  organizationName: string
  steps?: WorkflowStepType[]
}

// ✅ เพิ่ม types สำหรับ API calls
export type CreateWorkflowRequest = {
  workflowType: 'PR' | 'PO' | 'SHARED' | 'RECEIVE_PR'
  siteCode: string
  organizationId: string
  organizationName: string
}

export type CreateStepRequest = {
  templateId: string
  stepOrder: number
  positionId: string
  positionCode: string
  positionName: string
  minAmount: number
  maxAmount: number
  approverId?: string | null
  approverName?: string | null
  approverSectionId?: string | null
  approverSectionName?: string | null
  approverEmail?: string | null
  approverSiteCode?: string | null
  isFinalApprover?: boolean
}

export type ApproverPositionType = {
  id: string
  posCode: string
  posName: string
  positionLevel?: string
  positionGrade?: string
  approvalLimit?: number
  approvalLimitStart?: number
  canApprovePr?: boolean
  canApprovePo?: boolean
  canDelegate?: boolean
  canDelegateTo?: []
  canDelegateToSameLevel?: boolean
  canReceiveDelegation?: boolean
  canReceiveFrom?: []
  parentPositionCodes?: []
  positionHierarchyLevel?: string
}

export type EmployeeApproverType = {
  positionId?: string
  posCode?: string
  posName?: string
  approveAmount?: string
  employeeCode?: string
  employeeId?: string
  employeeName?: string
  email?: string
  sectionId?: string
  sectionName?: string
  sectionCode?: string
  siteCode?: string
}

export type AddStepPayload = {
  positionName: string
  approverName?: string
  minAmount: number
  maxAmount: number
}

export interface WorkflowQueryParams {
  siteCode?: string
  organizationId?: string
  page?: number
  sizePerPage?: number
}
