import { DOMAINS } from 'constants/index'

export const getRedirectUrl = ({ id, domain }: { id: string; domain: string }) => {
  switch (domain) {
    case DOMAINS.PURCHASE_ORDER:
      return `/purchase-order/${id}/edit`
    case DOMAINS.PURCHASE_REQUISITION:
      return `/purchase-requisition/${id}/edit`
    case DOMAINS.GOOD_RECEIVE:
      return `/good-receive/${id}/edit`
    default:
      return ''
  }
}
