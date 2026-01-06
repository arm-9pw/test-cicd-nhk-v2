import { apiSlice } from './apiSlice'
import { OrganizationResponseType, SiteManagementResponseType } from './siteManagementApi.types'

export const siteManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSiteManagement: builder.query<
      SiteManagementResponseType[],
      {
        page?: number
        pageSize?: number
        siteCode?: string
      }
    >({
      query: ({ page, pageSize, siteCode }) => {
        const params: {
          page?: number
          sizePerPage?: number
          siteCode?: string
        } = {}
        if (page !== undefined) {
          params.page = page - 1
        }
        if (pageSize !== undefined) {
          params.sizePerPage = pageSize
        }
        if (siteCode) {
          params.siteCode = siteCode
        }
        return {
          url: `/api/site-deliveries`,
          method: 'GET',
          params,
        }
      },
      providesTags: () => [{ type: 'SiteManagement', id: 'LIST' }],
    }),
    createSiteManagement: builder.mutation<
      SiteManagementResponseType,
      Partial<SiteManagementResponseType>
    >({
      query: (site) => ({
        url: '/api/site-deliveries',
        method: 'POST',
        body: site,
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'SiteManagement', id: 'LIST' }]
      },
    }),
    updateSiteManagement: builder.mutation<
      SiteManagementResponseType,
      { id: string } & Partial<SiteManagementResponseType>
    >({
      query: (data) => ({
        url: `/api/site-deliveries/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'SiteManagement', id: 'LIST' }]
      },
    }),
    deleteSiteManagement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/site-deliveries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'SiteManagement', id: 'LIST' }]
      },
    }),
    getOrganizationsTypes: builder.query<OrganizationResponseType[], { alternativeName?: string }>({
      query: (params) => ({
        url: '/api/organizations',
        method: 'GET',
        params,
      }),
    }),
    getBudgetSiteBySiteCode: builder.query<OrganizationResponseType[], { siteCode: string }>({
      query: ({ siteCode }) => ({
        url: `/api/organizations/budget-sites`,
        method: 'GET',
        params: { siteCode },
      }),
    }),
  }),
})

export const {
  useGetSiteManagementQuery,
  useCreateSiteManagementMutation,
  useUpdateSiteManagementMutation,
  useDeleteSiteManagementMutation,
  useGetOrganizationsTypesQuery,
  useGetBudgetSiteBySiteCodeQuery,
} = siteManagementApi
