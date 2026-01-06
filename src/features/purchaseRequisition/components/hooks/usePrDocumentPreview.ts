import { useCallback, useEffect, useRef, useState } from 'react'

import { previewSignedDocument } from 'api/approvalApi'
import { DocumentType } from 'api/approvalApi.types'
import { useNotification } from 'hooks/useNotification'

type PreviewState = {
  type: 'pdf' | null
  url: string | null
  isLoading: boolean
  error: string | null
}

type UsePrDocumentPreviewParams = {
  open: boolean
  documentId?: string | null
}

const DEFAULT_STATE: PreviewState = {
  type: null,
  url: null,
  isLoading: false,
  error: null,
}

export const usePrDocumentPreview = ({ open, documentId }: UsePrDocumentPreviewParams) => {
  const { openNotification } = useNotification()
  const [previewState, setPreviewState] = useState<PreviewState>(DEFAULT_STATE)
  const currentBlobUrlRef = useRef<string | null>(null)

  const cleanup = useCallback(() => {
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

    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }

    setPreviewState({
      type: 'pdf',
      url: null,
      isLoading: true,
      error: null,
    })

    try {
      const resolvedType: DocumentType = 'PR'
      const { blob } = await previewSignedDocument(resolvedType, documentId)
      const url = URL.createObjectURL(blob)
      currentBlobUrlRef.current = url

      setPreviewState({
        type: 'pdf',
        url,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Failed to load PR preview:', error)
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
  }, [cleanup, documentId, openNotification])

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
