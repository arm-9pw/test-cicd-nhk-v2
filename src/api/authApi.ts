import { apiSlice } from 'api/apiSlice'

import { UserInfoType } from './authApi.types'

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserInfoType, void>({
      query: () => ({
        url: '/api/user-info',
      }),
    }),
    updateUserCurrentPosition: builder.mutation<
      UserInfoType,
      { positionId: string; organizationId: string }
    >({
      query: (data) => ({
        url: '/api/user-info/current-position',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetUserInfoQuery,
  useUpdateUserCurrentPositionMutation,
} = authSlice
