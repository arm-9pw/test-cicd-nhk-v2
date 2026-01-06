export type OrganizationListType = {
  code: string
  name: string
  alternativeName: string
  structureLevel: string
  siteCode: string
  parentCode: string
  id: string
}

export type BudgetSiteInfoType = {
  budgetId: string
  organizationId: string
  organizationName: string
  budgetInfo: {
    budgetTypeId: string
    budgetTypeName: string
    mainBudgetCode: string
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
    id: string
  }
  id: string
}

export type NewBudgetSiteInfoType = {
  key: string
  budgetId: string
  organizationId: string
  organizationName: string
  budgetTypeId: string
  budgetTypeName: string
  mainBudgetCode: string
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
  id: string
}

export type AddBudgetSiteRequestType = {
  budgetId: string
  organizationId: string
  organizationName: string
}
