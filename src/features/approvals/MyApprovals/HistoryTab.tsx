import { useEffect, useState } from 'react'

import { Alert } from 'antd'

import { useGetApprovalQueueHistoryQuery } from 'api/approvalApi'
import { ApprovalQueueItem, DocumentType } from 'api/approvalApi.types'
import usePagination from 'hooks/usePagination'

import ApprovalListCard from 'components/ApprovalListCard'
import ApprovalListSkeleton from 'components/ApprovalListCard/ApprovalListSkeleton'
import CustomPagination from 'components/CustomPagination'
import { TabToggleGroup } from 'components/TabToggleGroup'

interface HistoryTabProps {
  isActive?: boolean
  onItemClick?: (item: ApprovalQueueItem) => void
}

const HistoryTab = ({ isActive, onItemClick }: HistoryTabProps) => {
  // Pagination state
  const [page, setPage] = useState(1)
  const [sizePerPage, setSizePerPage] = useState(10)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('PR')

  // Pagination handlers
  const { handleNextPage, handlePrevPage } = usePagination({
    setPage,
    setSizePerPage,
  })

  // API call for approval history
  const {
    data: approvalHistory,
    isFetching: isLoading,
    error,
    refetch,
  } = useGetApprovalQueueHistoryQuery({
    page: page - 1, // API page is 0-based
    sizePerPage,
    documentTypes: selectedDocumentType,
  })

  // Refetch when tab becomes active
  useEffect(() => {
    if (isActive) {
      refetch()
    }
  }, [isActive, refetch])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ marginBottom: 16 }}>
          <ApprovalListSkeleton />
        </div>
      )
    }

    if (error) {
      return (
        <Alert
          type="error"
          message="Error loading approval history"
          description="Please try again later or contact support if the problem persists."
          banner
        />
      )
    }

    const handleChangeDocumentType = (key: string) => {
      setSelectedDocumentType(key as DocumentType)
    }

    const approvalHistoryData = approvalHistory?.data || []

    return (
      <>
        <div style={{ marginLeft: 8, marginBottom: 8 }}>
          <TabToggleGroup
            isFullWidth={false}
            activeKey={selectedDocumentType as string}
            onChange={handleChangeDocumentType}
            tabs={[
              { key: 'PR', label: 'PR.', disabled: (approvalHistory?.totalPRItems || 0) === 0 },
              { key: 'PO', label: 'PO.', disabled: (approvalHistory?.totalPOItems || 0) === 0 },
              {
                key: 'RECEIVE_PR',
                label: 'Receive PR.',
                disabled: (approvalHistory?.totalReceivePRItems || 0) === 0,
              },
            ]}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <ApprovalListCard
            dataSource={approvalHistoryData}
            emptyText="No approval history found"
            onItemClick={onItemClick}
          />
        </div>
        {approvalHistoryData.length > 0 && (
          <CustomPagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={page}
            disabledPrevious={page === 1}
            disabledNext={(approvalHistoryData.length ?? 0) < sizePerPage}
          />
        )}
      </>
    )
  }

  return renderContent()
}

export default HistoryTab
