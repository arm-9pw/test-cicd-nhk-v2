import React from 'react'

import { FileTextOutlined } from '@ant-design/icons'
import { Divider, List } from 'antd'

import { DocumentType } from 'api/approvalApi.types'

import HeaderTitle from 'components/HeaderTitle'

import { ActiveItemType } from '../../types'
import DocumentListItem from '../DocumentListItem'

interface MainDocumentListProps {
  jobName: string
  activeItem: ActiveItemType | null
  onItemClick: (id: string, type: 'main' | 'attachment', documentType: DocumentType) => void
  onDownload: (id: string, documentType: DocumentType) => void
  additionalPRJobName?: string | null
  additionalPRId?: string | null
  documentId?: string | null
  documentType: DocumentType
  isDownloadLoading: boolean
}

const MainDocumentList: React.FC<MainDocumentListProps> = ({
  jobName,
  activeItem,
  onItemClick,
  onDownload,
  additionalPRJobName,
  additionalPRId,
  documentId,
  documentType,
  isDownloadLoading,
}) => {
  return (
    <div>
      <HeaderTitle title="เอกสารหลัก / Main Document" titlePreIcon={<FileTextOutlined />} />
      <Divider style={{ margin: '16px 0' }} />
      {additionalPRId && <h4 style={{ marginBottom: 8 }}>PO.</h4>}
      <List
        dataSource={[
          {
            id: documentId || '',
            name: jobName,
            type: 'PDF',
            category: 'Main Document',
          },
        ]}
        renderItem={(item) => (
          <DocumentListItem
            item={item}
            onDownload={onDownload}
            onItemClick={onItemClick}
            isActive={activeItem?.id === item.id && activeItem?.type === 'main'}
            itemType="main"
            documentType={documentType}
            isDownloadLoading={isDownloadLoading}
          />
        )}
      />
      {additionalPRId && (
        <>
          <h4 style={{ marginBottom: 8 }}>PR.</h4>
          <List
            dataSource={[
              {
                id: additionalPRId || '',
                name: additionalPRJobName || '',
                type: 'PDF',
                category: 'Main Document',
              },
            ]}
            renderItem={(item) => (
              <DocumentListItem
                item={item}
                onDownload={onDownload}
                onItemClick={onItemClick}
                isActive={activeItem?.id === item.id && activeItem?.type === 'main'}
                itemType="main"
                documentType="PR"
                isDownloadLoading={isDownloadLoading}
              />
            )}
          />
        </>
      )}
    </div>
  )
}

export default MainDocumentList
