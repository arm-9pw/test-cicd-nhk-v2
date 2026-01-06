import { apiSlice } from 'api/apiSlice'

import { CertificateStatusDTO, PasscodeSuccessResponse } from './certificateApi.types'

export const certificateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get certificate status for current user
     */
    getCertificateStatus: builder.query<CertificateStatusDTO, void>({
      query: () => ({
        url: '/api/user/certificate/status',
      }),
      providesTags: ['Certificate'],
    }),

    /**
     * Request existing passcode to be sent via email (Forgot Passcode)
     */
    requestPasscodeEmail: builder.mutation<PasscodeSuccessResponse, void>({
      query: () => ({
        url: '/api/user/passcode',
        method: 'POST',
      }),
    }),

    /**
     * Reset passcode (generate new passcode, keep certificate)
     */
    resetPasscode: builder.mutation<PasscodeSuccessResponse, void>({
      query: () => ({
        url: '/api/user/passcode/reset',
        method: 'POST',
      }),
    }),

    /**
     * Regenerate certificate and passcode
     */
    regenerateCertificate: builder.mutation<PasscodeSuccessResponse, void>({
      query: () => ({
        url: '/api/user/passcode/regenerate',
        method: 'POST',
      }),
      invalidatesTags: ['Certificate'],
    }),
  }),
})

export const {
  useGetCertificateStatusQuery,
  useLazyGetCertificateStatusQuery,
  useRequestPasscodeEmailMutation,
  useResetPasscodeMutation,
  useRegenerateCertificateMutation,
} = certificateApi