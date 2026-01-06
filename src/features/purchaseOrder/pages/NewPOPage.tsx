import { PAGE_MODE } from 'constants/index'

import PurchaseOrderPage from '../PurchaseOrderPage'

const NewPOPage = () => {
  return <PurchaseOrderPage mode={PAGE_MODE.CREATE} />
}

export default NewPOPage
