import { GetProp, UploadProps } from 'antd'

import { apiSlice } from 'api/apiSlice'

import { DOMAINS } from 'constants/index'

import {
  ApproveCancelDomainType,
  ApprovePurchaseLogDTO,
  CancelPurchaseLogDTO,
  PurchaseLogType,
  PurchaseLogWithDomainDTO,
} from './purchaseLogApi.types'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const purchaseLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseLogByPoId: builder.query<PurchaseLogType, string>({
      query: (poId) => `/api/purchase-logs/po/${poId}`,
      providesTags: (_result, _error, poId) => [{ type: 'CancelPO', poId }],
    }),

    getPurchaseLogByPrId: builder.query<PurchaseLogType, string>({
      query: (prId) => `/api/purchase-logs/pr/${prId}`,
      providesTags: (_result, _error, prId) => [{ type: 'CancelPR', prId }],
    }),
    // Mutation
    cancelPurchaseLog: builder.mutation<PurchaseLogType, CancelPurchaseLogDTO>({
      query: ({ files, data }) => {
        // Create FormData instance
        const formData = new FormData()

        // Append files
        files.forEach((file) => {
          formData.append(`files`, file as FileType)
        })

        // Append purchase log data as JSON string
        formData.append('data', JSON.stringify(data))

        return {
          url: '/api/purchase-logs/cancel',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - browser will set it automatically with boundary
          formData: true,
        }
      },
      invalidatesTags: (_result, error, args) => {
        if (error) return []
        if (args?.data?.prId)
          return [
            { type: 'PurchaseRequisition', id: args.data.prId },
            { type: 'CancelPR', prId: args.data.prId },
          ]
        if (args?.data?.poId)
          return [
            { type: 'PurchaseOrder', id: args.data.poId },
            { type: 'CancelPO', poId: args.data.poId },
          ]
        return []
      },
    }),
    deletePurchaseLog: builder.mutation<void, PurchaseLogWithDomainDTO>({
      query: ({ id }) => ({
        url: `/api/purchase-logs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, error, { domain, domainId }) => {
        if (error) return []
        if (domain === DOMAINS.PURCHASE_REQUISITION)
          return [{ type: 'PurchaseRequisition', id: domainId }]
        if (domain === DOMAINS.PURCHASE_ORDER) return [{ type: 'PurchaseOrder', id: domainId }]
        return []
      },
    }),
    approvePurchaseLog: builder.mutation<
      void,
      { domain: ApproveCancelDomainType; data: ApprovePurchaseLogDTO }
    >({
      query: ({ data }) => ({
        url: `/api/purchase-logs/${data?.id}/approve`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, error, { domain }) => {
        if (error) return []
        if (domain.domainName === DOMAINS.PURCHASE_REQUISITION)
          return [
            { type: 'PurchaseRequisition', id: domain.domainId },
            { type: 'CancelPR', prId: domain.domainId },
          ]
        if (domain.domainName === DOMAINS.PURCHASE_ORDER)
          return [
            { type: 'PurchaseOrder', id: domain.domainId },
            { type: 'CancelPO', poId: domain.domainId },
          ]
        return []
      },
    }),
  }),
})

export const {
  useCancelPurchaseLogMutation,
  useGetPurchaseLogByPoIdQuery,
  useGetPurchaseLogByPrIdQuery,
  useDeletePurchaseLogMutation,
  useApprovePurchaseLogMutation,
} = purchaseLogApi
