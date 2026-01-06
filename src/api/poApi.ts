import { GetProp, UploadFile, UploadProps } from 'antd'

import { apiSlice } from 'api/apiSlice'

import {
  CreatePoDTOType,
  PurchaseOrderDTORespType,
  PurchaseOrderRespType,
  UpdatePoDTOType,
} from './poApi.types'
import { PurchaseRequisitionRespType } from './prApi.types'
import { CancelPurchaseLogDTO, PurchaseLogType } from './purchaseLogApi.types'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPRForPO: builder.query<PurchaseRequisitionRespType[], { prNo: string }>({
      query: (params) => ({
        url: '/api/purchase-requisitions/po/search',
        params: params,
      }),
    }),
    getPoById: builder.query<PurchaseOrderRespType, string>({
      query: (id) => ({
        url: `api/purchase-orders/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'PurchaseOrder', id }],
    }),
    createPO: builder.mutation<
      PurchaseOrderDTORespType,
      { data: CreatePoDTOType; files: UploadFile[] }
    >({
      query: ({ files, data }) => {
        // Create FormData instance
        const formData = new FormData()

        // Append files
        files.forEach((file) => {
          formData.append(`files`, file as FileType)
        })

        // Append PR data as JSON string
        formData.append('data', JSON.stringify(data))

        return {
          url: '/api/purchase-orders/workflow/create-with-approval-route',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - browser will set it automatically with boundary
          formData: true,
        }
      },
    }),
    updatePO: builder.mutation<PurchaseOrderRespType, UpdatePoDTOType>({
      query: (data) => ({
        url: `/api/purchase-orders/workflow/${data.id}/update-with-route-recalculation`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'PurchaseOrder', id }]
      },
    }),
    submitPO: builder.mutation<
      PurchaseOrderRespType,
      { id: string; poData: UpdatePoDTOType | null }
    >({
      query: ({ id, poData }) => ({
        url: `/api/purchase-orders/${id}/update-submit`,
        method: 'PUT',
        body: poData,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'PurchaseOrder', id }]
      },
    }),
    submitWithApprovalPO: builder.mutation<void, { poid: string; passcode: string }>({
      query: ({ poid, passcode }) => ({
        url: `/api/purchase-orders/workflow/${poid}/submit-with-approval`,
        method: 'PATCH',
        body: { passcode },
      }),
      invalidatesTags: (_result, error, { poid }) => {
        if (error) return []
        return [
          { type: 'PurchaseOrder', id: poid },
          { type: 'ApprovalRoute', id: `PO-${poid}` },
        ]
      },
    }),
    deletePO: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-orders/${id}`,
        method: 'DELETE',
      }),
    }),
    rejectPO: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-orders/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [{ type: 'PurchaseOrder', id }]
      },
    }),
    approvePO: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-orders/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [{ type: 'PurchaseOrder', id }]
      },
    }),
    cancelPO: builder.mutation<PurchaseLogType, CancelPurchaseLogDTO>({
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
          url: '/api/purchase-logs/po/cancel',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - browser will set it automatically with boundary
          formData: true,
        }
      },
      invalidatesTags: (_result, error, args) => {
        if (error) return []
        if (!args?.data?.poId) return []
        return [
          { type: 'PurchaseOrder', id: args.data.poId },
          { type: 'CancelPO', poId: args.data.poId },
        ]
      },
    }),
    revisePO: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-orders/${id}/revise`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [{ type: 'PurchaseOrder', id }]
      },
    }),
  }),
})

export const {
  useLazyListPRForPOQuery,
  useCreatePOMutation,
  useLazyGetPoByIdQuery,
  useUpdatePOMutation,
  useSubmitPOMutation,
  useGetPoByIdQuery,
  useDeletePOMutation,
  useRejectPOMutation,
  useApprovePOMutation,
  useCancelPOMutation,
  useRevisePOMutation,
  useSubmitWithApprovalPOMutation,
} = apiSliceWithUsers
