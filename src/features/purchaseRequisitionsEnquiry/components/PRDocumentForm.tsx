import { Tag } from 'antd'

import PRAttachment from 'features/purchaseRequisition/components/PRAttachment'
import PRBudgetControlSheet from 'features/purchaseRequisition/components/PRBudgetControlSheet'
import PRDetailsForm from 'features/purchaseRequisition/components/PRDetailsForm'
import PRHeader from 'features/purchaseRequisition/components/PRHeader'
import PRItems from 'features/purchaseRequisition/components/PRItems'
import PRPurchasingIncharge from 'features/purchaseRequisition/components/PRPurchasingIncharge'
import usePRState from 'features/purchaseRequisition/hooks/usePRState'
import usePurchaseRequisitionPage from 'features/purchaseRequisition/hooks/usePurchaseRequisitionPage'
import useUpdateBCS from 'features/purchaseRequisition/hooks/useUpdateBCS'

import { DOMAINS, PAGE_MODE, PR_STATUS_LABELS } from 'constants/index'
import { formatDisplayDate } from 'utils/dateHelpers'

import PRPrintButton from './PRPrintButton'

type Props = {
  prId: string
  onClose: () => void
  open: boolean
  mode?: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
}

const PRDocumentForm: React.FC<Props> = ({ prId, mode }) => {
  const prPageHook = usePurchaseRequisitionPage({ prId })

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

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          marginRight: 20,
          marginBottom: 16,
        }}
      >
        <Tag color="geekblue">
          {prPageHook.prData
            ? PR_STATUS_LABELS[prPageHook.prData.purchaseStatus as keyof typeof PR_STATUS_LABELS]
            : '-'}
        </Tag>
      </div>
      <div>
        <PRHeader
          prNo={prPageHook.prData?.prNo || '-'}
          prDate={formatDisplayDate(prPageHook.prData?.prDate) || '-'}
          name={prPageHook.prData?.requesterName}
          position={prPageHook.prData?.requesterPosition}
          site={prPageHook.prData?.requesterSite}
          section={prPageHook.prData?.requesterSection}
        />
      </div>
      <div ref={prPageHook.prItemsDivRef} style={{ marginTop: 4 }}>
        <PRDetailsForm
          mode={mode || 'VIEW'}
          prItemsList={prPageHook.prItemsList}
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
          setBudgetControlSheetData={prPageHook.setBudgetControlSheetData}
          onSetPrItemsList={prPageHook.onSetPrItemsList}
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
          mode={PAGE_MODE.VIEW}
          refId={prPageHook.prData?.id}
          documentList={prPageHook.documentList}
          onSetDocumentList={prPageHook.onSetDocumentList}
          domain={DOMAINS.PURCHASE_REQUISITION}
          isDisabledAllForm={prState.isDisabledAllForm}
        />
      </div>
      <div ref={prPageHook.prPurchasingInchargeDivRef} style={{ marginTop: 4 }}>
        <PRPurchasingIncharge
          mode={PAGE_MODE.VIEW}
          selectedMainGroup={prPageHook.selectedMainGroup}
          prPurchasingInchargeFormRef={prPageHook.prPurchasingInchargeFormRef}
          isDisabledAllForm={prState.isDisabledAllForm}
        />
      </div>
      <div ref={prPageHook.prBCSDivRef} style={{ marginTop: 4, marginBottom: 16 }}>
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
      {mode === PAGE_MODE.VIEW && prPageHook.prData && <PRPrintButton prData={prPageHook.prData} />}
    </>
  )
}
export default PRDocumentForm