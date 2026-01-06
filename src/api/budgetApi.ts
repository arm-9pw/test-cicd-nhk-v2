import { apiSlice } from 'api/apiSlice'

import { PrBudgetControlSheetType } from './prApi.types'

export type uniqueBudgetItemType = {
  budgetSiteId: string
  budgetId: string
  thisOrderAmount: number
  purchaseOrderId?: string | null
}

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    calculateMultipleBCS: builder.mutation<PrBudgetControlSheetType[], uniqueBudgetItemType[]>({
      query: (budgets) => ({
        url: `/api/budgets/calculate-multiple-control-sheet`,
        method: 'POST',
        body: budgets,
      }),
    }),
  }),
})

export const { useCalculateMultipleBCSMutation } = apiSliceWithUsers
