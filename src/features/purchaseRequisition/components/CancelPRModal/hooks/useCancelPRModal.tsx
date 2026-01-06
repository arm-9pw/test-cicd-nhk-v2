import { useEffect } from 'react'

import { useGetPurchaseLogByPrIdQuery } from 'api/purchaseLogApi'
import { useNotification } from 'hooks/useNotification'

import { PR_STATUS } from 'constants/index'

type Props = {
  prId: string
  domainStatus: string
}

const useCancelPRModal = ({ prId, domainStatus }: Props) => {
  const {
    data: cancelData,
    isLoading,
    isError,
    error,
  } = useGetPurchaseLogByPrIdQuery(prId, {
    skip: !prId || ![PR_STATUS.PR_CANCELED].includes(domainStatus),
  })
  const { openNotification } = useNotification()

  useEffect(() => {
    if (isError) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to get cancel data.',
      })
    }
  }, [isError, error, openNotification])

  return { cancelData, isLoading }
}

export default useCancelPRModal
