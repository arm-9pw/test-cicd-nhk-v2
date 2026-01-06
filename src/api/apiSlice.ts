import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { TLoginCredentials, TUserInfo } from 'features/auth/auth.types'

import type { RootState } from 'app/store'

import { env } from 'config/env'
import keycloak from 'config/keycloak'

export const apiSlice = createApi({
  reducerPath: 'api',
  keepUnusedDataFor: 3, // Cache for 3 seconds
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState

      // Priority 1: Check for custom token in Redux (for standalone pages)
      const customToken = state.token?.customToken

      // Priority 2: Use Keycloak token (for authenticated pages)
      const token = customToken || keycloak.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
    fetchFn: async (input, init) => {
      // Make the original fetch request
      const response = await fetch(input, init)

      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        try {
          const refreshed = await keycloak.updateToken(70)
          if (refreshed) {
            // Retry the request with the new token
            const newInit = {
              ...init,
              headers: {
                ...init?.headers,
                Authorization: `Bearer ${keycloak.token}`,
              },
            }
            return fetch(input, newInit)
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          // Force re-login if token refresh fails
          await keycloak.login()
        }
      }

      // Status codes that typically don't have response bodies
      const noBodyStatuses = [204, 205, 304]
      if (noBodyStatuses.includes(response.status)) {
        return new Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        })
      }

      // Check content length - if 0, return response without body
      const contentLength = response.headers.get('content-length')
      if (contentLength === '0') {
        return new Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        })
      }

      // Get response text to handle large numbers before JSON parsing
      const text = await response.text()

      // Replace large integers (16+ digits) with strings to prevent precision loss
      // Example: "id": 12345678901234567 becomes "id": "12345678901234567"
      const newText = text.replace(/("[^"]*"\s*:\s*)(\d{15,})/g, '$1"$2"')

      // Create new Response with modified text while preserving original response metadata
      return new Response(newText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    },
  }),

  tagTypes: [
    'PurchaseRequisition',
    'PurchaseOrder',
    'Employees',
    'BudgetManagement',
    'BudgetSites',
    'Suppliers',
    'SiteManagement',
    'ItemManagement',
    'CancelPO',
    'CancelPR',
    'Reports',
    'ApprovalRoute',
    'ApprovalQueue',
    'Delegation',
    'Workflows',
    'Certificate',
  ],
  endpoints: (builder) => ({
    login: builder.mutation<TUserInfo, TLoginCredentials>({
      query: (credentials) => ({
        url: 'https://dummyjson.com/auth/login', // FIXME: This is a fake API, replace it with your own API
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = apiSlice
