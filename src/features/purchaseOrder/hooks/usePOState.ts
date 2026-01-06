import { useAppSelector } from 'app/hook'

import { selectUser } from 'features/auth/authSlice'

import { PO_STATUS } from 'constants/index'

type Props = {
  purchaseStatus?: string
  purchaserId?: string
}

const usePOState = ({ purchaseStatus, purchaserId }: Props) => {
  const user = useAppSelector(selectUser)
  const isPurchaser = user?.employeeId === purchaserId

  // If there is no purchase status, meaning it's a new PO, enable all form fields
  if (!purchaseStatus) {
    return { isDisabledAllForm: false }
  }

  // If user is a purchaser, enable form only for certain statuses
  if (isPurchaser) {
    const editableStatuses = [PO_STATUS.PO_DRAFT, PO_STATUS.PO_RETURNED, PO_STATUS.PO_REVISED]
    return { isDisabledAllForm: !editableStatuses.includes(purchaseStatus) }
  }

  // If user is not a purchaser, disable all form fields
  return { isDisabledAllForm: true }
}

export default usePOState
