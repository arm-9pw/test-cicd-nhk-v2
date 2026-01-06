import { useMemo } from 'react'

import { DocumentType } from 'api/approvalApi.types'
import { useGetPoByIdQuery } from 'api/poApi'
import { useGetPrByIdQuery, useGetPrByPoIdQuery } from 'api/prApi'

/**
 * Custom hook to fetch document data based on document type
 * Consolidates PR and PO API calls and provides a unified interface
 */
export const useDocumentData = (
  selectedItem: { documentId: string; documentType: DocumentType } | null,
) => {
  // PR API call - only when document type is PR and documentId exists
  const {
    data: prData,
    error: prError,
    isFetching: prLoading,
  } = useGetPrByIdQuery(
    // If not skipped, we know documentId exists
    selectedItem?.documentId || '',
    {
      // Skip if documentId is missing or documentType is not PR
      skip: !selectedItem?.documentId || !['PR', 'RECEIVE_PR'].includes(selectedItem?.documentType),
    },
  )

  // PO API call - only when document type is PO and documentId exists
  const {
    data: poData,
    error: poError,
    isLoading: poLoading,
  } = useGetPoByIdQuery(selectedItem?.documentId || '', {
    skip: !selectedItem?.documentId || selectedItem?.documentType !== 'PO',
  })

  const shouldFetchPrFromPo =
    !!selectedItem?.documentId && selectedItem?.documentType === 'PO' && poData?.isReferPr

  const {
    data: prDataFromPo,
    error: prFromPoError,
    isFetching: prFromPoLoading,
  } = useGetPrByPoIdQuery(selectedItem?.documentId || '', {
    skip: !shouldFetchPrFromPo,
  })

  // Determine which data to use and loading/error states based on document type
  // Use useMemo to avoid unnecessary recalculations
  const documentState = useMemo(() => {
    if (!selectedItem) {
      return {
        documentData: null,
        isLoading: false,
        error: null,
      }
    }

    switch (selectedItem.documentType) {
      case 'RECEIVE_PR':
      case 'PR':
        return {
          documentData: prData,
          isLoading: prLoading,
          error: prError,
        }
      case 'PO':
        return {
          documentData: poData,
          isLoading: poLoading || prFromPoLoading,
          error: poError || prFromPoError,
        }
      default:
        return {
          documentData: null,
          isLoading: false,
          error: null,
        }
    }
  }, [
    selectedItem,
    prData,
    prLoading,
    prError,
    poData,
    poLoading,
    poError,
    prFromPoLoading,
    prFromPoError,
  ])

  return { ...documentState, prDataFromPo }
}

export default useDocumentData
