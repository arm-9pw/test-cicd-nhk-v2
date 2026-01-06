import { useCallback, useEffect, useRef, useState } from 'react'

import { downloadSignedDocument, previewSignedDocument } from 'api/approvalApi'
import { DocumentType } from 'api/approvalApi.types'
import { downloadDocument, previewDocument } from 'api/attachmentApi'
import { useNotification } from 'hooks/useNotification'

import { ActiveItemType, PreviewDataType } from '../../../types'

type UseDocumentHandlingParams = {
  selectedItem: { documentId: string; documentType: DocumentType } | null
  customToken?: string | null
}

// Define the type for download parameters
type DownloadParams = {
  itemId: string
  itemType?: 'main' | 'attachment'
  documentType?: DocumentType
}

// Default state values for reset operations - defined outside component to avoid recreation
const DEFAULT_PREVIEW_DATA: PreviewDataType = {
  type: null,
  url: null,
  isLoading: false,
  error: null,
}

const DEFAULT_ACTIVE_ITEM: ActiveItemType = {
  id: 'main_document_id',
  type: 'main',
}

/**
 * Custom hook to handle document interactions like clicking and downloading
 */
export const useDocumentHandling = ({ selectedItem, customToken }: UseDocumentHandlingParams) => {
  // Get notification function from context
  const { openNotification } = useNotification()
  // Active item state - tracks which item is currently active
  // Default to main document being active
  const [activeItem, setActiveItem] = useState<ActiveItemType | null>({
    id: 'main_document_id',
    type: 'main',
  })

  // Preview state management
  const [previewData, setPreviewData] = useState<PreviewDataType>({
    type: null,
    url: null,
    isLoading: false,
    error: null,
  })

  // Download loading state
  const [isDownloadLoading, setIsDownloadLoading] = useState(false)

  const [currentDocumentType, setCurrentDocumentType] = useState<DocumentType>(
    selectedItem?.documentType || 'PR',
  )
  const [currentDocumentId, setCurrentDocumentId] = useState<string>(selectedItem?.documentId || '')

  // Keep track of current blob URL for cleanup
  const currentBlobUrlRef = useRef<string | null>(null)

  // Keep track of current preview abort controller
  const previewAbortControllerRef = useRef<AbortController | null>(null)

  /**
   * Single comprehensive cleanup function that handles all reset operations
   * Using useCallback with empty deps to ensure it's stable across renders
   */
  const cleanup = useCallback(() => {
    // 1. Abort any ongoing preview request
    if (previewAbortControllerRef.current) {
      previewAbortControllerRef.current.abort()
      previewAbortControllerRef.current = null
    }

    // 2. Release blob URL resources
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }

    // 3. Reset preview data state
    setPreviewData(DEFAULT_PREVIEW_DATA)

    // 4. Reset active item state
    setActiveItem(DEFAULT_ACTIVE_ITEM)
  }, [])

  // Cleanup on unmount using a stable reference
  // We use a ref to avoid dependency issues with the cleanup function
  const cleanupRef = useRef(cleanup)

  // Update ref when cleanup changes
  useEffect(() => {
    cleanupRef.current = cleanup
  }, [cleanup])

  // Use the ref in the cleanup effect
  useEffect(() => {
    return () => cleanupRef.current()
  }, [])

  // Function to set the preview state for main document
  const handleMainDocumentPreview = useCallback(
    async (documentId: string, documentType: DocumentType) => {
      if (!selectedItem) {
        setPreviewData({
          type: null,
          url: null,
          isLoading: false,
          error: 'No document selected for preview',
        })
        return
      }

      // Abort any ongoing preview request
      if (previewAbortControllerRef.current) {
        previewAbortControllerRef.current.abort()
      }

      // Create new abort controller for this request
      const abortController = new AbortController()
      previewAbortControllerRef.current = abortController

      // Clean up any existing blob URL
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
        currentBlobUrlRef.current = null
      }

      // Set loading state
      setPreviewData({
        type: 'pdf',
        url: null,
        isLoading: true,
        error: null,
      })

      try {
        const previewDocumentType: DocumentType =
          documentType === 'RECEIVE_PR' ? 'PR' : documentType

        const { blob } = await previewSignedDocument(
          previewDocumentType,
          documentId,
          abortController.signal,
          customToken,
        )

        // Check if this request was aborted
        if (abortController.signal.aborted) {
          return
        }

        const url = URL.createObjectURL(blob)
        currentBlobUrlRef.current = url

        setPreviewData({
          type: 'pdf',
          url,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        // Don't show error if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Preview request was cancelled')
          return
        }

        console.error('Failed to load main document preview:', error)
        setPreviewData({
          type: null,
          url: null,
          isLoading: false,
          error: 'Failed to load main document preview',
        })

        openNotification({
          type: 'error',
          title: 'Preview Failed',
          description: 'Unable to load the main document preview. Please try again later.',
        })
      }
    },
    [openNotification, selectedItem, customToken],
  )

  // Handle attachment preview
  const handleAttachmentPreview = async (documentId: string) => {
    // Abort any ongoing preview request
    if (previewAbortControllerRef.current) {
      previewAbortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    const abortController = new AbortController()
    previewAbortControllerRef.current = abortController

    try {
      // Clean up previous blob URL BEFORE creating new one
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
        currentBlobUrlRef.current = null
      }

      setPreviewData((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }))

      // Use the standalone preview function with abort signal
      const { blob, mimeType } = await previewDocument(documentId, abortController.signal, customToken)

      // Check if this request was aborted
      if (abortController.signal.aborted) {
        return
      }

      // Create blob URL for preview
      const url = URL.createObjectURL(blob)

      // Store the URL for cleanup
      currentBlobUrlRef.current = url

      // Determine preview type based on mime type
      const previewType = mimeType.startsWith('image/') ? 'image' : 'pdf'

      setPreviewData({
        type: previewType,
        url: url,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      // Don't show error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Preview request was cancelled')
        return
      }

      console.error('Failed to load attachment preview:', error)
      // Also cleanup on error
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
        currentBlobUrlRef.current = null
      }
      setPreviewData({
        type: null,
        url: null,
        isLoading: false,
        error: 'Failed to load preview',
      })
    }
  }

  const handleItemClick = async (
    itemId: string,
    itemType: 'main' | 'attachment',
    documentType: DocumentType,
  ) => {
    // If clicking the same item, DON'T deactivate it - just keep it active
    if (activeItem?.id === itemId && activeItem?.type === itemType) {
      return
    }

    if (itemType === 'main') {
      setCurrentDocumentType(documentType)
      setCurrentDocumentId(itemId)
    }

    // Set new active item
    setActiveItem({ id: itemId, type: itemType })

    // Handle preview based on item type
    if (itemType === 'main') {
      // Show main document PDF preview with loading overlay
      await handleMainDocumentPreview(itemId, documentType)
    } else if (itemType === 'attachment') {
      // Download and preview attachment using the hook
      await handleAttachmentPreview(itemId)
    }
  }

  // Handle attachment download
  const handleAttachmentDownload = async (documentId: string) => {
    setIsDownloadLoading(true)

    try {
      await downloadDocument(documentId, customToken)
    } catch (error) {
      console.error('Error downloading attachment:', error)

      // Show error notification to the user
      openNotification({
        type: 'error',
        title: 'Download Failed',
        description: 'There was a problem downloading the attachment. Please try again later.',
      })
    } finally {
      setIsDownloadLoading(false)
    }
  }

  // Handle main document download based on document type
  const handleMainDocumentDownload = async (documentType: DocumentType, documentId: string) => {
    setIsDownloadLoading(true)

    try {
      const resolvedDocumentType: DocumentType = documentType === 'RECEIVE_PR' ? 'PR' : documentType

      await downloadSignedDocument(resolvedDocumentType, documentId, customToken)
    } catch (error) {
      console.error('Error downloading document:', error)

      openNotification({
        type: 'error',
        title: 'Download Failed',
        description: 'There was a problem downloading the document. Please try again later.',
      })
    } finally {
      setIsDownloadLoading(false)
    }
  }

  // Combined download handler that determines what to download based on item type
  const handleDownload = (params: DownloadParams) => {
    const { itemId, itemType = 'attachment', documentType } = params

    if (itemType === 'main' && documentType) {
      handleMainDocumentDownload(documentType, itemId)
    } else {
      // For attachments, use the attachment download function
      handleAttachmentDownload(itemId)
    }
  }

  useEffect(() => {
    if (!selectedItem) {
      cleanup()
      return
    }

    setActiveItem(DEFAULT_ACTIVE_ITEM)
    handleMainDocumentPreview(currentDocumentId, currentDocumentType)
  }, [cleanup, handleMainDocumentPreview, selectedItem, currentDocumentType, currentDocumentId])

  return {
    // State
    activeItem,
    previewData,
    currentDocumentType,
    currentDocumentId,
    isDownloadLoading,

    // Item interaction handlers
    handleItemClick,
    handleDownload,

    // Document preview handlers
    handleMainDocumentPreview,
    handleAttachmentPreview,

    // Download handlers
    handleMainDocumentDownload,
    handleAttachmentDownload,

    // Cleanup function
    cleanup,
  }
}

export default useDocumentHandling
