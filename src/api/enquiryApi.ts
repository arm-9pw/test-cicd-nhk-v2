import { apiSlice } from './apiSlice'
import { BudgetsResponseType } from './budgetManagementApi.types'
import { SiteType } from './employeeApi.types'
import { budgetEnquiryQueryParams, budgetEnquiryResponse, prEnquiryQueryParams } from './enquiryApi.types'
import { poEnquiryQueryParams, poEnquiryResponse } from './enquiryApi.types'
import { PurchaseRequisitionRespType } from './prApi.types'

export const enquiryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListSite: builder.query<SiteType[], void>({
      query: () => ({
        url: '/api/organizations/sites-permission',
        method: 'GET',
      }),
    }),
    getListSection: builder.query<
      SiteType[],
      { alternativeName?: string; siteCode?: string | null; page?: number; sizePerPage?: number }
    >({
      query: (params) => ({
        url: '/api/organizations-permission',
        params,
      }),
    }),
    getPurchaseRequisitionsInquiry: builder.query<
      PurchaseRequisitionRespType[],
      prEnquiryQueryParams
    >({
      query: (params) => ({
        url: '/api/purchase-requisitions/inquiry',
        params,
      }),
    }),
    getPurchaseOrdersInquiry: builder.query<poEnquiryResponse[], poEnquiryQueryParams>({
      query: (params) => ({
        url: '/api/purchase-orders/inquiry',
        params,
      }),
    }),
    getAllBudget: builder.query<
      BudgetsResponseType[],
      {
        page?: number
        pageSize?: number
        budgetCode?: string
        budgetDescription?: string
      }
    >({
      query: ({ page, pageSize, budgetCode }) => {
        const params: {
          page: number
          sizePerPage?: number
          budgetCode?: string
          budgetDescription?: string
        } = {
          page: page !== undefined && page >= 0 ? page : 0, // ✅ สำคัญ!! บังคับให้ page >=0 เสมอ
        }

        if (pageSize !== undefined) {
          params.sizePerPage = pageSize
        }
        if (budgetCode) {
          params.budgetCode = budgetCode
          params.budgetDescription = budgetCode
        }

        return {
          url: `/api/budgets`,
          method: 'GET',
          params,
        }
      },
    }),
    getBudgetEnquiry: builder.query<budgetEnquiryResponse[], budgetEnquiryQueryParams>({
        query: (params) => ({
          url: `/api/budgets/inquiry`,
          params,
        }),
      }),
  }),
})

export const {
  useGetListSiteQuery,
  useGetListSectionQuery,
  useGetPurchaseRequisitionsInquiryQuery,
  useLazyGetPurchaseRequisitionsInquiryQuery,
  useGetPurchaseOrdersInquiryQuery,
  useLazyGetPurchaseOrdersInquiryQuery,
  useGetAllBudgetQuery,
  useLazyGetAllBudgetQuery,
  useGetBudgetEnquiryQuery,
  useLazyGetBudgetEnquiryQuery,
} = enquiryApi
