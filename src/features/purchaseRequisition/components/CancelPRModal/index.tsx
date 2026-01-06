import { CloseCircleOutlined } from '@ant-design/icons'
import { Divider, Modal, Spin } from 'antd'

import useCancelModal from 'hooks/useCancelModal'
import useCustomModal from 'hooks/useCustomModal'

import CancelPurchaseForm from 'components/CancelPurchaseForm'
import HeaderTitle from 'components/HeaderTitle'

import { DOMAINS, PR_STATUS } from 'constants/index'

import useCancelPRModal from './hooks/useCancelPRModal'

type Props = {
  modalHook: ReturnType<typeof useCustomModal>
  requesterName: string
  requesterSite: string
  requesterSection: string
  domainNo: string
  domainDate: string
  domainId: string
  domainStatus: string
  domain: (typeof DOMAINS)[keyof typeof DOMAINS]
  hideModal: () => void
}

const CancelPRModal = ({
  modalHook,
  hideModal,
  requesterName,
  requesterSite,
  requesterSection,
  domainNo,
  domainDate,
  domain,
  domainId,
  domainStatus,
}: Props) => {
  const { cancelData, isLoading: isFetchingData } = useCancelPRModal({
    prId: domainId,
    domainStatus,
  })
  const { fileList, setFileList, cancelFormRef, onSaveCancelPR, isLoading } = useCancelModal({
    hideModal,
    requesterName,
    requesterSite,
    requesterSection,
    domainNo,
    domainDate,
    domain,
    domainId,
    domainStatus,
    cancelData,
  })

  const getModalTitle = () => {
    switch (domain) {
      case DOMAINS.PURCHASE_ORDER:
        return 'Cancel Purchase Order/ยกเลิกใบสั่งซื้อสินค้า'
      case DOMAINS.PURCHASE_REQUISITION:
        return 'Cancel Purchase Requisition/ยกเลิกใบสั่งซื้อสินค้า'
      default:
        return ''
    }
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle title={getModalTitle()} titlePreIcon={<CloseCircleOutlined />} />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={hideModal}
      width={1000}
      footer={null}
      afterClose={modalHook.afterClose}
    >
      <Spin spinning={isFetchingData || isLoading}>
        <CancelPurchaseForm
          isDisabledForm={[PR_STATUS.PR_CANCELED].includes(domainStatus)}
          domain={domain}
          formRef={cancelFormRef}
          fileList={fileList}
          setFileList={setFileList}
          requesterName={requesterName}
          requesterSite={requesterSite}
          requesterSection={requesterSection}
          domainNo={domainNo}
          domainDate={domainDate}
          onSaveCancel={onSaveCancelPR}
          hideModal={hideModal}
          reasonCancel={cancelData?.reasonCancel}
        />
      </Spin>
    </Modal>
  )
}

export default CancelPRModal
