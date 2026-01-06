import { useGetApprovalRouteQuery } from 'api/approvalApi'
import { DocumentType } from 'api/approvalApi.types'
import useAuth from 'hooks/useAuth'

/**
 * Custom hook to fetch approval route data and determine if the current user can approve/reject
 */
export const useApprovalRoute = (
  selectedItem: { documentId: string; documentType: DocumentType; routeId: string } | null,
) => {
  const { user } = useAuth()

  // Approval route API call - fetch the approval route for the selected item
  const {
    data: approvalRoute,
    error: approvalRouteError,
    isFetching: approvalRouteLoading,
  } = useGetApprovalRouteQuery(
    {
      // If the API call is not skipped, we know these values exist
      documentId: selectedItem?.documentId || '',
      documentType: selectedItem?.documentType || 'PR',
      routeId: selectedItem?.routeId || '',
    },
    {
      // Skip the API call if any required values are missing
      skip: !selectedItem?.documentId || !selectedItem?.documentType || !selectedItem?.routeId,
    },
  )

  // Check if the current user can approve/reject based on the approval route
  // Conditions:
  // 1. There must be at least one active step
  // 2. The user's employeeId must match the activeApproverId of the active step
  const activeStep = approvalRoute?.approvalSteps?.find((step) => step.active)
  const canApproveReject = Boolean(
    !approvalRouteError && activeStep && user?.employeeId === activeStep.activeApproverId,
  )

  return {
    approvalRoute,
    approvalRouteError,
    approvalRouteLoading,
    canApproveReject,
  }
}

export default useApprovalRoute
