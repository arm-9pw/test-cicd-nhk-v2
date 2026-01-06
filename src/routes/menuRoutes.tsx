import AllocateManagementPage from 'features/allocateManagement/AllocateManagementPage'
import MyApprovalsPage from 'features/approvals/MyApprovals/MyApprovalsPage'
import AuthorizeSettingPage from 'features/authorize/AuthorizeSetting/AuthorizeSettingPage'
// import ButgetEnquiryPage from 'features/budgetEnquiry/ButgetEnquiryPage' // FIXME: (MAY) ไม่ได้ใช้แล้วหรอ ?
import BudgetManagementPage from 'features/budgetManagement/BudgetManagementPage'
import DashboardPage from 'features/dashboard/DashboardPage'
import NewGRPage from 'features/goodReceive/NewGRPage'

import BudgetEnquiryPage from 'features/budgetEnquiry/BudgetEnquiryPage'
import ItemManagementPage from 'features/itemManagement/ItemManagementPage'
import ProcurementOperationsPage from 'features/procurementOperations/ProcurementOperationsPage'
import NewPOPage from 'features/purchaseOrder/pages/NewPOPage'
import PurchaseOrderEnquiryPage from 'features/purchaseOrdersEnquiry/PurchaseOrderEnquiryPage'
import NewPRPage from 'features/purchaseRequisition/pages/NewPRPage'
import PurchaseRequisitionEnquiryPage from 'features/purchaseRequisitionsEnquiry/PurchaseRequisitionEnquiryPage'
import BudgetReport from 'features/reports/BudgetReport'
import FollowUpReport from 'features/reports/FollowUpReport'
import InvoiceSummaryReport from 'features/reports/InvoiceSummaryReport'
import SiteManagementPage from 'features/siteManagement/SiteManagementPage'
import SupplierManagementPage from 'features/supplierManagement/SupplierManagementPage'
import UserManagementPage from 'features/userManagement/UserManagementPage'
import WorkflowManagementPage from 'features/workflowManagement/WorkflowManagementPage'
import ImportDataPage from 'features/importData/ImportDataPage'

export const menuRoutes = {
  dashboard: {
    path: '/dashboard',
    permission: 'DAS001',
    element: <DashboardPage />,
  },
  purchaseRequisition: {
    path: '/purchase-requisition',
    permission: 'NPR001',
    element: <NewPRPage />,
  },
  purchaseOrder: {
    path: '/purchase-order',
    permission: 'NPO001',
    element: <NewPOPage />,
  },
  goodReceive: {
    path: '/good-receive',
    permission: 'GRC001',
    element: <NewGRPage />,
  },
  requesterOperationsRequester: {
    path: '/procurement-operations-requester',
    permission: 'ROP001',
    element: <ProcurementOperationsPage defaultContext="REQUESTER" />,
  },
  purchaserOperationsPurchaser: {
    path: '/procurement-operations-purchaser',
    permission: 'POP001',
    element: <ProcurementOperationsPage defaultContext="PURCHASER" />,
  },
  purchaseRequisitionEnquiry: {
    path: '/purchase-requisition-enquiry',
    permission: 'PRE001',
    element: <PurchaseRequisitionEnquiryPage />,
  },
  purchaseOrderEnquiry: {
    path: '/purchase-order-enquiry',
    permission: 'POE001',
    element: <PurchaseOrderEnquiryPage />,
  },
  // budgetEnquiry: {
  //   path: '/budget-enquiry',
  //   permission: 'BE0001',
  //   element: <ButgetEnquiryPage />,
  // },
  userManagement: {
    path: '/administration/user-management',
    permission: 'AUM001',
    element: <UserManagementPage />,
  },
  budgetManagement: {
    path: '/administration/budget-management',
    permission: 'ABG001',
    element: <BudgetManagementPage />,
  },
  allocateManagement: {
    path: '/administration/allocate-management',
    permission: 'AAC001',
    element: <AllocateManagementPage />,
  },
  supplierManagement: {
    path: '/administration/supplier-management',
    permission: 'ASM002',
    element: <SupplierManagementPage />,
  },
  followUpReport: {
    path: '/reports/follow-up-report',
    permission: 'RFR001',
    element: <FollowUpReport />,
  },
  budgetReport: {
    path: '/reports/budget-report',
    permission: 'RBR001',
    element: <BudgetReport />,
  },
  invoiceSummaryReport: {
    path: '/reports/invoice-summary-report',
    permission: 'RIS001',
    element: <InvoiceSummaryReport />,
  },
  siteManagement: {
    path: '/administration/site-management',
    permission: 'ASM001',
    element: <SiteManagementPage />,
  },
  itemManagement: {
    path: '/administration/item-management',
    permission: 'AIM001',
    element: <ItemManagementPage />,
  },
  myApprovals: {
    path: '/my-approvals',
    permission: 'MAV001',
    element: <MyApprovalsPage />,
  },
  authorizeSetting: {
    path: '/authorize-setting',
    permission: 'AUS001',
    element: <AuthorizeSettingPage />,
  },
  workflowManagement: {
    path: '/administration/workflow-management',
    permission: 'AWM001',
    element: <WorkflowManagementPage />,
  },
  importBudget: {
    path: '/import-data/import-budget',
    permission: 'IMPB003',
    element: <ImportDataPage type='budget'/>,
  },
  importSupplier: {
    path: '/import-data/import-supplier',
    permission: 'IMPS004',
    element: <ImportDataPage type='supplier' />,
  },
  importEmployee: {
    path: '/import-data/import-employee',
    permission: 'IMPE001',
    element: <ImportDataPage type='employee' />,
  },
  importOrganizationUnit: {
    path: '/import-data/import-organization-unit',
    permission: 'IMPO002',
    element: <ImportDataPage type='organizationUnit' />,
  },
  budgetEnquiry: {
    path: '/budget-enquiry',
    permission: 'BGE001',
    element: <BudgetEnquiryPage />,
  },
}
