interface UseAuthorizationModalActionsProps {
  onCancelDelegation?: () => void
  onExtendDelegation?: () => void
  onDeleteDelegation?: () => void
}

export const useAuthorizationModalActions = ({
  onCancelDelegation,
  onExtendDelegation,
  onDeleteDelegation,
}: UseAuthorizationModalActionsProps) => {
  const handleCancelAuthorization = () => {
    if (onCancelDelegation) {
      onCancelDelegation()
    }
  }

  const handleExtendAuthorization = () => {
    if (onExtendDelegation) {
      onExtendDelegation()
    }
  }

  const handleDeleteDelegation = () => {
    if (onDeleteDelegation) {
      onDeleteDelegation()
    }
  }

  return {
    handleCancelAuthorization,
    handleExtendAuthorization,
    handleDeleteDelegation,
  }
}
