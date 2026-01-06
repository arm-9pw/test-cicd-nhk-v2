import { useCallback, useEffect, useRef, useState } from 'react'

import { previewSignedPO, previewPOBudget } from 'api/approvalApi'
import { useNotification } from 'hooks/useNotification'

type PreviewType = 'signed-po' | 'po-budget'

type PreviewState = {
  type: 'pdf' | null
  url: string | null
  isLoading: boolean
  error: string | null
}

type UsePoDocumentPreviewParams = {
  open: boolean
  documentId?: string | null
  previewType: PreviewType
}

const DEFAULT_STATE: PreviewState = {
  type: null,
  url: null,
  isLoading: false,
  error: null,
}

export const usePoDocumentPreview = ({ 
  open, 
  documentId, 
  previewType 
}: UsePoDocumentPreviewParams) => {
  const { openNotification } = useNotification()
  const [previewState, setPreviewState] = useState<PreviewState>(DEFAULT_STATE)
  const currentBlobUrlRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const cleanup = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    // Revoke blob URL
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }
    
    setPreviewState(DEFAULT_STATE)
  }, [])

  const loadPreview = useCallback(async () => {
    if (!documentId) {
      setPreviewState({
        type: null,
        url: null,
        isLoading: false,
        error: 'ยังไม่มีเอกสารสำหรับพรีวิว',
      })
      return
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Revoke previous blob URL if exists
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setPreviewState({
      type: 'pdf',
      url: null,
      isLoading: true,
      error: null,
    })

    try {
      // Call the appropriate API function based on previewType
      const { blob } = previewType === 'signed-po' 
        ? await previewSignedPO(documentId, abortController.signal)
        : await previewPOBudget(documentId, abortController.signal)
      
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return
      }

      const url = URL.createObjectURL(blob)
      currentBlobUrlRef.current = url

      setPreviewState({
        type: 'pdf',
        url,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      // Don't show error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      console.error('Failed to load PO preview:', error)
      cleanup()
      setPreviewState({
        type: null,
        url: null,
        isLoading: false,
        error: 'ไม่สามารถโหลดเอกสารได้ในขณะนี้',
      })
      openNotification({
        type: 'error',
        title: 'Preview Failed',
        description: 'ไม่สามารถโหลดเอกสารได้ กรุณาลองใหม่อีกครั้ง',
      })
    }
  }, [cleanup, documentId, previewType, openNotification])

  useEffect(() => {
    if (open) {
      void loadPreview()
    } else {
      cleanup()
    }
  }, [cleanup, loadPreview, open])

  useEffect(() => () => cleanup(), [cleanup])

  return {
    previewState,
    reload: loadPreview,
  }
}
