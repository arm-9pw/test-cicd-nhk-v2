import { PAGE_MODE } from 'constants/index'

import PurchaseRequisitionPage from '../PurchaseRequisitionPage'

const NewPRPage = () => {
  return <PurchaseRequisitionPage mode={PAGE_MODE.CREATE} />
}

export default NewPRPage
