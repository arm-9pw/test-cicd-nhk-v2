export type ReportData = {
  jobId: number
  jobName: string
  userName: string
  siteCode: string
  sectionId: number
  sectionName: string
  budgetYear: number
  budgetTypeId: number
  budgetTypeName: string
  budgetId: number
  budgetCode: string
  budgetName: string
  startDate: string | null
  endDate: string | null
  status: string
  createdDate: string
}

export type AdditionBatchParams = {
  siteCode?: string | null
  siteId?: string | null
  budgetYear?: number
  budgetTypeId?: string | null
  budgetId?: string | null
  sectionId?: string | null
  startDate?: string
  endDate?: string
}

export type CreateReportJobRequest = {
  jobName: string
  additionBatchParams: AdditionBatchParams
}
