import EditGRPage from 'features/goodReceive/EditGRPage'
import EditPOPage from 'features/purchaseOrder/pages/EditPOPage'
import EditPRPage from 'features/purchaseRequisition/pages/EditPRPage'

export const subRoutes = {
  prEdit: {
    path: '/purchase-requisition/:id/edit',
    permission: 'NPR002',
    element: <EditPRPage />,
  },
  poEdit: {
    path: '/purchase-order/:id/edit',
    permission: 'NPO002',
    element: <EditPOPage />,
  },
  grEdit: {
    path : '/good-receive/:id/edit',
    permission: 'GRC002',
    element: <EditGRPage />,
  },
}
