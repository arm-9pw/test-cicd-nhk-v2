export type BudgetsResponseType = {
  budgetDescription: string
  startDate: string
  endDate: string
  assetType: string
  budgetTypeId: string
  budgetTypeName: string
  mainBudgetCode?: string
  mainBudgetId?: string
  mainBudgetName?: string
  isSubBudget: boolean
  budgetCode: string
  budgetAmount: number
  budgetName: string
  budgetYear: number
  isBudgetCenter: boolean
  budgetAmountMonth1: number
  budgetAmountMonth2: number
  budgetAmountMonth3: number
  budgetAmountMonth4: number
  budgetAmountMonth5: number
  budgetAmountMonth6: number
  budgetAmountMonth7: number
  budgetAmountMonth8: number
  budgetAmountMonth9: number
  budgetAmountMonth10: number
  budgetAmountMonth11: number
  budgetAmountMonth12: number
  costCenter: string
  isActive: boolean
  isActiveBudget: boolean
  id: string
  budgetSites: BudgetSiteResponseType[]
}

export type BudgetSiteResponseType = {
  id: string
  budgetId: string
  organizationId: number
  organizationName: string
  organizationCode: string
  siteCode: string
}