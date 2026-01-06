import { Dayjs } from 'dayjs'

export interface SearchFilters {
  page: number
  sizePerPage: number
  delegatorId?: string
  delegateId?: string
  activeOnly?: boolean
  activatedDate?: string
  expiredDate?: string
  delegationType?: boolean
  authorizePeriod?: [Dayjs, Dayjs]
  delegatePersonId?: string
  isDelegate: boolean
}

export interface AuthorizationFormValues {
  delegateId: string
  delegateName: string
  delegatePosition: string
  delegatePositionName: string
  delegatePositionCode: string
  delegatePositionId: string
  delegateEmail: string
  authorizePeriod: [Dayjs, Dayjs]
  delegateSectionName: string
  delegateSectionId: string
  delegateSite: string
  isActive: boolean
  reasonDetails?: string
}
