import { useParams } from 'react-router-dom'

import { Tag } from 'antd'

import { useAppSelector } from 'app/hook'
import useCustomModal from 'hooks/useCustomModal'

import PageHeader from 'components/PageHeader'
import { selectUser } from 'features/auth/authSlice'
import GRHistoryModal from 'features/purchaseOrder/components/GRHistoryModal'

import { GR_STATUS_LABELS, PAGE_MODE } from 'constants/index'

import GRAttachment from './components/GRAttachment'
import GRDetail from './components/GRDetail'
import GRFloatingActionButtons from './components/GRFloatingActionButtons'
import GRHeader from './components/GRHeader'
import GRItems from './components/GRItems'
import { useGRState } from './hooks/useGRState'
import useGoodReceivePage from './hooks/useGoodReceivePage'

type Props = {
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
}

const GoodRecivePage: React.FC<Props> = ({ mode = PAGE_MODE.CREATE }) => {
  const { id } = useParams()
  const isNewPage = mode === PAGE_MODE.CREATE
  const user = useAppSelector(selectUser)
  const grHistoryModalHook = useCustomModal()

  const {
    GRSearchItemInputValue,
    setGRSearchItemInputValue,
    POGRs,
    // POGR,
    isLoadingPOGRs,
    isFetchingPOGRs,
    isErrorPOGRs,
    triggerGetPOGRs,
    GRinvoiceItems,
    GRForm,
    GRIForm,
    GRAForm,
    POGRRemainingItems,
    onClickSetAllGRInvoiceItems,
    GRDetailDivRef,
    onSubmitUpdateGR,
    // isUpdatingGR,
    attachFiles,
    onDeleteAttachFile,
    onAddGRAttachment,
    onChangeGRFileUpload,
    isLoadingPOGRRemainingItems,
    isLoadingGRDocuments,
    GRAttachDivRef,
    onChangeGRInvoiceItems,
    selectedGRinvoiceItemKeys,
    setSelectedGRinvoiceItemKeys,
    onDeleteGRinvoiceItems,
    onClickGRSearchItem,
    onChangeGRAttachItems,
    // onChangeGRSearchItemInputValue,
    isDeletingGRDocument,
    // onClickGRHistory,
    // isGRHistoryModalOpen,
    // onOKGRHistory,
    // onCancelGRHistory,
    // GRHistoryData,
    // isLoadingGRHistory,
    onDownloadGRAttachment,
    onEditGRAttachment,
    onSaveGRAttachmentEditingRecord,
    onCancelGRAttachmentEditingRecord,
    // isUpdatingGRDocument,
    onRestoreGRinvoiceItems,
    GRItemsDivRef,
    isUpdatingGR,
    onBlurGRInvoiceItems,
    selectedRequester,
    selectedPOID,
    purchaseStatus,
    onDeleteGR,
    isPOFullyReceived,
  } = useGoodReceivePage({ mode, GRID: id ? id : '', user })

  const { isDisabledAllForm, isRequester, isSameDepartment } = useGRState({
    selectedRequester,
  })

  return (
    <>
      <PageHeader
        pageTitle="Goods Receive (GR.)"
        breadcrumbItems={[
          {
            title: 'Goods Receive (GR.)',
          },
        ]}
        extraRightNote={
          isNewPage ? null : purchaseStatus ? (
            <Tag color="geekblue">
              {GR_STATUS_LABELS[purchaseStatus as keyof typeof GR_STATUS_LABELS]}
            </Tag>
          ) : null
        }
      />

      <GRHistoryModal modalHook={grHistoryModalHook} poId={selectedPOID || ''} />

      {/* MAY'S NOTE: Modal เก่า ไม่ใช้แล้ว รอลบพร้อมไฟล์ */}
      {/* <GRHistoryModal
        onOKGRHistory={onOKGRHistory}
        onCancelGRHistory={onCancelGRHistory}
        isGRHistoryModalOpen={isGRHistoryModalOpen}
        GRHistoryData={GRHistoryData}
        isLoadingGRHistory={isLoadingGRHistory}
      /> */}

      <div style={{ marginTop: 16 }}>
        <GRHeader
          GRName={selectedRequester?.requesterName}
          GRSite={selectedRequester?.requesterSite}
          GRsection={selectedRequester?.requesterSection}
        />
      </div>

      <div ref={GRDetailDivRef} style={{ marginTop: 16 }}>
        <GRDetail
          isDisabledAllForm={isDisabledAllForm}
          GRSearchItemInputValue={GRSearchItemInputValue}
          setGRSearchItemInputValue={setGRSearchItemInputValue}
          // onChangeGRSearchItemInputValue={onChangeGRSearchItemInputValue} // TODO remove broken code
          triggerGetPOGRs={triggerGetPOGRs}
          isLoadingPOGRs={isLoadingPOGRs}
          isFetchingPOGRs={isFetchingPOGRs}
          isErrorPOGRs={isErrorPOGRs}
          POGRs={POGRs}
          POGRRemainingItems={POGRRemainingItems}
          GRForm={GRForm}
          onClickGRSearchItem={onClickGRSearchItem}
          mode={mode}
        />
      </div>
      <div ref={GRItemsDivRef} style={{ marginTop: 16 }}>
        <GRItems
          isDisabledAllForm={isDisabledAllForm}
          GRinvoiceItems={GRinvoiceItems}
          onClickSetAllGRInvoiceItems={onClickSetAllGRInvoiceItems}
          GRIForm={GRIForm}
          isLoadingPOGRRemainingItems={isLoadingPOGRRemainingItems}
          onChangeGRInvoiceItems={onChangeGRInvoiceItems}
          selectedGRinvoiceItemKeys={selectedGRinvoiceItemKeys}
          setSelectedGRinvoiceItemKeys={setSelectedGRinvoiceItemKeys}
          onDeleteGRinvoiceItems={onDeleteGRinvoiceItems}
          onRestoreGRinvoiceItems={onRestoreGRinvoiceItems}
          isUpdatingGR={isUpdatingGR}
          onBlurGRInvoiceItems={onBlurGRInvoiceItems}
        />
      </div>
      <div ref={GRAttachDivRef} style={{ marginTop: 16, marginBottom: 48 }}>
        <GRAttachment
          isDisabledAllForm={isDisabledAllForm}
          attachFiles={attachFiles}
          onDeleteAttachFile={onDeleteAttachFile}
          onAddGRAttachment={onAddGRAttachment}
          onChangeGRFileUpload={onChangeGRFileUpload}
          isLoadingGRDocuments={isLoadingGRDocuments}
          GRAForm={GRAForm}
          onChangeGRAttachItems={onChangeGRAttachItems}
          isDeletingGRDocument={isDeletingGRDocument}
          onDownloadGRAttachment={onDownloadGRAttachment}
          onEditGRAttachment={onEditGRAttachment}
          onSaveGRAttachmentEditingRecord={onSaveGRAttachmentEditingRecord}
          onCancelGRAttachmentEditingRecord={onCancelGRAttachmentEditingRecord}
          isUpdatingGR={isUpdatingGR}
          user={user}
        />
      </div>
      <GRFloatingActionButtons
        isRequester={isRequester}
        isSameDepartment={isSameDepartment}
        grStatus={purchaseStatus}
        onSubmitUpdateGR={onSubmitUpdateGR}
        onClickGRHistory={grHistoryModalHook.showModal}
        onClickGRClear={() => {
          // Implement cancel functionality
          // browser press refresh button
          window.location.reload()
        }}
        onDeleteGRHistory={onDeleteGR}
        isDisableSaveButton={isPOFullyReceived}
      />
    </>
  )
}

export default GoodRecivePage
