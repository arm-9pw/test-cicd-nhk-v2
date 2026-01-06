import { apiSlice } from 'api/apiSlice'

import keycloak from 'config/keycloak'

import { CreateReportJobRequest, ReportData } from './reportApi.types'

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listReports: builder.query<ReportData[], { siteCode: string; jobName: string }>({
      query: (params) => ({
        url: '/api/purchase-reports',
        method: 'GET',
        params,
      }),
      providesTags: (_, error, { jobName }) => {
        if (error) return []
        return [{ type: 'Reports', id: jobName }]
      },
    }),
    createReportJob: builder.mutation<ReportData, CreateReportJobRequest>({
      query: (body) => ({
        url: '/api/purchase-reports',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, error, { jobName }) => {
        if (error) return []
        return [{ type: 'Reports', id: jobName }]
      },
    }),
  }),
})

// Standalone download function to avoid RTK Query caching
export const downloadReport = async (jobId: number) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    // Get token from Keycloak
    const token = keycloak.token
    const headers = new Headers()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    const response = await fetch(`${baseUrl}/api/purchase-reports/${jobId}/download`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    let fileName = 'report' // default filename

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/['"]/g, '')
      }
    }

    // Get the blob from the response
    const blob = await response.blob()

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob)

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = url
    link.download = fileName

    // Append to body, click and cleanup
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Revoke the URL to free up memory
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading report:', error)
    throw error
  }
}

export const { useListReportsQuery, useLazyListReportsQuery, useCreateReportJobMutation } =
  reportApi
