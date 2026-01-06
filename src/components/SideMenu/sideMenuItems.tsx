import { ReactNode } from 'react'

import {
  BankOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  ContactsOutlined,
  ContainerOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FolderOpenOutlined,
  FundOutlined,
  ProductOutlined,
  ReconciliationOutlined, // SafetyOutlined,
  ScheduleOutlined,
  SendOutlined,
  ShopOutlined,
  SnippetsOutlined,
  TeamOutlined,
  TruckOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { menuRoutes } from 'routes/menuRoutes'

export type TSideMenuItem = {
  key: string
  icon: ReactNode
  label: string
  permission?: string
  children?: TSideMenuItem[] // Optional for items that don't have children
}

export const sideMenuItems: TSideMenuItem[] = [
  // {
  //   label: 'Dashboard',
  //   key: menuRoutes.dashboard.path,
  //   permission: menuRoutes.dashboard.permission,
  //   icon: <PieChartOutlined />,
  // },
  {
    label: 'Purchase Requisition',
    key: menuRoutes.purchaseRequisition.path,
    permission: menuRoutes.purchaseRequisition.permission,
    icon: <ContainerOutlined />,
  },
  {
    label: 'Purchase Order',
    key: menuRoutes.purchaseOrder.path,
    permission: menuRoutes.purchaseOrder.permission,
    icon: <SnippetsOutlined />,
  },
  {
    label: 'Goods Receive',
    key: menuRoutes.goodReceive.path,
    permission: menuRoutes.goodReceive.permission,
    icon: <FileDoneOutlined />,
  },
  {
    label: 'Requester Operations',
    key: menuRoutes.requesterOperationsRequester.path,
    permission: menuRoutes.requesterOperationsRequester.permission,
    icon: <UnorderedListOutlined />,
  },
  {
    label: 'Purchaser Operations',
    key: menuRoutes.purchaserOperationsPurchaser.path,
    permission: menuRoutes.purchaserOperationsPurchaser.permission,
    icon: <UnorderedListOutlined />,
  },
  {
    label: 'PR. Enquiry',
    key: menuRoutes.purchaseRequisitionEnquiry.path,
    permission: menuRoutes.purchaseRequisitionEnquiry.permission,
    icon: <FolderOpenOutlined />,
  },
  {
    label: 'PO. Enquiry',
    key: menuRoutes.purchaseOrderEnquiry.path,
    permission: menuRoutes.purchaseOrderEnquiry.permission,
    icon: <FolderOpenOutlined />,
  },
  {
    label: 'Budget Enquiry',
    key: menuRoutes.budgetEnquiry.path,
    permission: menuRoutes.budgetEnquiry.permission,
    icon: <FolderOpenOutlined />,
  },
  {
    label: 'Authorize Setting',
    key: menuRoutes.authorizeSetting.path,
    permission: menuRoutes.authorizeSetting.permission,
    icon: <ProductOutlined />,
  },
  {
    label: 'My Approvals',
    key: menuRoutes.myApprovals.path,
    permission: menuRoutes.myApprovals.permission,
    icon: <FileProtectOutlined />,
  },
  {
    label: 'Reports',
    key: '/reports',
    icon: <BarChartOutlined />,
    children: [
      {
        label: 'Follow-up Report',
        key: menuRoutes.followUpReport.path,
        permission: menuRoutes.followUpReport.permission,
        icon: <ScheduleOutlined />,
      },
      {
        label: 'Budget Report',
        key: menuRoutes.budgetReport.path,
        permission: menuRoutes.budgetReport.permission,
        icon: <FundOutlined />,
      },
      {
        label: 'Invoice Summary',
        key: menuRoutes.invoiceSummaryReport.path,
        permission: menuRoutes.invoiceSummaryReport.permission,
        icon: <ReconciliationOutlined />,
      },
    ],
  },

  {
    label: 'Administration',
    key: '/administration',
    icon: <ContactsOutlined />,
    children: [
      {
        label: 'User Management',
        key: menuRoutes.userManagement.path,
        permission: menuRoutes.userManagement.permission,
        icon: <TeamOutlined />,
      },
      {
        label: 'Budget Management',
        key: menuRoutes.budgetManagement.path,
        permission: menuRoutes.budgetManagement.permission,
        icon: <CalculatorOutlined />,
      },
      {
        label: 'Allocate Management',
        key: menuRoutes.allocateManagement.path,
        permission: menuRoutes.allocateManagement.permission,
        icon: <ContainerOutlined />,
      },
      {
        label: 'Supplier Management',
        key: menuRoutes.supplierManagement.path,
        permission: menuRoutes.supplierManagement.permission,
        icon: <ShopOutlined />,
      },
      {
        label: 'Site Management',
        key: menuRoutes.siteManagement.path,
        permission: menuRoutes.siteManagement.permission,
        icon: <TruckOutlined />,
      },
      {
        label: 'Item Management',
        key: menuRoutes.itemManagement.path,
        permission: menuRoutes.itemManagement.permission,
        icon: <ProductOutlined />,
      },
      {
        label: 'Workflow Management',
        key: menuRoutes.workflowManagement.path,
        permission: menuRoutes.workflowManagement.permission,
        icon: <SendOutlined />,
      },
    ],
  },

  // {
  //   label: 'Approvals',
  //   key: '/approvals',
  //   icon: <SafetyOutlined />,
  //   children: [
  //     {
  //       label: 'My Approvals',
  //       key: menuRoutes.myApprovals.path,
  //       permission: menuRoutes.myApprovals.permission,
  //       icon: <FileProtectOutlined />,
  //     },
  //   ],
  // },

  {
    label: 'Import Data',
    key: '/import-data',
    icon: <FileProtectOutlined />,
    children: [
      {
        label: 'Import Budget',
        key: menuRoutes.importBudget.path,
        permission: menuRoutes.importBudget.permission,
        icon: <DollarOutlined />,
      },
      {
        label: 'Import Supplier',
        key: menuRoutes.importSupplier.path,
        permission: menuRoutes.importSupplier.permission,
        icon: <ShopOutlined />,
      },
      {
        label: 'Import Employee',
        key: menuRoutes.importEmployee.path,
        permission: menuRoutes.importEmployee.permission,
        icon: <UserOutlined />,
      },
      {
        label: 'Import Organization Unit',
        key: menuRoutes.importOrganizationUnit.path,
        permission: menuRoutes.importOrganizationUnit.permission,
        icon: <BankOutlined />,
      },
    ],
  },
]
