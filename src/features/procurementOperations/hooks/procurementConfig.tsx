import {
  CheckOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'

import { ProcurementContext, StatusBoxConfig } from 'api/procurementApi.types'

export const STATUS_CONFIGS: Record<ProcurementContext, StatusBoxConfig[]> = {
  PURCHASER: [
    {
      status: 'PUR_PR_APPROVED',
      text: 'PR. Approved (Waiting PUR.)',
      color: 'red',
      icon: <FileTextOutlined />,
      count: 0,
    },
    {
      status: 'PUR_PO_PENDING',
      text: 'PO. Pending',
      color: 'blue',
      icon: <ShoppingCartOutlined />,
      count: 0,
    },
    {
      status: 'PUR_PO_WAIT_APPROVED',
      text: 'PO. Waiting Apr.',
      color: 'purple',
      icon: <FileDoneOutlined />,
      count: 0,
    },
    {
      status: 'PUR_PO_APPROVED',
      text: 'PO. Approved',
      color: 'green',
      icon: <CheckOutlined />,
      count: 0,
    },
    {
      status: 'PUR_GR_COMPLETE_CANCEL',
      text: 'GR. Completed / Cancel',
      color: 'yellow',
      icon: <CheckOutlined />,
      count: 0,
    },
  ],
  REQUESTER: [
    {
      status: 'REQ_PR_PENDING',
      text: 'PR. Pending',
      color: 'red',
      icon: <FileTextOutlined />,
      count: 0,
    },
    {
      status: 'REQ_PR_APPROVED',
      text: 'PR. Approved (Waiting PUR.)',
      color: 'blue',
      icon: <ShoppingCartOutlined />,
      count: 0,
    },
    {
      status: 'REQ_PO_PENDING',
      text: 'PO. Pending',
      color: 'purple',
      icon: <FileDoneOutlined />,
      count: 0,
    },
    {
      status: 'REQ_PO_APPROVED',
      text: 'PO. Approved',
      color: 'green',
      icon: <CheckOutlined />,
      count: 0,
    },
    {
      status: 'REQ_GR_COMPLETE_CANCEL',
      text: 'GR. Completed / Cancel',
      color: 'yellow',
      icon: <CheckOutlined />,
      count: 0,
    },
  ],
}
