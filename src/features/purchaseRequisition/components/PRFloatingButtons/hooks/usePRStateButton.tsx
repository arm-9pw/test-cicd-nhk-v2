import { PR_STATUS } from 'constants/index'

export type ButtonName =
  | 'save'
  | 'print'
  | 'delete'
  | 'submit'
  | 'reject'
  | 'approve'
  | 'cancel'
  | 'transfer'
  | 'revise'
  | 'receive'
  | 'createPO'
  | 'checkStatus'

type PrStateButtonProps = {
  prStatus?: string
  isRequester?: boolean
  isPurchaser?: boolean
  isOtherRequester?: boolean
  isPurchaserWithSameDepartment?: boolean
}

export const usePRStateButton = ({
  prStatus,
  isRequester,
  // isPurchaser,
  isOtherRequester,
  isPurchaserWithSameDepartment,
}: PrStateButtonProps): ButtonName[] => {
  if (!prStatus) return ['save']

  switch (prStatus) {
    case PR_STATUS.PR_DRAFT:
      if (isRequester) return ['save', 'delete', 'submit']
      return []

    case PR_STATUS.PR_WAITING_APPROVED:
      if (isRequester) return ['checkStatus', 'print']
      if (isOtherRequester) return ['checkStatus', 'print']
      return []

    case PR_STATUS.PR_RETURNED:
    case PR_STATUS.PR_REVISED:
      if (isRequester) return ['save', 'submit', 'cancel']
      return []

    case PR_STATUS.PR_APPROVED:
      if (isPurchaserWithSameDepartment) return ['print', 'revise', 'transfer', 'receive']
      return ['checkStatus', 'print']

    case PR_STATUS.RECEIVING_PR:
      if (isRequester) return ['checkStatus', 'print']
      if (isOtherRequester) return ['checkStatus', 'print']
      return ['checkStatus', 'print', 'transfer']

    case PR_STATUS.PR_WAITING_PO:
      if (isPurchaserWithSameDepartment) return ['print', 'revise', 'transfer']
      return ['print', 'checkStatus']

    case PR_STATUS.PR_CANCELED:
      return ['cancel']

    case PR_STATUS.PR_DELETE:
      return []

    case PR_STATUS.PO_DRAFT:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.PO_WAITING_APPROVED:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.PO_APPROVED:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.PO_RETURNED:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.PO_REVISED:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.PO_CANCELED:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.PO_CANCELING:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.GR_PENDING:
      if (isPurchaserWithSameDepartment) return ['print', 'transfer', 'checkStatus']
      return ['print', 'checkStatus']

    case PR_STATUS.GR_COMPLETE:
      return ['print', 'checkStatus']

    default:
      return []
  }
}
