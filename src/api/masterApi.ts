import { apiSlice } from 'api/apiSlice'

import {
  BudgetTypeType,
  CurrencyType,
  DocumentStatusType,
  DocumentTypeType,
  GenericDropdownType,
  MainGroupType,
  MsItemType,
  MsItemsQueryParams,
  PaginatedResponse,
  PaymentTermType,
  PurchaseSectionType,
  SiteDeliveryType,
  SupplierType,
} from './masterApi.types'

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMaingroups: builder.query<MainGroupType[], void>({
      query: () => ({
        url: '/api/master/main-groups',
      }),
    }),
    getBudgetTypes: builder.query<BudgetTypeType[], void>({
      query: () => ({
        url: '/api/master/budget-types',
      }),
    }),
    getCurrencies: builder.query<CurrencyType[], void>({
      query: () => ({
        url: '/api/master/currencies',
      }),
    }),
    getDocumentTypes: builder.query<DocumentTypeType[], { domain: string }>({
      query: (params) => ({
        url: '/api/document-types',
        params,
      }),
    }),
    getSuppliers: builder.query<SupplierType[], { supplierCode?: string; supplierName?: string }>({
      query: (params) => ({
        url: '/api/master/suppliers',
        params: { page: 0, sizePerPage: 50, ...params },
      }),
    }),
    getMsItems: builder.query<MsItemType[], MsItemsQueryParams>({
      query: (params) => ({
        url: `/api/master/items`,
        params: { ...params, page: 0, sizePerPage: 100 }, // FIXME: Remove page, sizePerPage after finished implement paging in dropdown
      }),
    }),
    getScopePurchases: builder.query<PurchaseSectionType[], { mainGroupId: string }>({
      query: (params) => ({
        url: '/api/master/scope-purchases',
        params,
      }),
    }),
    getPurchaseSections: builder.query<PaginatedResponse<GenericDropdownType>, void>({
      query: () => ({
        url: '/api/purchase-incharge-sections',
      }),
    }),
    getPaymentTerms: builder.query<PaginatedResponse<PaymentTermType>, void>({
      query: () => ({
        url: '/api/payment-terms',
      }),
    }),
    getSiteDeliveries: builder.query<SiteDeliveryType[], void>({
      query: () => ({
        url: '/api/site-deliveries',
      }),
    }),
    getSiteInvoiceTaxes: builder.query<GenericDropdownType[], void>({
      query: () => ({
        url: '/api/site-invoice-taxes',
      }),
    }),
    getNegoTypes: builder.query<GenericDropdownType[], { page?: number; sizePerPage?: number }>({
      query: () => ({
        url: '/api/nego-types',
      }),
    }),
    getDocumentStatus: builder.query<DocumentStatusType[], void>({
      query: () => ({
        url: '/api/master/purchases-status',
      }),
    }),
  }),
})

export const {
  useGetDocumentTypesQuery,
  useGetMaingroupsQuery,
  useGetBudgetTypesQuery,
  useGetCurrenciesQuery,
  useGetPurchaseSectionsQuery,
  useGetMsItemsQuery,
  useGetPaymentTermsQuery,
  useGetSiteDeliveriesQuery,
  useGetSiteInvoiceTaxesQuery,
  useGetScopePurchasesQuery,
  useGetNegoTypesQuery,
  useLazyGetMsItemsQuery,
  useLazyGetSuppliersQuery,
  useGetDocumentStatusQuery,
} = apiSliceWithUsers
