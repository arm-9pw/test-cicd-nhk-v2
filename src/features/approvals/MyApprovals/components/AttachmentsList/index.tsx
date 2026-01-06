import React from 'react'

import { PaperClipOutlined } from '@ant-design/icons'
import { Divider, List } from 'antd'

import styles from './styles.module.css'

import { DocumentType } from 'api/approvalApi.types'
import { PRAttachmentDataWOKeyType } from 'api/prApi.types'

import HeaderTitle from 'components/HeaderTitle'

import { ActiveItemType } from '../../types'
import DocumentListItem from '../DocumentListItem'

interface AttachmentsListProps {
  attachments: PRAttachmentDataWOKeyType[] // Replace with proper type when available
  activeItem: ActiveItemType | null
  onItemClick: (id: string, type: 'main' | 'attachment', documentType: DocumentType) => void
  onDownload: (id: string, documentType: DocumentType) => void
  // documentType: DocumentType
  // additionalPRAttachments?: PRAttachmentDataWOKeyType[]
  isDownloadLoading: boolean
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({
  attachments = [],
  activeItem,
  onItemClick,
  onDownload,
  // documentType,
  // additionalPRAttachments,
  isDownloadLoading,
}) => {
  // Split attachments by domain in a single loop
  const { purchaseOrderAttachments, otherAttachments } = attachments.reduce<{
    purchaseOrderAttachments: PRAttachmentDataWOKeyType[]
    otherAttachments: PRAttachmentDataWOKeyType[]
  }>(
    (acc, item) => {
      if (item.domain === 'PURCHASE_ORDER') {
        acc.purchaseOrderAttachments.push(item)
      } else {
        acc.otherAttachments.push(item)
      }
      return acc
    },
    { purchaseOrderAttachments: [], otherAttachments: [] },
  )

  return (
    <div style={{ marginTop: 32 }}>
      <HeaderTitle
        title={`ไฟล์แนบ / Attachments (${attachments.length || 0})`}
        titlePreIcon={<PaperClipOutlined />}
      />
      <Divider style={{ margin: '16px 0' }} />

      {/* Purchase Order Attachments */}
      {purchaseOrderAttachments.length > 0 && (
        <>
          <h4 style={{ marginBottom: 8 }}>PO.</h4>
          <List
            className={styles['attachments-list']}
            dataSource={purchaseOrderAttachments}
            renderItem={(item) => (
              <DocumentListItem
                item={item}
                onDownload={onDownload}
                onItemClick={onItemClick}
                isActive={activeItem?.id === (item.id || '') && activeItem?.type === 'attachment'}
                itemType="attachment"
                documentType="PO"
                isDownloadLoading={isDownloadLoading}
              />
            )}
          />
        </>
      )}

      {/* Other Attachments */}
      {otherAttachments.length > 0 && (
        <>
          <h4 style={{ marginBottom: 8 }}>PR.</h4>
          <List
            className={styles['attachments-list']}
            dataSource={otherAttachments}
            renderItem={(item) => (
              <DocumentListItem
                item={item}
                onDownload={onDownload}
                onItemClick={onItemClick}
                isActive={activeItem?.id === (item.id || '') && activeItem?.type === 'attachment'}
                itemType="attachment"
                documentType="PR"
                isDownloadLoading={isDownloadLoading}
              />
            )}
          />
        </>
      )}

      {purchaseOrderAttachments.length <= 0 && otherAttachments.length <= 0 && (
        <List className={styles['attachments-list']} dataSource={[]} />
      )}

      {/* Additional PR Attachments */}
      {/* {additionalPRAttachments && additionalPRAttachments.length > 0 && (
        <>
          <h4 style={{ marginBottom: 8 }}>PR.</h4>
          <List
            className={styles['attachments-list']}
            dataSource={additionalPRAttachments}
            renderItem={(item) => (
              <DocumentListItem
                item={item}
                onDownload={onDownload}
                onItemClick={onItemClick}
                isActive={activeItem?.id === (item.id || '') && activeItem?.type === 'attachment'}
                itemType="attachment"
                documentType="PR"
                isDownloadLoading={isDownloadLoading}
              />
            )}
          />
        </>
      )} */}
    </div>
  )
}

export default AttachmentsList
