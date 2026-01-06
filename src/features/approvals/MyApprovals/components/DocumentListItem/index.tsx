import React from 'react'

import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons'
import { Button, List } from 'antd'

import styles from './styles.module.css'

import { DocumentType } from 'api/approvalApi.types'

import { formatFileSize } from 'utils/generalHelpers'

interface DocumentListItemProps {
  item: {
    id?: string
    name?: string
    fileName?: string
    type?: string
    category?: string
    mimeType?: string
    fileSize?: string
  }
  onDownload: (id: string, documentType: DocumentType) => void
  onItemClick: (itemId: string, itemType: 'main' | 'attachment', documentType: DocumentType) => void
  isActive: boolean
  itemType: 'main' | 'attachment'
  documentType: DocumentType
  isDownloadLoading: boolean
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  item,
  onDownload,
  onItemClick,
  isActive,
  itemType,
  documentType,
  isDownloadLoading,
}) => {
  // Handle different property names
  const documentName = item.name || item.fileName || 'Unknown Document'
  const documentId = item.id || ''

  // Handle different meta formats
  const getMeta = () => {
    if (item.type && item.category) {
      // Main document format
      return `${item.type} • ${item.category}`
    } else if (item.mimeType) {
      // Attachment document format
      return `${item.mimeType} • ${formatFileSize(item.fileSize || '0')}`
    }
    return ''
  }

  const handleItemClick = () => {
    onItemClick(documentId, itemType, documentType)
  }

  const handleDownloadClick = (e: React.MouseEvent) => {
    // Prevent item click when download button is clicked
    e.stopPropagation()
    onDownload(documentId, documentType)
  }

  return (
    <List.Item className={styles['document-item']} data-active={isActive} onClick={handleItemClick}>
      <div className={styles['document-content']}>
        <div className={styles['document-icon']}>
          <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
        </div>
        <div className={styles['document-info']}>
          <div className={styles['document-name']}>{documentName}</div>
          <div className={styles['document-meta']}>{getMeta()}</div>
        </div>
        <Button
          type="text"
          icon={<DownloadOutlined />}
          onClick={handleDownloadClick}
          className={styles['download-button']}
          loading={isDownloadLoading}
          disabled={isDownloadLoading}
        />
      </div>
    </List.Item>
  )
}

export default DocumentListItem
