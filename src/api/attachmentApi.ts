import { apiSlice } from 'api/apiSlice'

import keycloak from 'config/keycloak'
import { formatToLocalDateTime } from 'utils/dateHelpers'

import {
  AddDocumentRequest,
  AttachmentFileType,
  FileType,
  UpdateDocumentRequest,
} from './attachmentApi.types'

export const attachmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addDocument: builder.mutation<AttachmentFileType, AddDocumentRequest>({
      query: ({ refId, document }) => {
        const formData = new FormData()

        // Add metadata as JSON string
        const metadata = {
          domain: document.domain,
          documentType: document.documentType,
          documentNo: document.documentNo,
          documentDate: formatToLocalDateTime(document.documentDate),
          fileName: document.fileName,
        }
        formData.append('metadata', JSON.stringify(metadata))

        // Add file if it exists
        if (document.file) {
          formData.append('file', document.file as FileType)
        }

        return {
          url: `/api/documents`,
          method: 'POST',
          params: {
            refId,
          },
          body: formData,
          // Don't set Content-Type header, browser will set it with boundary
          formData: true,
        }
      },
    }),

    // Delete document endpoint
    // DELETE /api/documents/{documentId}
    // Expected response: success 204
    deleteDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/api/documents/${documentId}`,
        method: 'DELETE',
      }),
    }),

    // Update document endpoint
    // PUT /api/documents/{documentId}
    updateDocument: builder.mutation<AttachmentFileType, UpdateDocumentRequest>({
      query: ({ document }) => {
        const formData = new FormData()

        // Add metadata as JSON string
        const metadata = {
          domain: document.domain,
          documentType: document.documentType,
          documentNo: document.documentNo,
          documentDate: formatToLocalDateTime(document.documentDate),
          fileName: document.fileName,
          refId: document.refId,
          id: document.id,
        }
        formData.append('metadata', JSON.stringify(metadata))

        // Add file if it exists
        if (document.file) {
          formData.append('file', document.file as FileType)
        }

        return {
          url: `/api/documents/${document.id}`,
          method: 'PUT',
          body: formData,
          // Don't set Content-Type header, browser will set it with boundary
          formData: true,
        }
      },
    }),
  }),
})

// Standalone download function to avoid RTK Query caching
export const downloadDocument = async (documentId: string, customToken?: string | null) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    // Use custom token if provided, otherwise fall back to keycloak token
    const token = customToken || keycloak.token
    const headers = new Headers()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    const response = await fetch(`${baseUrl}/api/documents/${documentId}/download`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    let fileName = 'download' // default filename

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
    console.error('Error downloading file:', error)
    throw error
  }
}

// Standalone preview function for document preview (separate from download)
export const previewDocument = async (
  documentId: string,
  signal?: AbortSignal,
  customToken?: string | null,
): Promise<{ blob: Blob; mimeType: string }> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    // Use custom token if provided, otherwise fall back to keycloak token
    const token = customToken || keycloak.token
    const headers = new Headers()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${baseUrl}/api/documents/${documentId}/download`, {
      method: 'GET',
      headers,
      signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get the blob and mime type for preview
    const blob = await response.blob()
    const mimeType = response.headers.get('content-type') || blob.type || 'application/octet-stream'

    return { blob, mimeType }
  } catch (error) {
    console.error('Error loading file for preview:', error)
    throw error
  }
}

// Export hooks for usage in functional components
export const { useDeleteDocumentMutation, useAddDocumentMutation, useUpdateDocumentMutation } =
  attachmentApi
