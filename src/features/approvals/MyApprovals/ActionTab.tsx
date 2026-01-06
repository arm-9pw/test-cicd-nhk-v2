import { useEffect, useState } from 'react'

import { Alert } from 'antd'

import { useGetApprovalQueuePendingQuery } from 'api/approvalApi'
import { ApprovalQueueItem, DocumentType } from 'api/approvalApi.types'
import usePagination from 'hooks/usePagination'

import ApprovalListCard from 'components/ApprovalListCard'
import ApprovalListSkeleton from 'components/ApprovalListCard/ApprovalListSkeleton'
import CustomPagination from 'components/CustomPagination'
import { TabToggleGroup } from 'components/TabToggleGroup'

interface ActionTabProps {
  isActive?: boolean
  onItemClick?: (item: ApprovalQueueItem) => void
  onTotalItemsChange?: (total: number) => void
}

const ActionTab = ({ isActive, onItemClick, onTotalItemsChange }: ActionTabProps) => {
  // Pagination state
  const [page, setPage] = useState(1)
  const [sizePerPage, setSizePerPage] = useState(10)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('PR')

  // Pagination handlers
  const { handleNextPage, handlePrevPage } = usePagination({
    setPage,
    setSizePerPage,
  })

  // API call for pending approvals
  const {
    data: approvalQueue,
    isFetching: isLoading,
    error,
    refetch,
  } = useGetApprovalQueuePendingQuery(
    {
      page: page - 1, // API page is 0-based
      sizePerPage,
      documentTypes: selectedDocumentType,
    },
    // { pollingInterval: 3000, skipPollingIfUnfocused: true },
  )

  // Refetch when tab becomes active
  useEffect(() => {
    if (isActive) {
      refetch()
    }
  }, [isActive, refetch])

  // Notify parent of totalItems changes
  useEffect(() => {
    if (approvalQueue?.totalItems !== undefined && onTotalItemsChange) {
      onTotalItemsChange(approvalQueue.totalItems)
    }
  }, [approvalQueue?.totalItems, onTotalItemsChange])

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
          message="Error loading approvals"
          description="Please try again later or contact support if the problem persists."
          banner
        />
      )
    }

    // FIXME: remove this when backend returns sorted data
    // Sort approval queue by documentDate (most recent first)
    // const sortedApprovalQueue = [...(approvalQueue.data || [])].sort((a, b) => {
    //   return new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
    // })

    const handleChangeDocumentType = (key: string) => {
      setSelectedDocumentType(key as DocumentType)
    }

    const approvalQueueData = approvalQueue?.data || []

    return (
      <>
        <div style={{ marginLeft: 8, marginBottom: 8 }}>
          <TabToggleGroup
            isFullWidth={false}
            activeKey={selectedDocumentType as string}
            onChange={handleChangeDocumentType}
            tabs={[
              {
                key: 'PR',
                label: 'PR.',
                count: approvalQueue?.totalPRItems || 0,
                disabled: (approvalQueue?.totalPRItems || 0) === 0,
              },
              {
                key: 'PO',
                label: 'PO.',
                count: approvalQueue?.totalPOItems || 0,
                disabled: (approvalQueue?.totalPOItems || 0) === 0,
              },
              {
                key: 'RECEIVE_PR',
                label: 'Receive PR.',
                count: approvalQueue?.totalReceivePRItems || 0,
                disabled: (approvalQueue?.totalReceivePRItems || 0) === 0,
              },
            ]}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <ApprovalListCard
            dataSource={approvalQueueData}
            emptyText="No pending approvals found"
            onItemClick={onItemClick}
          />
        </div>
        {approvalQueueData.length > 0 && (
          <CustomPagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={page}
            disabledPrevious={page === 1}
            disabledNext={(approvalQueueData.length ?? 0) < sizePerPage}
          />
        )}
      </>
    )
  }

  return renderContent()
}

export default ActionTab
