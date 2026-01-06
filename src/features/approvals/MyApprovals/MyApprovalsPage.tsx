import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Tabs } from 'antd'

import styles from './MyApprovalsPage.module.css'

import { useUpdateReadStatusMutation } from 'api/approvalApi'
import { ApprovalQueueItem, DocumentType } from 'api/approvalApi.types'
import useCustomModal from 'hooks/useCustomModal'

import PageHeader from 'components/PageHeader'

import ActionTab from './ActionTab'
import HistoryTab from './HistoryTab'
import ApprovalDetailModal from './components/ApprovalDetailModal'

const MyApprovalsPage = () => {
  const [activeTab, setActiveTab] = useState('action')
  const [actionTabCount, setActionTabCount] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<{
    documentId: string
    documentType: DocumentType
    routeId: string
  } | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const modalHook = useCustomModal()
  const [updateReadStatus] = useUpdateReadStatusMutation()

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  const handleActionTabCountChange = (total: number) => {
    setActionTabCount(total)
  }

  const handleItemClick = (item: ApprovalQueueItem) => {
    // Update read status only if not already read
    if (!item.isRead) {
      updateReadStatus({
        routeId: item.routeId,
        stepId: item.stepId,
        isRead: true,
      })
    }

    // Just set the minimal info needed for the modal to fetch data
    setSelectedItem({
      documentId: item.documentId.toString(),
      documentType: item.documentType,
      routeId: item.routeId,
    })
    modalHook.showModal()

    // Update URL with documentId, documentType, and routeId
    setSearchParams({
      documentId: item.documentId.toString(),
      documentType: item.documentType,
      routeId: item.routeId,
    })
  }

  const handleModalClose = () => {
    modalHook.handleCancel()
    setSelectedItem(null)

    // Clear search params
    setSearchParams({})
  }

  // Auto-open modal when URL contains documentId, documentType, and routeId
  useEffect(() => {
    const documentId = searchParams.get('documentId')
    const documentType = searchParams.get('documentType')
    const routeId = searchParams.get('routeId')

    if (documentId && documentType && routeId && !modalHook.isModalVisible) {
      // Simply set the selected item and open modal
      // The modal will handle fetching the data
      setSelectedItem({
        documentId,
        documentType: documentType as DocumentType,
        routeId
      })
      modalHook.showModal()
    }
  }, [searchParams, modalHook])

  // Override modal close to handle URL cleanup
  const modalHookWithUrlHandling = {
    ...modalHook,
    handleCancel: handleModalClose,
  }

  return (
    <>
      <PageHeader pageTitle="My Approvals" breadcrumbItems={[{ title: 'My Approvals' }]} />
      <div style={{ marginTop: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: 'action',
              label: (
                <>
                  Action
                  {actionTabCount > 0 && (
                    <span className={styles['count-badge']}>({actionTabCount})</span>
                  )}
                </>
              ),
              children: (
                <ActionTab
                  isActive={activeTab === 'action'}
                  onItemClick={handleItemClick}
                  onTotalItemsChange={handleActionTabCountChange}
                />
              ),
            },
            {
              key: 'history',
              label: `History`,
              children: (
                <HistoryTab isActive={activeTab === 'history'} onItemClick={handleItemClick} />
              ),
            },
          ]}
          type="card"
          className={styles['myApprovals-tabs']}
        />
      </div>

      {modalHook.isModalMounted && selectedItem && (
        <ApprovalDetailModal modalHook={modalHookWithUrlHandling} selectedItem={selectedItem} />
      )}
    </>
  )
}

export default MyApprovalsPage
