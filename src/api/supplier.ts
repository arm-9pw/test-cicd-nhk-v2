import { apiSlice } from './apiSlice'
import { SupplierType } from './supplierApi.types'

export const supplierApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // FIXME: Duplicate with supplier in masterApi
    getSuppliersManagement: builder.query<
      SupplierType[],
      {
        page?: number
        pageSize?: number
        supplierCode?: string
      }
    >({
      query: ({ page, pageSize, supplierCode }) => {
        const params: {
          page?: number
          sizePerPage?: number
          supplierCode?: string
        } = {}
        if (page !== undefined) {
          params.page = page - 1
        }
        if (pageSize !== undefined) {
          params.sizePerPage = pageSize
        }
        if (supplierCode) {
          params.supplierCode = supplierCode
        }
        return { url: '/api/master/suppliers', method: 'GET', params }
      },
      providesTags: [{ type: 'Suppliers', id: 'LIST' }],
    }),
    createSupplier: builder.mutation<SupplierType, Partial<SupplierType>>({
      query: (supplier) => ({
        url: '/api/master/suppliers',
        method: 'POST',
        body: supplier,
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Suppliers', id: 'LIST' }]
      },
    }),
    updateSupplier: builder.mutation<SupplierType, Partial<SupplierType>>({
      query: (updateSupplier) => ({
        url: `/api/master/suppliers/${updateSupplier.id}`,
        method: 'PUT',
        body: updateSupplier,
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Suppliers', id: 'LIST' }]
      },
    }),
    deleteSupplier: builder.mutation<void, string>({
      query: (supplierId) => ({
        url: `/api/master/suppliers/${supplierId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Suppliers', id: 'LIST' }]
      },
    }),
  }),
})

export const {
  useGetSuppliersManagementQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi
