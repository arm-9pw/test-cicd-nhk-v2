import { apiSlice } from './apiSlice'
import {
  EmployeeDetailType,
  EmployeeProfileType,
  EmployeeUpdateType,
  EmployeeUserType,
  GetEmployeesRequest,
  PositionCreateRequest,
  PositionDropdownType,
  SiteCodeType,
  SiteType,
  UpdateEmployeePositionRequest,
  UpdateEmployeePositionResponse,
  useCreateRequest,
} from './employeeApi.types'

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeUserType[], GetEmployeesRequest>({
      query: ({ page, pageSize, search }) => ({
        url: '/api/employees',
        method: 'GET',
        params: {
          page: page ? page - 1 : undefined, // NOTE: becuase backend is 0-indexed but frontend is starting at 1
          sizePerPage: pageSize,
          keyword: search,
        },
      }),
      providesTags: () => [{ type: 'Employees', id: 'LIST' }],
    }),
    getEmployeeById: builder.query<EmployeeDetailType, string>({
      query: (id) => ({
        url: `/api/employees/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Employees', id }],
    }),
    updateEmployee: builder.mutation<
      EmployeeProfileType,
      { employeeId: string; data: Partial<EmployeeUpdateType> }
    >({
      query: ({ employeeId, data }) => ({
        url: `/api/employees/${employeeId}`,
        method: 'PATCH',
        body: data,
      }),
      // Invalidate the cache for this employee to refetch latest data
      invalidatesTags: (_, error, { employeeId }) => {
        if (error) return []
        return [
          { type: 'Employees', id: employeeId },
          { type: 'Employees', id: 'LIST' },
        ]
      },
    }),
    getSiteCodes: builder.query<SiteCodeType[], void>({
      query: () => ({
        url: '/api/organizations/site-codes',
        method: 'GET',
      }),
    }),
    getPositions: builder.query<
      PositionDropdownType[],
      { page?: number; sizePerPage?: number; posName?: string }
    >({
      query: (params) => ({
        url: '/api/positions',
        method: 'GET',
        params,
      }),
    }),
    updateEmployeePosition: builder.mutation<
      UpdateEmployeePositionResponse,
      UpdateEmployeePositionRequest
    >({
      query: (data) => ({
        url: `/api/position-employees`,
        method: 'PUT',
        body: data,
      }),
      // Invalidate the cache for this employee to refetch latest data
      invalidatesTags: (_, error, { employeeId }) => {
        if (error) return []
        return [{ type: 'Employees', id: employeeId }]
      },
    }),
    createPosition: builder.mutation<PositionCreateRequest, Partial<PositionCreateRequest>>({
      query: (data) => ({
        url: `/api/position-employees`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_, error, { employeeId }) => {
        if (error) return []
        return [{ type: 'Employees', id: employeeId }]
      },
    }),
    deletePosition: builder.mutation<void, string>({
      query: (positionId) => ({
        url: `/api/position-employees/${positionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Employees', id: 'LIST' }]
      },
    }),
    listSite: builder.query<SiteType[], void>({
      query: () => ({
        url: '/api/organizations/sites',
      }),
    }),
    listSiteWithPermission: builder.query<SiteType[], void>({
      query: () => ({
        url: '/api/organizations/sites-permission',
      }),
    }),
    listSection: builder.query<
      SiteType[],
      { alternativeName?: string; siteCode?: string | null; page?: number; sizePerPage?: number }
    >({
      query: (params) => ({
        url: '/api/organizations',
        params,
      }),
    }),
    listSectionDepartment: builder.query<
      SiteType[],
      { alternativeName?: string; siteCode?: string | null; page?: number; sizePerPage?: number }
    >({
      query: (params) => ({
        url: '/api/organizations/department',
        params,
      }),
    }),
    createUser: builder.mutation<EmployeeUserType, useCreateRequest>({
      query: (data) => {
        console.log('API URL:', '/api/employees')
        console.log('Request data:', data)
        return {
          url: '/api/employees',
          method: 'POST',
          body: data,
        }
      },
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useLazyGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useGetSiteCodesQuery,
  useGetPositionsQuery,
  useUpdateEmployeePositionMutation,
  useCreatePositionMutation,
  useDeletePositionMutation,
  useListSiteQuery,
  useListSectionQuery,
  useListSiteWithPermissionQuery,
  useLazyListSectionQuery,
  useLazyListSectionDepartmentQuery,
  useListSectionDepartmentQuery,
  useCreateUserMutation,
} = userApi
