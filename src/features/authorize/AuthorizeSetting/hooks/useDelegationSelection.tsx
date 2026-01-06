import { useState } from 'react'

import { useGetDelegationQuery } from 'api/delegationApi'
import { DelegationType } from 'api/delegationApi.types'

interface UseDelegationSelectionProps {
  onAuthorizationModalShow: () => void
  onAuthorizationModalCancel: () => void
}

export const useDelegationSelection = ({ onAuthorizationModalShow, onAuthorizationModalCancel }: UseDelegationSelectionProps) => {
  const [selectedDelegationId, setSelectedDelegationId] = useState<string | null>(null)

  // Fetch delegation details when a row is clicked
  const { data: selectedDelegation, isFetching: isFetchingDelegation } = useGetDelegationQuery(
    selectedDelegationId!,
    {
      skip: !selectedDelegationId,
    },
  )

  const handleRowClickForAuthorizationModal = (record: DelegationType) => {
    setSelectedDelegationId(record.id)
    onAuthorizationModalShow()
  }

  const handleAuthorizationModalClose = () => {
    setSelectedDelegationId(null)
    onAuthorizationModalCancel()
  }

  return {
    selectedDelegationId,
    selectedDelegation,
    isFetchingDelegation,
    handleRowClickForAuthorizationModal,
    handleAuthorizationModalClose,
  }
}
