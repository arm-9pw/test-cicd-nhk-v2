import { GetProp, UploadProps } from 'antd'

import { apiSlice } from 'api/apiSlice'

import {
  BudgetItemType,
  BudgetQueryParams,
  CalculatedBCSParams,
  CreatePRWithFileDTO,
  PrBudgetControlSheetType,
  PurchaseRequisitionRespType,
  TransferPRDTO,
} from './prApi.types'
import { CancelPurchaseLogDTO, PurchaseLogType } from './purchaseLogApi.types'

export type TBudgetEnquiryItem = {
  id: number
  site: string
  section: string
  budgetCode: string
  assetName: string
  assetType: string
  fiscalYear: string
  status: 'ACTIVE' | 'INACTIVE'
}

export type TSupplierListResponse = {
  message: string
  data: {
    id: number
    supplierName: string
  }[]
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBudgets: builder.query<BudgetItemType[], BudgetQueryParams>({
      query: (params) => ({
        url: '/api/budgets/available',
        params: { ...params },
      }),
    }),
    getCalculatedBCS: builder.query<PrBudgetControlSheetType[], CalculatedBCSParams>({
      query: (params) => ({
        url: '/api/budgets/calculate-control-sheet',
        params: { ...params },
      }),
    }),
    getPrById: builder.query<PurchaseRequisitionRespType, string>({
      query: (id) => ({
        url: `/api/purchase-requisitions/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'PurchaseRequisition', id }],
    }),
    getPrByPoId: builder.query<PurchaseRequisitionRespType[], string>({
      query: (poId) => ({
        url: `/api/purchase-requisitions/po/${poId}`,
      }),
    }),
    // Mutation
    createPR: builder.mutation<PurchaseRequisitionRespType, CreatePRWithFileDTO>({
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
          url: '/api/purchase-requisitions/workflow/create-with-approval-route',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - browser will set it automatically with boundary
          formData: true,
        }
      },
    }),
    updatePR: builder.mutation<
      PurchaseRequisitionRespType,
      { id: string; data: Partial<PurchaseRequisitionRespType> }
    >({
      query: ({ id, data }) => ({
        url: `/api/purchase-requisitions/workflow/${id}/update-with-route-recalculation`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    // NOTE: [16 Sep 2025] Use submitWithApproval instead. This one will not be using anymore.
    submitPR: builder.mutation<
      PurchaseRequisitionRespType,
      { id: string; prData: Partial<PurchaseRequisitionRespType> | null }
    >({
      query: ({ id, prData }) => ({
        url: `/api/purchase-requisitions/${id}/update-submit`,
        method: 'PUT',
        body: prData,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    assignPRPurchaser: builder.mutation<PurchaseRequisitionRespType, { id: string }>({
      query: ({ id }) => ({
        url: `/api/purchase-requisitions/${id}/assign-purchaser`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    deletePR: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-requisitions/${id}`,
        method: 'DELETE',
      }),
    }),
    approvePR: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-requisitions/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    revisePR: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-requisitions/${id}/revise`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    rejectPR: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-requisitions/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    receivePR: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/purchase-requisitions/${id}/receive`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    cancelPR: builder.mutation<PurchaseLogType, CancelPurchaseLogDTO>({
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
          url: '/api/purchase-logs/pr/cancel',
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
        return []
      },
    }),
    transferPR: builder.mutation<void, { id: string; data: TransferPRDTO }>({
      query: ({ id, data }) => ({
        url: `/api/purchase-requisitions/${id}/transfer`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'PurchaseRequisition', id }]
      },
    }),
    submitWithApproval: builder.mutation<void, { prid: string; passcode: string }>({
      query: ({ prid, passcode }) => ({
        url: `/api/purchase-requisitions/workflow/${prid}/submit-with-approval`,
        method: 'PATCH',
        body: { passcode },
      }),
      invalidatesTags: (_result, error, { prid }) => {
        if (error) return []
        return [
          { type: 'PurchaseRequisition', id: prid },
          { type: 'ApprovalRoute', id: `PR-${prid}` },
        ]
      },
    }),
    submitForReceiving: builder.mutation<void, { prid: string; passcode: string }>({
      query: ({ prid, passcode }) => ({
        url: `/api/purchase-requisitions/workflow/${prid}/submit-for-receiving`,
        method: 'PATCH',
        body: { passcode },
      }),
      invalidatesTags: (_result, error, { prid }) => {
        if (error) return []
        return [
          { type: 'PurchaseRequisition', id: prid },
          { type: 'ApprovalRoute', id: `PR-${prid}` },
        ]
      },
    }),
  }),
})

export const {
  useCreatePRMutation,
  useGetBudgetsQuery,
  useLazyGetCalculatedBCSQuery,
  useLazyGetBudgetsQuery,
  useLazyGetPrByIdQuery,
  useUpdatePRMutation,
  useSubmitPRMutation,
  useGetPrByIdQuery,
  useGetPrByPoIdQuery,
  useAssignPRPurchaserMutation,
  useDeletePRMutation,
  useApprovePRMutation,
  useRevisePRMutation,
  useRejectPRMutation,
  useReceivePRMutation,
  useCancelPRMutation,
  useTransferPRMutation,
  useSubmitWithApprovalMutation,
  useSubmitForReceivingMutation,
} = apiSliceWithUsers
