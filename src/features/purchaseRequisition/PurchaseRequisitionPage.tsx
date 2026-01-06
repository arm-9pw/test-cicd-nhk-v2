// import dayjs from 'dayjs'
import { Tag } from 'antd'

import { useAppSelector } from 'app/hook'
import useDrawer from 'hooks/useDrawer'

import ApprovalModal from 'components/ApprovalModal'
import PageHeader from 'components/PageHeader'
import { selectUser } from 'features/auth/authSlice'

import { DOMAINS, PAGE_MODE, PR_STATUS_LABELS } from 'constants/index'
import { formatDisplayDate } from 'utils/dateHelpers'

import CancelPRModal from './components/CancelPRModal'
// import BudgetEnquiryModal from './components/BudgetEnquiryModal'
import PRAttachment from './components/PRAttachment'
import PRBudgetControlSheet from './components/PRBudgetControlSheet'
import PRDetailsForm from './components/PRDetailsForm'
import PrFloatingActionButtons from './components/PRFloatingButtons'
import PRHeader from './components/PRHeader'
import PRItems from './components/PRItems'
import PRPrintDrawer from './components/PRPrintDrawer'
import PRPurchasingIncharge from './components/PRPurchasingIncharge'
import TransferPRModal from './components/TransferPRModal'
import useApprovalActions from './hooks/useApprovalActions'
import usePRState from './hooks/usePRState'
import usePurchaseRequisitionPage from './hooks/usePurchaseRequisitionPage'
import useUpdateBCS from './hooks/useUpdateBCS'

type Props = {
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
}

