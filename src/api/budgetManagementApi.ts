import { apiSlice } from 'api/apiSlice'

import { BudgetSiteResponseType, BudgetsResponseType } from './budgetManagementApi.types'

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBudgetManagement: builder.query<
      BudgetsResponseType[],
      {
        page?: number
        pageSize?: number
        budgetCode?: string
        costCenter?: string
      }
    >({
      query: ({ page, pageSize, budgetCode }) => {
        const params: {
          page?: number
          sizePerPage?: number
          budgetCode?: string
        } = {}

        if (page !== undefined) {
          params.page = page - 1 // NOTE: because backend is 0-indexed but frontend is starting at 1
        }
        if (pageSize !== undefined) {
          params.sizePerPage = pageSize
        }
        if (budgetCode) {
          params.budgetCode = budgetCode
        }

        return {
          url: `/api/budget-managements`,
          method: 'GET',
          params,
        }
      },
      providesTags: () => [{ type: 'BudgetManagement', id: 'LIST' }],
    }),
    getBudgetById: builder.query<BudgetsResponseType, string>({
      query: (budgetId) => ({
        url: `/api/budgets/${budgetId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, budgetId) => [
        { type: 'BudgetManagement', id: budgetId },
        { type: 'BudgetManagement', id: 'LIST' },
      ],
    }),
    createBudget: builder.mutation<BudgetsResponseType, Partial<BudgetsResponseType>>({
      query: (budget) => ({
        url: '/api/budgets',
        method: 'POST',
        body: budget,
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'BudgetManagement', id: 'LIST' }]
      },
    }),
    updateBudget: builder.mutation<BudgetsResponseType, Partial<BudgetsResponseType>>({
      query: (data) => ({
        url: `/api/budgets/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, error, arg) => {
        if (error) return []
        return [
          { type: 'BudgetManagement', id: 'LIST' },
          { type: 'BudgetManagement', id: arg.id }, // invalidate specific budget
        ]
      },
    }),
    deleteBudget: builder.mutation<void, string>({
      query: (budgetId) => ({
        url: `/api/budgets/${budgetId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'BudgetManagement', id: 'LIST' }]
      },
    }),

    addBudgetSite: builder.mutation<BudgetSiteResponseType, Partial<BudgetSiteResponseType>>({
      query: (body) => ({
        url: '/api/budgets/budget-sites/add-budget',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, error, arg) => {
        if (error) return []
        return [
          { type: 'BudgetManagement', id: 'LIST' },
          { type: 'BudgetManagement', id: arg.budgetId }, // invalidate specific budget
        ]
      },
    }),
    
    deleteBudgetSite: builder.mutation<void, { budgetSiteId: string; budgetId: string }>({
      query: ({ budgetSiteId }) => ({
        url: `/api/budgets/budget-sites/${budgetSiteId}`,
        method: 'DELETE',
        body: { deleted: true },
      }),
      invalidatesTags: (_, error, arg) => {
        if (error) return []
        return [
          { type: 'BudgetManagement', id: 'LIST' },
          { type: 'BudgetManagement', id: arg.budgetId }, // invalidate specific budget
        ]
      },
    }),
  }),
})

export const {
  useGetBudgetManagementQuery,
  useGetBudgetByIdQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
  useAddBudgetSiteMutation,
  useDeleteBudgetSiteMutation,
} = apiSliceWithUsers