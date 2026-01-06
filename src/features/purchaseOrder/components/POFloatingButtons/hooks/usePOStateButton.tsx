import { PO_STATUS } from 'constants/index'

export type ButtonName =
  | 'save'
  | 'print'
  | 'delete'
  | 'submit'
  | 'reject'
  | 'approve'
  | 'cancel'
  | 'revise'
  | 'createGR'
  | 'approveCancel'
  | 'grHistory'
  | 'checkStatus'

type POStateButtonProps = {
  isPurchaser: boolean
  poStatus?: string
  approveStatus?: string | null
}

export const usePOStateButton = ({
  isPurchaser,
  poStatus,
  approveStatus,
}: POStateButtonProps): ButtonName[] => {
  if (!poStatus) return ['save']

  switch (poStatus) {
    case PO_STATUS.PO_DRAFT:
      if (isPurchaser) return ['save', 'delete', 'submit']
      return []

    case PO_STATUS.PO_WAITING_APPROVED:
      if (isPurchaser) return ['print', 'reject', 'approve', 'checkStatus']
      return ['checkStatus']

    case PO_STATUS.PO_RETURNED:
    case PO_STATUS.PO_REVISED:
      if (isPurchaser) return ['save', 'submit', 'cancel']
      return []

    case PO_STATUS.PO_APPROVED:
      if (isPurchaser) return ['revise', 'createGR', 'print', 'checkStatus']
      return ['print', 'checkStatus']

    case PO_STATUS.PO_CANCELING:
      if (isPurchaser) return ['cancel', 'approveCancel']
      return []

    case PO_STATUS.PO_CANCELED:
      // NOTE: กรณี PO_RETURNED
      // NOTE: ถ้าไม่มี approveStatus แปลว่าไม่มีการ approve cancel หมายความว่าถูก cancel มาจาก state PO_RETURNED ซึ่ง bypass การ approve cancelเพราะฉะนั้นไม่ต้องแสดงปุ่ม
      if (!approveStatus) {
        return ['cancel']
      }
      // NOTE: กรณี PO_REVISED
      return ['cancel', 'approveCancel']

    case PO_STATUS.GR_PENDING:
      return ['print', 'grHistory', 'checkStatus']

    case PO_STATUS.GR_COMPLETE:
      return ['print', 'grHistory', 'checkStatus']

    default:
      return []
  }
}
