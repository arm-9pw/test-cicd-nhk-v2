import React, { useEffect } from 'react'

import { CopyOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Empty, Modal, Result, Row, Space, Spin } from 'antd'

import styles from './styles.module.css'

import { DocumentType } from 'api/approvalApi.types'
import useCustomModal from 'hooks/useCustomModal'

import ApprovalModal from 'components/ApprovalModal'
import HeaderTitle from 'components/HeaderTitle'

import ApproveRejectModal from '../ApproveRejectModal'
import AttachmentsList from '../AttachmentsList'
import DocumentPreview from '../DocumentPreview'
import MainDocumentList from '../MainDocumentList'

// Import custom hooks
import useApprovalRoute from './hooks/useApprovalRoute'
import useDocumentData from './hooks/useDocumentData'
import useDocumentHandling from './hooks/useDocumentHandling'

interface ApprovalDetailModalProps {
  modalHook: ReturnType<typeof useCustomModal>
  selectedItem: { documentId: string; documentType: DocumentType; routeId: string }
}

const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({ modalHook, selectedItem }) => {
  const approvalModalHook = useCustomModal()
  const approveRejectModalHook = useCustomModal()

  const { approvalRoute, canApproveReject, approvalRouteError, approvalRouteLoading } =
    useApprovalRoute(selectedItem)
  const { documentData, isLoading, error, prDataFromPo } = useDocumentData(selectedItem)
  const {
    activeItem,
    previewData,
    // currentDocumentType,
    // currentDocumentId,
    handleItemClick,
    handleDownload,
    cleanup,
    handleMainDocumentPreview,
    isDownloadLoading,
  } = useDocumentHandling({
    selectedItem,
  })

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  if (!selectedItem) return null

  return (
    <>
      <Modal
        title={
          <div>
            <div className={styles['modal-header']}>
              <HeaderTitle
                title="รายละเอียดคำขออนุมัติ / Approval Request Details"
                titlePreIcon={<CopyOutlined />}
              />
              <Space>
                <Button icon={<EyeOutlined />} onClick={approvalModalHook.showModal}>
                  Check Status
                </Button>
                {canApproveReject && !approvalRouteLoading && (
                  <Button
                    type="primary"
                    icon={<FormOutlined />}
                    onClick={approveRejectModalHook.showModal}
                  >
                    Approve/Reject
                  </Button>
                )}
              </Space>
            </div>
            <Divider style={{ marginTop: 8 }} />
          </div>
        }
        open={modalHook.isModalVisible}
        onCancel={() => {
          cleanup() // Comprehensive cleanup when modal is closed
          modalHook.handleCancel()
        }}
        footer={
          <Row gutter={[8, 8]} style={{ marginTop: 16 }} align="bottom" justify="end">
            <Col>
              <Button
                onClick={() => {
                  cleanup() // Comprehensive cleanup when modal is closed
                  modalHook.handleCancel()
                }}
              >
                Close
              </Button>
            </Col>
          </Row>
        }
        width="85%"
        closable={false}
        className={styles['approval-detail-modal']}
      >
        <div className={styles['modal-content']}>
          {isLoading ? (
            <div className={styles['loading-container']}>
              <Spin size="large" />
              <p>Loading details...</p>
            </div>
          ) : error ? (
            <Result
              status="error"
              title="Error Loading Document Details"
              subTitle="We couldn't retrieve the document information at this time."
              style={{ margin: '24px 0' }}
            />
          ) : documentData ? (
            <div className={styles['detail-section']}>
              <div className={styles['left-box']}>
                <MainDocumentList
                  jobName={documentData.jobName}
                  activeItem={activeItem}
                  onItemClick={handleItemClick}
                  documentId={selectedItem?.documentId}
                  documentType={selectedItem?.documentType}
                  additionalPRJobName={prDataFromPo?.[0]?.jobName}
                  additionalPRId={prDataFromPo?.[0]?.id}
                  onDownload={(id, documentType) => {
                    handleDownload({
                      itemId: id,
                      itemType: 'main',
                      documentType,
                    })
                  }}
                  isDownloadLoading={isDownloadLoading}
                />
                <AttachmentsList
                  attachments={documentData?.documentAttachFiles || []}
                  activeItem={activeItem}
                  onItemClick={handleItemClick}
                  onDownload={(itemId) => handleDownload({ itemId })}
                  // documentType={selectedItem?.documentType}
                  // additionalPRAttachments={prDataFromPo?.[0]?.documentAttachFiles || []}
                  isDownloadLoading={isDownloadLoading}
                />
              </div>
              <div className={styles['right-box']}>
                <div className={styles['pdf-preview']}>
                  <DocumentPreview activeItem={activeItem} previewData={previewData} />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles['empty-state']}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>No Document Data</div>
                    <div>
                      No document data is available for this request. Please select a different
                      document or try again later.
                    </div>
                  </>
                }
              />
            </div>
          )}
        </div>
      </Modal>

      {/* ApprovalModal for checking status */}
      {approvalModalHook.isModalMounted && (
        <ApprovalModal
          isOpen={approvalModalHook.isModalVisible}
          onClose={approvalModalHook.handleCancel}
          afterClose={approvalModalHook.afterClose}
          documentId={selectedItem.documentId}
          documentType={selectedItem.documentType as 'PR' | 'PO' | 'RECEIVE_PR'}
          routeId={selectedItem.routeId}
          showSubmitButton={false}
        />
      )}

      {/* ApproveRejectModal for approving or rejecting documents */}
      {approveRejectModalHook.isModalMounted && (
        <ApproveRejectModal
          modalHook={approveRejectModalHook}
          approvalRoute={approvalRoute}
          isFetching={approvalRouteLoading}
          error={approvalRouteError}
          refreshPreviewSignedPdf={() =>
            handleMainDocumentPreview(selectedItem.documentId, selectedItem.documentType)
          }
        />
      )}
    </>
  )
}

export default ApprovalDetailModal
