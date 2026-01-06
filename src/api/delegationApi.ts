import { apiSlice } from 'api/apiSlice'

import {
  CancelDelegationRequest,
  CreateDelegationRequest,
  DelegationParams,
  DelegationPersonType,
  DelegationType,
  ExtendDelegationRequest,
  UpdateDelegationRequest,
} from './delegationApi.types'

export const delegationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listDelegatePeople: builder.query<
      DelegationPersonType[],
      { organizationId?: string; positionId?: string }
    >({
      query: (params) => ({
        url: '/api/delegations/delegate',
        params: params,
      }),
    }),
    listDelegations: builder.query<DelegationType[], DelegationParams>({
      query: (params) => ({
        url: '/api/delegations',
        params: params,
      }),
      providesTags: ['Delegation'],
    }),
    createDelegation: builder.mutation<DelegationType, CreateDelegationRequest>({
      query: (body) => ({
        url: '/api/delegations',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, error) => {
        if (error) return []
        return ['Delegation']
      },
    }),
    getDelegation: builder.query<DelegationType, string>({
      query: (id) => ({
        url: `/api/delegations/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: 'Delegation', id }],
    }),
    cancelDelegation: builder.mutation<
      DelegationType,
      { id: string; body: CancelDelegationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/delegations/${id}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'Delegation', id }, 'Delegation']
      },
    }),
    extendDelegation: builder.mutation<
      DelegationType,
      { id: string; body: ExtendDelegationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/delegations/${id}/extend`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'Delegation', id }, 'Delegation']
      },
    }),
    updateDelegation: builder.mutation<
      DelegationType,
      { id: string; body: UpdateDelegationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/delegations/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, error, { id }) => {
        if (error) return []
        return [{ type: 'Delegation', id }, 'Delegation']
      },
    }),
    deleteDelegation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/delegations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, error) => {
        if (error) return []
        return ['Delegation']
      },
    }),
  }),
})

export const {
  useListDelegatePeopleQuery,
  useListDelegationsQuery,
  useLazyListDelegationsQuery,
  useCreateDelegationMutation,
  useGetDelegationQuery,
  useCancelDelegationMutation,
  useExtendDelegationMutation,
  useUpdateDelegationMutation,
  useDeleteDelegationMutation,
} = delegationApi
