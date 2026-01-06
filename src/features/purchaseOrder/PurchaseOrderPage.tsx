import { Tag } from 'antd'

import { useAppSelector } from 'app/hook'
import useCustomModal from 'hooks/useCustomModal'
import useDrawer from 'hooks/useDrawer'

import ApprovalModal from 'components/ApprovalModal'
import PageHeader from 'components/PageHeader'
import { selectUser } from 'features/auth/authSlice'

import { DOMAINS, PAGE_MODE, PO_STATUS_LABELS } from 'constants/index'
import { formatDisplayDate } from 'utils/dateHelpers'

import ApproveCancelPOModal from './components/ApproveCancelPOModal'
import CancelPOModal from './components/CancelPOModal'
import GRHistoryModal from './components/GRHistoryModal'
import POAttachments from './components/POAttachments'
// import POBCSPrintDrawer from './components/POBCSPrintDrawer'
import POBudgetControlSheet from './components/POBudgetControlSheet'
import PODetail from './components/PODetail'
import POFloatingButtons from './components/POFloatingButtons'
import POHeader from './components/POHeader'
import POItems from './components/POItems'
import POPrintDrawer from './components/POPrintDrawer'
import SuppliersDetailForm from './components/SuppliersDetailForm'
import useApprovalActions from './hooks/useApprovalActions'
import useManageBCS from './hooks/useManageBCS'
import usePOState from './hooks/usePOState'
// import WarningSection from './components/WarningSection'
import usePurchaseOrderPage from './hooks/usePurchaseOrderPage'

type Props = {
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
}