const PurchaseRequisitionPage: React.FC<Props> = ({ mode = PAGE_MODE.CREATE }) => {
  const user = useAppSelector(selectUser)
  const printDrawer = useDrawer()

  const isNewPage = mode === PAGE_MODE.CREATE
  const pageTitle = isNewPage ? 'New Purchase Requisition' : 'Edit Purchase Requisition'
  const prPageHook = usePurchaseRequisitionPage()
  const prState = usePRState({
    purchaseStatus: prPageHook.prData?.purchaseStatus,
    requesterId: prPageHook.prData?.requesterId,
  })
  const { updateBCS, refetchBCS, isLoadingBCS } = useUpdateBCS({
    prId: prPageHook.prId,
    exchangeRateSource: prPageHook.exchangeRates.source,
    exchangeRateDestination: prPageHook.exchangeRates.destination,
    setBudgetControlSheetData: prPageHook.setBudgetControlSheetData,
    prItemsList: prPageHook.prItemsList,
    onSetIsBCSDataOutdated: prPageHook.onSetIsBCSDataOutdated,
  })

  // Use the approval actions hook
  const {
    approvalsModalHook,
    showSubmitButton,
    canEditNextApprover,
    documentType,
    handleSubmitWithValidation,
    handleCheckStatus,
    handleReceivePR,
    handleSubmitAction,
  } = useApprovalActions({
    prData: prPageHook.prData,
    validatePRData: prPageHook.validatePRData,
    handlePRSubmissionWithPasscode: prPageHook.handlePRSubmissionWithPasscode,
    submitPRUpdate: prPageHook.submitPRUpdate,
    exchangeRates: prPageHook.exchangeRates,
  })

  return (
    <div>
      {/* --- BEGIN: Modal and Drawer Components ---*/}
      {prPageHook.transferModalHook.isModalMounted && (
        <TransferPRModal
          modalHook={prPageHook.transferModalHook}
          hideModal={prPageHook.transferModalHook.handleCancel}
          mainGroupId={prPageHook.prData?.mainGroupId}
          prId={prPageHook.prData?.id}
        />
      )}

      {prPageHook.cancelModalHook.isModalMounted && (
        <CancelPRModal
          domain={DOMAINS.PURCHASE_REQUISITION}
          modalHook={prPageHook.cancelModalHook}
          hideModal={prPageHook.cancelModalHook.handleCancel}
          requesterName={prPageHook.prData?.requesterName || ''}
          requesterSite={prPageHook.prData?.requesterSite || ''}
          requesterSection={prPageHook.prData?.requesterSection || ''}
          domainNo={prPageHook.prData?.prNo || ''}
          domainId={prPageHook.prData?.id || ''}
          domainDate={formatDisplayDate(prPageHook.prData?.prDate) || ''}
          domainStatus={prPageHook.prData?.purchaseStatus || ''}
        />
      )}
      {approvalsModalHook.isModalMounted && (
        <ApprovalModal
          isOpen={approvalsModalHook.isModalVisible}
          onClose={approvalsModalHook.handleCancel}
          afterClose={approvalsModalHook.afterClose}
          documentId={prPageHook.prData?.id?.toString() || ''}
          documentType={documentType}
          onSubmitAction={handleSubmitAction}
          showSubmitButton={showSubmitButton}
          canEditNextApprover={canEditNextApprover}
        />
      )}
      {/* {budgetInquiryModal.isModalMounted && (
        <BudgetEnquiryModal
          isOpen={budgetInquiryModal.isModalVisible}
          onCloseModal={budgetInquiryModal.handleCancel}
          afterClose={budgetInquiryModal.afterClose}
          onAddAction={prPageHook.getAddBudgetCodeHandler()}
        />
      )} */}
      <PRPrintDrawer
        onClose={printDrawer.onClose}
        open={printDrawer.open}
        prData={prPageHook.prData}
      />
      {/* --- END: Modal and Drawer Components ---*/}

      {/* --- BEGIN: Page Components --- */}
      <PageHeader
        pageTitle={pageTitle}
        breadcrumbItems={[
          {
            title: pageTitle,
          },
        ]}
        extraRightNote={
          isNewPage ? null : prPageHook.prData?.purchaseStatus ? (
            <Tag color="geekblue">
              {PR_STATUS_LABELS[prPageHook.prData.purchaseStatus as keyof typeof PR_STATUS_LABELS]}
            </Tag>
          ) : null
        }
      />
      <div style={{ marginTop: 8 }}>
        <PRHeader
          prNo={isNewPage ? '-' : prPageHook.prData?.prNo || '-'}
          prDate={isNewPage ? '-' : formatDisplayDate(prPageHook.prData?.prDate) || '-'}
          name={isNewPage ? user?.fullNameEn : prPageHook.prData?.requesterName}
          position={isNewPage ? user?.currentPositionName : prPageHook.prData?.requesterPosition}
          site={isNewPage ? user?.currentSiteCode : prPageHook.prData?.requesterSite}
          section={isNewPage ? user?.currentDepartmentName : prPageHook.prData?.requesterSection}
        />
      </div>
      <div ref={prPageHook.prDetailDivRef} style={{ marginTop: 4 }}>
        <PRDetailsForm
          mode={mode}
          onSetMainGroup={prPageHook.onSetMainGroup}
          selectedMainGroup={prPageHook.selectedMainGroup}
          prSelectedBudget={prPageHook.prSelectedBudget}
          onSetPrSelectedBudget={prPageHook.onSetPrSelectedBudget}
          selectedCurrency={prPageHook.selectedCurrency}
          onExchangeRateChange={prPageHook.handleExchangeRateChange}
          onSetSelectedCurrency={prPageHook.onSetSelectedCurrency}
          prDetailsFormRef={prPageHook.prDetailsFormRef}
          selectedBudgetType={prPageHook.selectedBudgetType}
          onBudgetTypeChange={prPageHook.onBudgetTypeChange}
          onSetIsBCSDataOutdated={prPageHook.onSetIsBCSDataOutdated}
          isDisabledAllForm={prState.isDisabledAllForm}
          prItemsList={prPageHook.prItemsList}
          onSetPrItemsList={prPageHook.onSetPrItemsList}
          setBudgetControlSheetData={prPageHook.setBudgetControlSheetData}
          onSetIsMultipleBudget={prPageHook.onSetIsMultipleBudget}
        />
      </div>
      <div ref={prPageHook.prItemsDivRef} style={{ marginTop: 4 }}>
        <PRItems
          onSetPrLoading={prPageHook.onSetPrLoading}
          budgetTypeId={prPageHook.selectedBudgetType?.value}
          prDetailsFormRef={prPageHook.prDetailsFormRef}
          setBudgetControlSheetData={prPageHook.setBudgetControlSheetData}
          prItemsList={prPageHook.prItemsList}
          onSetPrItemsList={prPageHook.onSetPrItemsList}
          prItemsGrandTotal={prPageHook.prItemsGrandTotal}
          onSetPrItemsGrandTotal={prPageHook.onSetPrItemsGrandTotal}
          prSelectedBudget={prPageHook.prSelectedBudget}
          isMultipleBudget={prPageHook.isMultipleBudget}
          onSetIsMultipleBudget={prPageHook.onSetIsMultipleBudget}
          selectedCurrency={prPageHook.selectedCurrency}
          exchangeRates={prPageHook.exchangeRates}
          updateBCS={updateBCS}
          refetchBCS={refetchBCS}
          isDisabledAllForm={prState.isDisabledAllForm}
          selectedMainGroup={prPageHook.selectedMainGroup}
        />
      </div>
      <div ref={prPageHook.prAttachDivRef} style={{ marginTop: 4 }}>
        <PRAttachment
          mode={mode}
          refId={prPageHook.prData?.id}
          documentList={prPageHook.documentList}
          onSetDocumentList={prPageHook.onSetDocumentList}
          domain={DOMAINS.PURCHASE_REQUISITION}
          isDisabledAllForm={prState.isDisabledAllForm}
        />
      </div>
      <div ref={prPageHook.prPurchasingInchargeDivRef} style={{ marginTop: 4 }}>
        <PRPurchasingIncharge
          mode={mode}
          selectedMainGroup={prPageHook.selectedMainGroup}
          prPurchasingInchargeFormRef={prPageHook.prPurchasingInchargeFormRef}
          isDisabledAllForm={prState.isDisabledAllForm}
        />
      </div>
      <div ref={prPageHook.prBCSDivRef} style={{ marginTop: 4, marginBottom: 48 }}>
        <PRBudgetControlSheet
          refetchBCS={refetchBCS}
          isLoadingBCS={isLoadingBCS}
          isBCSDataOutdated={prPageHook.isBCSDataOutdated}
          prBCSFormRef={prPageHook.prBCSFormRef}
          budgetType={prPageHook.selectedBudgetType?.label}
          budgetControlSheetData={prPageHook.budgetControlSheetData}
          isDisabledAllForm={prState.isDisabledAllForm}
        />
      </div>
      <PrFloatingActionButtons
        purchaseInChargeSectionId={prPageHook.prData?.purchaseInChargeSectionId}
        composeUpdatePrData={prPageHook.composeUpdatePrData}
        prId={prPageHook.prData?.id}
        prStatus={prPageHook.prData?.purchaseStatus}
        disabledAll={prPageHook.prLoading || isLoadingBCS || prPageHook.isFetchingPR}
        handlePrint={printDrawer.showDrawer}
        handleSave={isNewPage ? prPageHook.submitNewPR : prPageHook.submitPRUpdate}
        handleCancel={prPageHook.cancelModalHook.showModal}
        handleTransfer={prPageHook.transferModalHook.showModal}
        handleSubmitWithApproval={handleSubmitWithValidation}
        handleCheckStatus={handleCheckStatus}
        handleReceivePR={handleReceivePR}
        requesterId={prPageHook.prData?.requesterId}
      />
      {/* --- END: Page Components --- */}
    </div>
  )
}

export default PurchaseRequisitionPage
