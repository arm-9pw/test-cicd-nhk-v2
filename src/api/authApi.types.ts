import { PermissionType } from 'features/auth/auth.types'

export type UserInfoType = {
  employeeId: string
  username: string
  fullNameTh: string
  fullNameEn: string
  currentPositionId: string
  currentPositionCode: string
  currentPositionName: string
  currentPositionType: string
  currentOrganizationId: string
  currentOrganizationCode: string
  currentOrganizationName: string
  currentSiteCode: string
  telephone: string
  email: string
  positions: UserPositionType[]
  currentProgramList: PermissionType[]
  currentRoleName: string // e.g."REQUESTOR,PURCHASER,ADMIN"
  currentLandingPageCode: string
  currentDepartmentName: string
  currentDepartmentId: string
  currentMainDepartmentId: string
  currentMainDepartmentName: string
}

type UserPositionType = {
  positionId: string
  posCode: string
  posName: string
  positionType: string
  startJobDate: string // ISO date string
  organizationId: string
  organizationCode: string
  organizationName: string
  siteCode: string
}