const PurchaseOrderPage: React.FC<Props> = ({ mode = PAGE_MODE.CREATE }) => {
  const user = useAppSelector(selectUser)
  const printDrawer = useDrawer()
  const bcsPrintDrawer = useDrawer()
  const poPageHook = usePurchaseOrderPage({ mode })
  const poState = usePOState({
    purchaseStatus: poPageHook.poData?.purchaseStatus,
    purchaserId: poPageHook.poData?.purchaserId,
  })
  const isNewPage = mode === PAGE_MODE.CREATE
  const manageBCSHook = useManageBCS({
    poId: poPageHook.poData?.id,
    prId: poPageHook.prList[0]?.purchaseRequisitionId,
    poItemsList: poPageHook.poItemsList,
    budgetControlSheetData: poPageHook.budgetControlSheetData,
    setBudgetControlSheetData: poPageHook.setBudgetControlSheetData,
    getAmountForBCS: poPageHook.getAmountForBCS,
    setIsRequiredUpdateBCS: poPageHook.setIsRequiredUpdateBCS,
    setIsLoadingBCS: poPageHook.setIsLoadingBCS,
  })
  const cancelModalHook = useCustomModal()
  const approveCancelModalHook = useCustomModal()
  const grHistoryModalHook = useCustomModal()
  const pageTitle = isNewPage ? 'New Purchase Order' : 'Edit Purchase Order'

  // Use the approval actions hook
  const {
    approvalsModalHook,
    showSubmitButton,
    canEditNextApprover,
    documentType,
    handleSubmitWithValidation,
    handleCheckStatus,
    handleSubmitAction,
  } = useApprovalActions({
    poData: poPageHook.poData || undefined,
    validatePO: poPageHook.validatePO,
    updatePOForSubmission: poPageHook.updatePOForSubmission,
  })

  return (
    <>
      {grHistoryModalHook.isModalMounted && (
        <GRHistoryModal modalHook={grHistoryModalHook} poId={poPageHook.poData?.id || ''} />
      )}
      {approveCancelModalHook.isModalMounted && (
        <ApproveCancelPOModal
          poId={poPageHook.poData?.id || ''}
          modalHook={approveCancelModalHook}
          approverName={user?.fullNameEn || ''}
          approverSite={user?.currentSiteCode || ''}
          approverSection={user?.currentOrganizationName || ''}
          domainStatus={poPageHook.poData?.purchaseStatus || ''}
        />
      )}
      {cancelModalHook.isModalMounted && (
        <CancelPOModal
          domain={DOMAINS.PURCHASE_ORDER}
          modalHook={cancelModalHook}
          hideModal={cancelModalHook.handleCancel}
          requesterName={user?.fullNameEn || ''}
          requesterSite={user?.currentSiteCode || ''}
          requesterSection={user?.currentOrganizationName || ''}
          domainNo={poPageHook.poData?.poNo || ''}
          domainId={poPageHook.poData?.id || ''}
          domainDate={poPageHook.poData?.poDate || ''}
          domainStatus={poPageHook.poData?.purchaseStatus || ''}
        />
      )}
      {approvalsModalHook.isModalMounted && (
        <ApprovalModal
          isOpen={approvalsModalHook.isModalVisible}
          onClose={approvalsModalHook.handleCancel}
          afterClose={approvalsModalHook.afterClose}
          documentId={poPageHook.poData?.id?.toString() || ''}
          documentType={documentType}
          onSubmitAction={handleSubmitAction}
          showSubmitButton={showSubmitButton}
          canEditNextApprover={canEditNextApprover}
        />
      )}
      <POPrintDrawer
        onClose={printDrawer.onClose}
        open={printDrawer.open}
        poData={poPageHook.poData}
        previewType="signed-po"
        modalTitle="พิมพ์ใบสั่งซื้อสินค้า/PURCHASE ORDER(PO.)"
      />
      <POPrintDrawer
        onClose={bcsPrintDrawer.onClose}
        open={bcsPrintDrawer.open}
        poData={poPageHook.poData}
        previewType="po-budget"
        modalTitle="พิมพ์ BUDGET CONTROL SHEET"
      />
      <PageHeader
        pageTitle={pageTitle}
        breadcrumbItems={[
          {
            title: pageTitle,
          },
        ]}
        extraRightNote={
          isNewPage ? null : poPageHook.poData?.purchaseStatus ? (
            <Tag color="geekblue">
              {PO_STATUS_LABELS[poPageHook.poData.purchaseStatus as keyof typeof PO_STATUS_LABELS]}
            </Tag>
          ) : null
        }
      />
      <div style={{ marginTop: 8 }}>
        <POHeader
          poNo={mode === PAGE_MODE.CREATE ? '-' : poPageHook.poData?.poNo || '-'}
          poDate={
            mode === PAGE_MODE.CREATE ? '-' : formatDisplayDate(poPageHook.poData?.poDate) || '-'
          }
          purchaserName={isNewPage ? user?.fullNameEn || '-' : poPageHook.poData?.purchaserName}
          purchaserSite={
            isNewPage ? user?.currentSiteCode || '-' : poPageHook.poData?.purchaserSite
          }
          purchaserSection={
            isNewPage ? user?.currentDepartmentName || '-' : poPageHook.poData?.purchaserSection
          }
        />
      </div>
      <div ref={poPageHook.poDetailDivRef} style={{ marginTop: 4 }}>
        <PODetail
          poDetailsFormRef={poPageHook.poDetailsFormRef}
          selectedCurrency={poPageHook.selectedCurrency}
          isNotRefPR={poPageHook.isNotRefPR}
          prList={poPageHook.prList}
          poItemsList={poPageHook.poItemsList}
          selectedBudget={poPageHook.selectedBudget}
          selectedBudgetType={poPageHook.selectedBudgetType}
          selectedMainGroup={poPageHook.selectedMainGroup}
          setSelectedBudgetType={poPageHook.setSelectedBudgetType}
          setSelectedCurrency={poPageHook.setSelectedCurrency}
          setIsNotRefPR={poPageHook.setIsNotRefPR}
          setPrList={poPageHook.setPrList}
          setPoItemsList={poPageHook.setPoItemsList}
          setPoAttachmentsList={poPageHook.setPoAttachmentsList}
          setExchangeRates={poPageHook.setExchangeRates}
          updateMultipleBudgetBCS={manageBCSHook.updateMultipleBudgetBCS}
          setBudgetControlSheetData={poPageHook.setBudgetControlSheetData}
          setSelectedBudget={poPageHook.setSelectedBudget}
          setSelectedMainGroup={poPageHook.setSelectedMainGroup}
          setIsRequiredUpdateBCS={poPageHook.setIsRequiredUpdateBCS}
          isDisabledAllForm={poState.isDisabledAllForm}
        />
      </div>
      <div ref={poPageHook.poSupplierDivRef} style={{ marginTop: 4 }}>
        <SuppliersDetailForm
          supplierDetailsFormRef={poPageHook.supplierDetailsFormRef}
          isShowPaymentDesc={poPageHook.isShowPaymentDesc}
          setIsShowPaymentDesc={poPageHook.setIsShowPaymentDesc}
          selectedSupplier={poPageHook.selectedSupplier}
          setSelectedSupplier={poPageHook.setSelectedSupplier}
          isDisabledAllForm={poState.isDisabledAllForm}
        />
      </div>
      <div ref={poPageHook.poItemsDivRef} style={{ marginTop: 4 }}>
        <POItems
          prList={poPageHook.prList}
          poItemsList={poPageHook.poItemsList}
          setPoItemsList={poPageHook.setPoItemsList}
          poItemsGrandTotal={poPageHook.poItemsGrandTotal}
          setPoItemsGrandTotal={poPageHook.setPoItemsGrandTotal}
          selectedCurrency={poPageHook.selectedCurrency}
          exchangeRateSource={poPageHook.exchangeRates.source}
          exchangeRateDestination={poPageHook.exchangeRates.destination}
          vatPercentage={poPageHook.vatPercentage}
          setVatPercentage={poPageHook.setVatPercentage}
          poItemsFormRef={poPageHook.poItemsFormRef}
          updateBCSWithBudgetId={manageBCSHook.updateBCSWithBudgetId}
          setBudgetControlSheetData={poPageHook.setBudgetControlSheetData}
          isDisabledAllForm={poState.isDisabledAllForm}
          selectedBudget={poPageHook.selectedBudget}
          isNotRefPR={poPageHook.isNotRefPR}
          selectedBudgetType={poPageHook.selectedBudgetType}
          selectedMainGroup={poPageHook.selectedMainGroup}
          updateMultipleBudgetBCS={manageBCSHook.updateMultipleBudgetBCS}
        />
      </div>
      <div ref={poPageHook.poAttachDivRef} style={{ marginTop: 4 }}>
        <POAttachments
          mode={mode}
          poId={poPageHook.poData?.id}
          poAttachmentsList={poPageHook.poAttachmentsList}
          setPoAttachmentsList={poPageHook.setPoAttachmentsList}
          isDisabledAllForm={poState.isDisabledAllForm}
        />
      </div>
      {/* <div style={{ marginTop: 4 }}>
        <WarningSection />
      </div> */}
      <div ref={poPageHook.poBCSDivRef} style={{ marginTop: 4, marginBottom: 48 }}>
        <POBudgetControlSheet
          isRequiredUpdateBCS={poPageHook.isRequiredUpdateBCS}
          isLoadingBCS={poPageHook.isLoadingBCS}
          poBCSFormRef={poPageHook.poBCSFormRef}
          budgetType={poPageHook.selectedBudgetType?.label}
          budgetControlSheetData={poPageHook.budgetControlSheetData}
          refetchBCS={manageBCSHook.refetchBCS}
          isDisabledAllForm={poState.isDisabledAllForm}
        />
      </div>
      <POFloatingButtons
        purchaserId={poPageHook.poData?.purchaserId}
        poStatus={poPageHook.poData?.purchaseStatus}
        poId={poPageHook.poData?.id}
        disabledAll={poPageHook.isLoadingBCS || poPageHook.isFetchingPO}
        onSave={() => {
          if (mode === PAGE_MODE.CREATE) {
            poPageHook.onCreatePO()
          } else {
            poPageHook.onUpdatePO()
          }
        }}
        onCancel={cancelModalHook.showModal}
        onApproveCancel={approveCancelModalHook.showModal}
        onPrint={printDrawer.showDrawer}
        onPrintBCS={bcsPrintDrawer.showDrawer}
        onGRHistory={grHistoryModalHook.showModal}
        handleSubmitWithValidation={handleSubmitWithValidation}
        handleCheckStatus={handleCheckStatus}
      />
    </>
  )
}

export default PurchaseOrderPage
