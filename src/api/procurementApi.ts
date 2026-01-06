import { apiSlice } from 'api/apiSlice'

import {
  DocumentLocationDataType,
  DocumentLocationQueryParams,
  ProcurementCount,
  ProcurementOperation,
  ProcurementQueryParams,
} from './procurementApi.types'

export const procurementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listProcurementOperations: builder.query<ProcurementOperation[], ProcurementQueryParams>({
      query: (params) => ({
        url: '/api/procurement-operations',
        params: { ...params, page: (params.page ?? 1) - 1 },
      }),
      // transformResponse: (response: ProcurementOperation[]) => {
      //   // Remove empty children arrays to optimize data structure
      //   function removeEmptyChildren(data: ProcurementOperation[]): ProcurementOperation[] {
      //     return data.map((item) => {
      //       const newItem = { ...item }

      //       if (newItem.children && newItem.children.length > 0) {
      //         newItem.children = removeEmptyChildren(newItem.children)
      //       } else {
      //         delete newItem.children
      //       }

      //       return newItem
      //     })
      //   }

      //   return removeEmptyChildren(response)
      // },
    }),
    getProcurementCounts: builder.query<ProcurementCount[], ProcurementQueryParams>({
      query: (params) => ({
        url: '/api/procurement-counts',
        params,
      }),
    }),
    getDocumentLocation: builder.query<DocumentLocationDataType[], DocumentLocationQueryParams>({
      query: (params) => ({
        url: '/api/document-locations',
        params,
      }),
    }),
  }),
})

export const {
  useListProcurementOperationsQuery,
  useGetProcurementCountsQuery,
  useGetDocumentLocationQuery,
} = procurementApi
