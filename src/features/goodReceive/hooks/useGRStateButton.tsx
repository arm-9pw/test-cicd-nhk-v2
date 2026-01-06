import { GR_STATUS } from 'constants/index'

export type ButtonName = 'save' | 'clear' | 'grHistory' | 'delete'

type GRStateButtonProps = {
  isRequester: boolean
  isSameDepartment: boolean
  grStatus?: string
}

export const useGRStateButton = ({
  isRequester,
  isSameDepartment,
  grStatus,
}: GRStateButtonProps): ButtonName[] => {
  if (!grStatus) return ['save', 'grHistory']

  switch (grStatus) {
    case GR_STATUS.GR_PENDING:
      if (isRequester) return ['save', 'clear', 'grHistory', 'delete']
      if (isSameDepartment) return ['save', 'clear', 'grHistory', 'delete']
      return ['grHistory']

    case GR_STATUS.GR_COMPLETE:
      if (isRequester) return ['save', 'clear', 'grHistory', 'delete']
      if (isSameDepartment) return ['save', 'clear', 'grHistory', 'delete']
      return ['grHistory']

    default:
      return ['grHistory']
  }
}
