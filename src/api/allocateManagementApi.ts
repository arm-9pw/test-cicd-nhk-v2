import { apiSlice } from 'api/apiSlice'

import { PAGE_SIZE } from 'constants/index'

import {
  AddBudgetSiteRequestType,
  BudgetSiteInfoType,
  NewBudgetSiteInfoType,
  OrganizationListType,
} from './allocateManagementApi.types'

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBudgetAllocations: builder.query<
      OrganizationListType[],
      { code?: string; name?: string; page?: number; pageSize?: number }
    >({
      query: (params) => {
        return {
          url: '/api/organizations/budget-allocate',
          method: 'GET',
          params: {
            code: params.code,
            name: params.name,
            page: params.page ? params.page - 1 : 0,
            sizePerPage: params.pageSize ?? PAGE_SIZE,
          },
        }
      },
    }),
    getBudgetSiteInfo: builder.query<NewBudgetSiteInfoType[], string>({
      query: (organizationId) => ({
        url: `/api/budgets/budget-sites/info/${organizationId}`,
        method: 'GET',
      }),
      transformResponse: (response: BudgetSiteInfoType[]) =>
        response.map((item) => transformToBudgetSiteInfo(item)),
      providesTags: () => [{ type: 'BudgetSites' as const, id: 'LIST' }],
    }),
    addBudgetSite: builder.mutation<
      AddBudgetSiteRequestType & { id: string },
      AddBudgetSiteRequestType
    >({
      query: (body) => ({
        url: '/api/budgets/budget-sites/add-budget',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'BudgetSites', id: 'LIST' }],
    }),
    deleteBudgetSite: builder.mutation<void, string>({
      query: (budgetSiteId) => ({
        url: `/api/budgets/budget-sites/${budgetSiteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'BudgetSites', id: 'LIST' }],
    }),
  }),
})

export const transformToBudgetSiteInfo = (data: BudgetSiteInfoType): NewBudgetSiteInfoType => {
  return {
    key: data.id,
    budgetId: data.budgetId,
    organizationId: data.organizationId,
    organizationName: data.organizationName,
    ...data.budgetInfo,
    id: data.id,
  }
}

export const {
  useGetBudgetAllocationsQuery,
  useGetBudgetSiteInfoQuery,
  useAddBudgetSiteMutation,
  useDeleteBudgetSiteMutation,
} = apiSliceWithUsers
