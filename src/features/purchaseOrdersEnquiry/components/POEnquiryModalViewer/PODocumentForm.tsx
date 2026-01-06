import { Tag } from 'antd'

import POAttachments from 'features/purchaseOrder/components/POAttachments'
import POBudgetControlSheet from 'features/purchaseOrder/components/POBudgetControlSheet'
import PODetail from 'features/purchaseOrder/components/PODetail'
import POHeader from 'features/purchaseOrder/components/POHeader'
import POItems from 'features/purchaseOrder/components/POItems'
import SuppliersDetailForm from 'features/purchaseOrder/components/SuppliersDetailForm'
import useManageBCS from 'features/purchaseOrder/hooks/useManageBCS'
import usePOState from 'features/purchaseOrder/hooks/usePOState'
import usePurchaseOrderPage from 'features/purchaseOrder/hooks/usePurchaseOrderPage'

import { PAGE_MODE, PO_STATUS_LABELS } from 'constants/index'
import { formatDisplayDate } from 'utils/dateHelpers'

import POPrintActionButtons from './POPrintActionButtons'

type Props = {
  poId: string
  mode?: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  setPoItemsGrandTotal?: (value: number) => void
}

const PODocumentForm: React.FC<Props> = ({ poId, mode = PAGE_MODE.VIEW }) => {
  const poPageHook = usePurchaseOrderPage({ mode, poId })
  const poState = usePOState({
    purchaseStatus: poPageHook.poData?.purchaseStatus,
    purchaserId: poPageHook.poData?.purchaserId,
  })

  const manageBCSHook = useManageBCS({
    prId: poPageHook.prList[0]?.id,
    poItemsList: poPageHook.poItemsList,
    budgetControlSheetData: poPageHook.budgetControlSheetData,
    setBudgetControlSheetData: poPageHook.setBudgetControlSheetData,
    getAmountForBCS: poPageHook.getAmountForBCS,
    setIsRequiredUpdateBCS: poPageHook.setIsRequiredUpdateBCS,
    setIsLoadingBCS: poPageHook.setIsLoadingBCS,
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'end', marginRight: 20, marginBottom: 16 }}>
        <Tag color="geekblue">
          {
            PO_STATUS_LABELS[
              (poPageHook.poData?.purchaseStatus as keyof typeof PO_STATUS_LABELS) || ''
            ]
          }
        </Tag>
      </div>
      <div style={{ marginTop: 8 }}>
        <POHeader
          poNo={poPageHook.poData?.poNo || '-'}
          poDate={formatDisplayDate(poPageHook.poData?.poDate) || '-'}
          purchaserName={poPageHook.poData?.purchaserName}
          purchaserSite={poPageHook.poData?.purchaserSite}
          purchaserSection={poPageHook.poData?.purchaserSection}
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

      <div ref={poPageHook.poBCSDivRef} style={{ marginTop: 4, marginBottom: 16 }}>
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
      {poPageHook.poData && <POPrintActionButtons poData={poPageHook.poData} />}
    </>
  )
}

export default PODocumentForm