export interface DelegationPersonType {
  positionId: string
  posCode: string
  posName: string
  approveAmount: string
  employeeCode: string
  employeeId: string
  employeeName: string
  email: string
  sectionId: string
  sectionName: string
  sectionCode: string
  isBudgetApprover: boolean
  siteCode: string
}

export type DelegationStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE' | 'CANCELLED'

export interface DelegationType {
  id: string
  delegatorId: string
  delegatorName: string
  delegatorPosition: string
  delegatorPositionId: string
  delegatorPositionCode: string
  delegatorEmail: string
  delegatorSectionName: string
  delegatorSectionId: string
  delegatorSite: string
  delegateId: string
  delegateName: string
  delegatePosition: string
  delegatePositionName: string
  delegatePositionId: string
  delegatePositionCode: string
  delegateEmail: string
  delegateSectionName: string
  delegateSectionId: string
  delegateSite: string
  reasonDetails: string
  status: DelegationStatus
  activatedAt: string
  expiredAt: string
  cancelledAt?: string | null
  cancelledBy?: string | null
  cancellationReason?: string | null
  isActive: boolean
}

export interface CreateDelegationRequest {
  delegateId: string
  delegateName: string
  delegatePositionName: string
  delegatePositionCode: string
  delegatePositionId: string
  delegateEmail: string
  delegateSectionName: string
  delegateSectionId: string
  delegateSite: string
  reasonDetails: string
  activatedAt: string
  expiredAt: string
  isActive: boolean
}

export interface DelegationParams {
  delegatorId?: string
  delegateId?: string
  activeOnly?: boolean
  activatedDate?: string
  expiredDate?: string
  page: number
  sizePerPage: number
  isDelegate: boolean
}

export interface CancelDelegationRequest {
  cancelledAt: string
  cancelledBy: string
  cancellationReason: string
}

export interface ExtendDelegationRequest {
  delegationId: string
  newEndDateTime: string
  reason: string
}

export interface UpdateDelegationRequest {
  id: string
  delegatorId: string
  delegatorName: string
  delegatorPosition: string
  delegatorEmail: string
  delegatorSectionName: string
  delegatorSectionId: string
  delegatorSite: string
  delegateId: string
  delegateName: string
  delegatePosition: string
  delegatePositionName: string
  delegatePositionCode: string
  delegatePositionId: string
  delegateEmail: string
  delegateSectionName: string
  delegateSectionId: string
  delegateSite: string
  reasonDetails: string
  activatedAt: string
  expiredAt: string
  isActive: boolean
}
