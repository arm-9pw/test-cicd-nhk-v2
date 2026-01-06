import { apiSlice } from './apiSlice'
import { FileType } from './attachmentApi.types'
import {
  CreateGRdocumentRequestType,
  GRDocumentItemType,
  GRHistoryDataType,
  GRbyIdDataType,
  GetGRHistoryParams,
  TPOGRItemQueryParams,
  TPOGRItemRemainingQueryParams,
  TPOGRItems,
  TPOGRRemainingItem,
  UpdateGRdocumentRequestType,
  createGRRequestDataType,
  createGRResponseDataType,
  updateGRRequestDataType,
  updateGRResponseDataType,
} from './grApi.types'

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPOGRs: builder.query<TPOGRItems, TPOGRItemQueryParams>({
      query: (params) => {
        return {
          url: '/api/purchase-orders/gr/search',
          params: { poNo: params?.poNo, page: params?.page, sizePerPage: params?.sizePerPage },
        }
      },
      transformResponse: (response: TPOGRItems) => {
        return response
      },
    }),
    getPOGRRemainingItems: builder.query<TPOGRRemainingItem, TPOGRItemRemainingQueryParams>({
      query: (params) => ({
        url: `/api/purchase-orders/${params?.id}/remaining-items`,
        params: { page: params?.page, sizePerPage: params?.sizePerPage },
      }),
      transformResponse: (response: TPOGRRemainingItem) => {
        return response
      },
    }),
    getGRById: builder.query<GRbyIdDataType, string>({
      query: (id) => ({
        url: `/api/good-receives/${id}`,
      }),
      transformResponse: (response: GRbyIdDataType) => {
        return response
      },
    }),
    createGR: builder.mutation<createGRResponseDataType, createGRRequestDataType>({
      query: (createGRRequestData) => {
        const formData = new FormData()

        // Add metadata as JSON string
        const data = {
          purchaseOrderId: createGRRequestData.data.purchaseOrderId,
          comment: createGRRequestData.data.comment,
          goodReceiveItems: createGRRequestData.data.goodReceiveItems,
          documentAttachFiles: createGRRequestData.data.documentAttachFiles,
          requesterId: createGRRequestData.data?.requesterId,
          requesterName: createGRRequestData.data?.requesterName,
          requesterSite: createGRRequestData.data?.requesterSite,
          requesterSection: createGRRequestData.data?.requesterSection,
        }

        formData.append('data', JSON.stringify(data))

        // Add file
        if (createGRRequestData.files) {
          createGRRequestData.files.forEach((file) => {
            formData.append('files', file.file as FileType, file.file?.name)
          })
        }

        return {
          url: `/api/good-receives`,
          method: 'POST',
          body: formData,
          formData: true,
        }
      },
    }),
    updateGR: builder.mutation<updateGRResponseDataType, updateGRRequestDataType>({
      query: (updateGRRequestData) => ({
        url: `/api/good-receives/${updateGRRequestData?.id}`,
        method: 'PUT',
        body: updateGRRequestData,
      }),
    }),
    deleteGR: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/good-receives/${id}`,
        method: 'DELETE',
      }),
    }),
    getGRDocuments: builder.query<GRDocumentItemType[], string>({
      query: (GRid) => ({
        url: `/api/documents`,
        params: { refId: GRid },
      }),
      transformResponse: (response: GRDocumentItemType[]) => {
        // generate no from index
        response.forEach((item, index) => {
          item.no = index + 1
        })

        // add empty row for new row
        response.push({
          documentNo: '',
          documentDate: '',
          fileName: '',
          fileUrl: '',
          fileSize: '',
          mimeType: '',
          domain: '',
          refId: '',
          documentType: '',
          id: '',
          key: `newRow-${response.length + 1}`,
          no: response.length + 1,
          isNewRow: true,
        })

        return response
      },
    }),
    // Add document endpoint
    // POST /api/documents?refId={prId}
    // Expected request: multipart/form-data with metadata and file
    // Expected response: GRDocumentItemType with server-generated id
    createGRDocument: builder.mutation<GRDocumentItemType, CreateGRdocumentRequestType>({
      query: (document) => {
        const formData = new FormData()

        // Add data as JSON string
        formData.append('metadata', JSON.stringify(document.metadata))

        // Add file if it exists
        if (document.file) {
          formData.append('file', document.file as FileType)
        }

        return {
          url: `/api/documents`,
          method: 'POST',
          params: {
            refId: document.metadata.refId,
          },
          body: formData,
          // Don't set Content-Type header, browser will set it with boundary
          formData: true,
        }
      },
    }),
    updateGRDocument: builder.mutation<GRDocumentItemType, UpdateGRdocumentRequestType>({
      query: (document) => {
        const formData = new FormData()

        formData.append('metadata', JSON.stringify(document.metadata))

        // Add file if it exists
        if (document.file) {
          formData.append('file', document.file as FileType)
        }

        return {
          url: `/api/documents/${document.metadata.id}`,
          method: 'PUT',
          body: formData,
          // Don't set Content-Type header, browser will set it with boundary
          formData: true,
        }
      },
    }),
    deleteGRDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/api/documents/${documentId}`,
        method: 'DELETE',
      }),
    }),
    getGRHistory: builder.query<GRHistoryDataType, GetGRHistoryParams>({
      query: (params) => {
        return {
          url: `/api/good-receives/${params?.poId}/history`,
        }
      },
      // transformResponse: (response: GRHistoryDataType) => {
      //   return response
      // },
    }),
  }),
})

export const {
  // useLazyGetBudgetsQuery,
  // useGetBudgetsQuery,
  // useLazyGetSuppliersQuery,
  // useGetBudgetControlSheetDataMutation,
  useLazyGetPOGRsQuery,
  useLazyGetPOGRRemainingItemsQuery,
  useGetPOGRRemainingItemsQuery,
  useCreateGRMutation,
  useUpdateGRMutation,
  useLazyGetGRDocumentsQuery,
  useCreateGRDocumentMutation,
  useDeleteGRDocumentMutation,
  useLazyGetGRHistoryQuery,
  useGetGRHistoryQuery,
  useUpdateGRDocumentMutation,
  useLazyGetGRByIdQuery,
  useDeleteGRMutation,
} = apiSliceWithUsers
