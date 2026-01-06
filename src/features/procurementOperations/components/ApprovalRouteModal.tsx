import React from 'react'

import { DoubleRightOutlined, FileTextOutlined } from '@ant-design/icons'
import { Divider, Modal, Result } from 'antd'

import { useGetApprovalRouteQuery } from 'api/approvalApi'
import { ProcurementOperation } from 'api/procurementApi.types'
import useCustomModal from 'hooks/useCustomModal'

import ApproverSteps from 'components/ApproverSteps'
import HeaderTitle from 'components/HeaderTitle'

const TITLE_LABEL = {
  PURCHASE_REQUISITION: 'Purchase Requisition',
  PURCHASE_ORDER: 'Purchase Order',
}

interface ApprovalRouteModalProps {
  modalHook: ReturnType<typeof useCustomModal>
  selectedRecord: ProcurementOperation | null
}

const ApprovalRouteModal: React.FC<ApprovalRouteModalProps> = ({ modalHook, selectedRecord }) => {
  const {
    currentData: approvalRoute,
    error: approvalRouteError,
    isFetching: approvalRouteLoading,
  } = useGetApprovalRouteQuery(
    {
      // If the API call is not skipped, we know these values exist
      documentId: selectedRecord?.key || '',
      // "PURCHASE_REQUISITION" | "PURCHASE_ORDER"
      documentType: selectedRecord?.operationType === 'PURCHASE_REQUISITION' ? 'PR' : 'PO',
    },
    {
      skip: !selectedRecord?.key || !selectedRecord?.operationType,
    },
  )
  const { currentData: receivingPrApprovalRouteData, isFetching: receivingPrApprovalRouteLoading } =
    useGetApprovalRouteQuery(
      {
        documentId: selectedRecord?.key || '',
        documentType: 'RECEIVE_PR',
      },
      {
        skip: selectedRecord?.operationType !== 'PURCHASE_REQUISITION',
      },
    )

  if (!selectedRecord) return null

  return (
    <Modal
      title={
        <>
          <HeaderTitle
            title="รายละเอียดการอนุมัติ / Approval Route"
            titlePreIcon={<FileTextOutlined />}
          />
          <Divider style={{ marginBlock: 16 }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={modalHook.handleCancel}
      footer={null}
      width="80%"
      loading={approvalRouteLoading || receivingPrApprovalRouteLoading}
      destroyOnClose
    >
      {approvalRouteError ? (
        <Result
          status="404"
          title="No Approval Route Data"
          subTitle="No approval route data is available for this request. Please select a different
                document or try again later."
          style={{ margin: '24px 0' }}
        />
      ) : (
        <div style={{ marginBottom: 16 }}>
          <div>
            <HeaderTitle
              title={TITLE_LABEL[selectedRecord?.operationType]}
              titlePostIcon={<DoubleRightOutlined />}
            />
            <ApproverSteps canEditNextApprover={false} approvalRoute={approvalRoute} />
          </div>
          {receivingPrApprovalRouteData && (
            <>
              <Divider />
              <div>
                <HeaderTitle title="Receive PR." titlePostIcon={<DoubleRightOutlined />} />
                <ApproverSteps
                  canEditNextApprover={false}
                  approvalRoute={receivingPrApprovalRouteData}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}

export default ApprovalRouteModal
