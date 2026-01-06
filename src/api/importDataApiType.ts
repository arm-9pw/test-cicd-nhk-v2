export type ImportEmployeeRequest = {
  file: File
  password: string
}
export type ImportEmployeeResponse = Array<{
  id: number
  employeeCode: string
  prefixTh: string
  firstNameTh: string
  lastNameTh: string
  prefixEn?: string
  firstNameEn?: string
  lastNameEn?: string
  gender?: string
  birthDate?: string
  telephone?: string
  email?: string
  isForeigner?: boolean
  isActive?: boolean
  isDeleted?: boolean
  lastUpdatedVersionId?: string
  positions?: Array<{
    positionId: number
    organizationId: number
    startJobDate: string
    endJobDate?: string
    jobLevelCode?: string
    positionType?: string
    isActive?: boolean
    isDeleted?: boolean
  }>
}>

export type BudgetType = {
  id: string
  name: string
}

export type ImportBudgetRequest = {
  file: File
  budgetType: BudgetType
}

export type ImportBudgetResponse = Array<{
  supplierCode: string
  supplierName: string
}>

export type ListBudgetResponse = {
  jobId: string
  jobName: string
  status: string
  createdDate: string
}
