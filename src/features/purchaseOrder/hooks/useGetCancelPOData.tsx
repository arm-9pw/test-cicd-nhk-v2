import { useEffect } from 'react'

import { useGetPurchaseLogByPoIdQuery } from 'api/purchaseLogApi'
import { useNotification } from 'hooks/useNotification'

import { PO_STATUS } from 'constants/index'

type Props = {
  poId?: string
  domainStatus?: string
}

const useGetCancelPOData = ({ poId, domainStatus }: Props) => {
  const {
    data: cancelData,
    isLoading,
    isError,
    error,
  } = useGetPurchaseLogByPoIdQuery(poId || '', {
    skip: !poId || ![PO_STATUS.PO_CANCELING, PO_STATUS.PO_CANCELED].includes(domainStatus || ''),
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

export default useGetCancelPOData
