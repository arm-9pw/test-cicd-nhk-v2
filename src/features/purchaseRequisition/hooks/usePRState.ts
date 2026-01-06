import { useAppSelector } from 'app/hook'

import { selectUser } from 'features/auth/authSlice'

import { PR_STATUS } from 'constants/index'

type Props = {
  purchaseStatus?: string
  requesterId?: string
}

const usePRState = ({ purchaseStatus, requesterId }: Props) => {
  const user = useAppSelector(selectUser)
  const isRequester = user?.employeeId === requesterId

  // If there is no purchase status, meaning it's a new PR, enable all form fields
  if (!purchaseStatus) {
    return { isDisabledAllForm: false }
  }

  // If user is the requester, enable form only for certain statuses
  if (isRequester) {
    const editableStatuses = [PR_STATUS.PR_DRAFT, PR_STATUS.PR_RETURNED, PR_STATUS.PR_REVISED]
    return {
      isDisabledAllForm: !editableStatuses.includes(purchaseStatus),
    }
  }

  // If user is a purchaser or other requester, always disable
  return { isDisabledAllForm: true }
}

export default usePRState
