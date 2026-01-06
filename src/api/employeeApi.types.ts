export type SiteType = {
  code: string
  name: string
  alternativeName: string
  structureLevel: string
  siteCode: string
  parentCode: string
  costCenter: string | null
  id: string
}

export type UpdateEmployeePositionResponse = {
  employeeId: number
  positionId: number
  organizationId: number
  startJobDate: string
  endJobDate: string
  positionType: string
  permissionApprove: boolean
  id: string
}

export type UpdateEmployeePositionRequest = {
  id: string
  employeeId: string
  organizationId: string
  positionId: string
  startJobDate: string
  endJobDate?: string
  positionType: string
  permissionApprove: boolean
}

export type PositionDropdownType = {
  posCode: string
  posName: string
  id: string
}

export type SiteCodeType = {
  siteCode: string
}

export type EmployeeProfileType = {
  prefixTh: string
  firstNameTh: string
  lastNameTh: string
  prefixEn: string
  firstNameEn: string
  lastNameEn: string
  gender: string
  birthDate: string
  email: string
  userName: string
  id: string
  telephone?: string
}

export type EmployeeUpdateType = {
  prefixEn?: string
  prefixTh?: string
  firstNameTh?: string
  lastNameTh?: string
  firstNameEn?: string
  lastNameEn?: string
  email?: string
  userName?: string
  telephone?: string
}

export type EmployeeUserType = {
  prefixTh: string
  firstNameTh: string
  lastNameTh: string
  prefixEn: string
  firstNameEn: string
  lastNameEn: string
  gender: string
  birthDate: string
  email: string
  userName: string
  id: string
  telephone: string

}

export type BaseEmployeeDetailType = {
  prefixTh: string
  firstNameTh: string
  lastNameTh: string
  prefixEn: string
  firstNameEn: string
  lastNameEn: string
  gender: string
  birthDate: string
  email: string
  userName: string
  employeeId: string
  telephone: string

}

export type EmployeeDetailType = BaseEmployeeDetailType & {
  positions: PositionType[]
}

export type GetEmployeesRequest = {
  page?: number
  pageSize?: number
  search?: string
}

export type useCreateRequest = {
  prefixTh: string
  firstNameTh: string
  lastNameTh: string
  prefixEn: string
  firstNameEn: string
  lastNameEn: string
  gender: string
  birthDate: string
  email: string
  userName: string
  telephone: string
  isActive: boolean
  isDeleted: boolean
}


export type PositionType = {
  id: string
  positionId: string
  posCode: string
  posName: string
  positionType: string
  startJobDate: string
  endJobDate?: string
  organizationId: string
  organizationCode: string
  organizationName: string
  siteCode: string
  permissionApprove: boolean
  alternativeName: string
  mainDepartmentName: string
  mainDepartmentCode: string
  subDepartmentName?: string
  subDepartmentCode?: string
}

export type PositionCreateRequest = {
  employeeId: string
  organizationId: string
  positionId: string
  startJobDate?: string
  endJobDate?: string
  positionType?: string
  permissionApprove: boolean
}


