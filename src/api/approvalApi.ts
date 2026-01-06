import { apiSlice } from 'api/apiSlice'

import keycloak from 'config/keycloak'

import {
  ApprovalQueueResponse,
  ApprovalRouteResponse,
  ApproveStepRequest,
  ApproverHierarchyResponse,
  CalculateApprovalRouteRequest,
  DocumentType,
  GetApprovalQueueParams,
  GetApprovalRouteParams,
  GetApproverHierarchyParams,
  UpdateReadStatusRequest,
  UpdateStepApproverRequest,
} from './approvalApi.types'

export const approvalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApprovalRoute: builder.query<ApprovalRouteResponse, GetApprovalRouteParams>({
      query: ({ documentId, documentType, routeId }) => ({
        url: `/api/approval-routes/${documentId}`,
        params: { documentType, routeId },
      }),
      providesTags: (_result, _error, { documentId, documentType, routeId }) => [
        { 
          type: 'ApprovalRoute', 
          id: routeId 
            ? `${documentType}-${documentId}-${routeId}` 
            : `${documentType}-${documentId}` 
        },
      ],
    }),
    getApprovalQueuePending: builder.query<ApprovalQueueResponse, GetApprovalQueueParams>({
      query: (params = {}) => ({
        url: '/api/approval-queue/pending',
        params: { ...params },
      }),
      providesTags: ['ApprovalQueue'],
    }),
    getApprovalQueueHistory: builder.query<ApprovalQueueResponse, GetApprovalQueueParams>({
      query: (params = {}) => ({
        url: '/api/approval-queue/history',
        params: { ...params },
      }),
      providesTags: ['ApprovalQueue'],
    }),
    approveStep: builder.mutation<ApprovalRouteResponse, ApproveStepRequest>({
      query: (body) => ({
        url: `/api/approval-routes/${body.routeId}/steps/${body.stepId}/approve`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error) => {
        if (error) return []
        return [
          // Invalidate with routeId
          {
            type: 'ApprovalRoute',
            id: `${result?.documentType}-${result?.documentId}-${result?.routeId}`,
          },
          // Also invalidate without routeId (in case it was fetched without routeId)
          {
            type: 'ApprovalRoute',
            id: `${result?.documentType}-${result?.documentId}`,
          },
          'ApprovalQueue',
        ]
      },
    }),
    rejectStep: builder.mutation<ApprovalRouteResponse, ApproveStepRequest>({
      query: (body) => ({
        url: `/api/approval-routes/${body.routeId}/steps/${body.stepId}/reject`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error) => {
        if (error) return []
        return [
          // Invalidate with routeId
          {
            type: 'ApprovalRoute',
            id: `${result?.documentType}-${result?.documentId}-${result?.routeId}`,
          },
          // Also invalidate without routeId (in case it was fetched without routeId)
          {
            type: 'ApprovalRoute',
            id: `${result?.documentType}-${result?.documentId}`,
          },
          'ApprovalQueue',
        ]
      },
    }),
    getApproverHierarchy: builder.query<ApproverHierarchyResponse, GetApproverHierarchyParams>({
      query: ({ positionId }) => ({
        url: `/api/approval-routes/approver-hierarchy`,
        params: { positionId },
      }),
      // Use a more specific tag to avoid type issues
      providesTags: () => [{ type: 'ApprovalRoute', id: 'hierarchy' }],
    }),
    updateStepApprover: builder.mutation<ApprovalRouteResponse, UpdateStepApproverRequest>({
      query: (body) => ({
        url: `/api/approval-routes/${body.routeId}/steps/${body.stepId}/approver`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error) => {
        if (error) return []
        return [
          // Invalidate with routeId
          {
            type: 'ApprovalRoute',
            id: `${result?.documentType}-${result?.documentId}-${result?.routeId}`,
          },
          // Also invalidate without routeId (in case it was fetched without routeId)
          {
            type: 'ApprovalRoute',
            id: `${result?.documentType}-${result?.documentId}`,
          },
          { type: 'ApprovalRoute', id: 'hierarchy' },
        ]
      },
    }),
    calculateApprovalRoute: builder.mutation<ApprovalRouteResponse, CalculateApprovalRouteRequest>({
      query: (body) => ({
        url: `/api/approval-routes/calculate`,
        method: 'POST',
        body,
      }),
    }),
    updateReadStatus: builder.mutation<void, UpdateReadStatusRequest>({
      query: (body) => ({
        url: `/api/approval-routes/${body.routeId}/steps/${body.stepId}/read`,
        method: 'POST',
        body: { isRead: body.isRead },
      }),
      invalidatesTags: ['ApprovalQueue'],
    }),
  }),
})

// Base function for fetching PDF documents
const fetchPdfDocument = async (
  url: string,
  signal?: AbortSignal,
  customToken?: string | null,
): Promise<{ blob: Blob; mimeType: string }> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    // Use custom token if provided, otherwise fall back to keycloak token
    const token = customToken || keycloak.token
    const headers = new Headers()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      headers,
      signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const mimeType = response.headers.get('content-type') || blob.type || 'application/octet-stream'

    return { blob, mimeType }
  } catch (error) {
    console.error('Error loading document for preview:', error)
    throw error
  }
}

export const previewSignedDocument = async (
  documentType: DocumentType,
  documentId: string,
  signal?: AbortSignal,
  customToken?: string | null,
): Promise<{ blob: Blob; mimeType: string }> => {
  return fetchPdfDocument(
    `/api/approval-routes/documents/${documentType}/${documentId}/signed.pdf`,
    signal,
    customToken,
  )
}

export const previewSignedPO = async (
  documentId: string,
  signal?: AbortSignal,
  customToken?: string | null,
): Promise<{ blob: Blob; mimeType: string }> => {
  return fetchPdfDocument(
    `/api/approval-routes/documents/PO/${documentId}/signed-po.pdf`,
    signal,
    customToken,
  )
}

export const previewPOBudget = async (
  documentId: string,
  signal?: AbortSignal,
  customToken?: string | null,
): Promise<{ blob: Blob; mimeType: string }> => {
  return fetchPdfDocument(
    `/api/approval-routes/documents/PO/${documentId}/po-budget.pdf`,
    signal,
    customToken,
  )
}

export const downloadSignedDocument = async (
  documentType: DocumentType,
  documentId: string,
  customToken?: string | null,
): Promise<void> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    // Use custom token if provided, otherwise fall back to keycloak token
    const token = customToken || keycloak.token
    const headers = new Headers()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(
      `${baseUrl}/api/approval-routes/documents/${documentType}/${documentId}/signed.pdf`,
      {
        method: 'GET',
        headers,
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const contentDisposition = response.headers.get('Content-Disposition')
    let fileName = `${documentType}_${documentId}.pdf`

    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (match && match[1]) {
        fileName = match[1].replace(/['"]/g, '')
      }
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading signed document:', error)
    throw error
  }
}

export const {
  useGetApprovalRouteQuery,
  useGetApprovalQueuePendingQuery,
  useGetApprovalQueueHistoryQuery,
  useApproveStepMutation,
  useRejectStepMutation,
  useGetApproverHierarchyQuery,
  useUpdateStepApproverMutation,
  useCalculateApprovalRouteMutation,
  useUpdateReadStatusMutation,
} = approvalApi
