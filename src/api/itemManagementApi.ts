import { GetProp, UploadProps } from 'antd'

import { apiSlice } from './apiSlice'
import { CreateItemWithFileDTO, ItemManagementRespType } from './itemManagementApiType'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const itemManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItemManagement: builder.query<
      ItemManagementRespType[],
      {
        page?: number
        pageSize?: number
        name?: string
        model?: string
        brand?: string
      }
    >({
      query: ({ page, pageSize, name, model, brand }) => {
        const params: {
          page?: number
          sizePerPage?: number
          name?: string
          model?: string
          brand?: string
        } = {}

        if (page !== undefined) {
          params.page = page - 1
        }
        if (pageSize !== undefined) {
          params.sizePerPage = pageSize
        }
        if (name) {
          params.name = name
        }
        if (model) {
          params.model = model
        }
        if (brand) {
          params.brand = brand
        }

        return {
          url: '/api/master/items',
          method: 'GET',
          params,
        }
      },
      providesTags: () => [{ type: 'ItemManagement', id: 'LIST' }],
    }),

    createItemManagement: builder.mutation<ItemManagementRespType, CreateItemWithFileDTO>({
      query: ({ files, data }) => {
        const formData = new FormData()
        files.forEach((member) => {
          formData.append('files', member as FileType)
        })
        formData.append('data', JSON.stringify(data))

        return {
          url: '/api/master/items',
          method: 'POST',
          body: formData,
          formData: true,
        }
      },
      invalidatesTags: () => [{ type: 'ItemManagement', id: 'LIST' }],
    }),

    updateItemManagement: builder.mutation<
      ItemManagementRespType,
      { id: string; data: Partial<ItemManagementRespType> }
    >({
      query: ({ id, data }) => ({
        url: `/api/master/items/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [
          { type: 'ItemManagement', id: 'LIST' },
          { type: 'ItemManagement', id },
        ]
      },
    }),

    deleteItemManagement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/master/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, error, id) => {
        if (error) return []
        return [
          { type: 'ItemManagement', id: 'LIST' },
          { type: 'ItemManagement', id },
        ]
      },
    }),
  }),
})

export const {
  useGetItemManagementQuery,
  useCreateItemManagementMutation,
  useUpdateItemManagementMutation,
  useDeleteItemManagementMutation,
} = itemManagementApi
