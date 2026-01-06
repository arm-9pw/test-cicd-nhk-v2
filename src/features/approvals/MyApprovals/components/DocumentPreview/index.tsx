import React from 'react'

import { Alert, Result, Spin } from 'antd'

import styles from './styles.module.css'

import { PreviewDataType } from '../../types'

interface DocumentPreviewProps {
  activeItem: {
    id: string
    type: 'main' | 'attachment'
  } | null
  previewData: PreviewDataType
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ activeItem, previewData }) => {
  const renderLoadingSpinner = () => (
    <div className={styles['preview-container']}>
      <div className={styles['preview-loading-overlay']}>
        <div className={styles['preview-loading']}>
          <Spin size="large" />
          <p>Loading preview...</p>
        </div>
      </div>
    </div>
  )

  const renderMainPreview = () => (
    <div className={styles['pdf-preview-container']}>
      {previewData.url && previewData.type === 'pdf' && (
        <iframe src={previewData.url} className={styles['preview-pdf']} title="Document preview" />
      )}
      {!previewData.isLoading && !previewData.url && (
        <Alert
          message="Preview Not Available"
          description="The signed document preview is not available right now."
          type="info"
          showIcon
        />
      )}
      {previewData.isLoading && renderLoadingSpinner()}
    </div>
  )

  if (previewData.error) {
    return (
      <div className={styles['preview-error']}>
        {/* <Alert message="Preview Error" description={previewData.error} type="error" showIcon /> */}
        <Result
          status="error"
          title="Preview Error"
          subTitle={previewData.error || 'Please try again later.'}
        />
      </div>
    )
  }

  if (activeItem?.type === 'main') {
    return renderMainPreview()
  }

  if (activeItem?.type === 'attachment') {
    if (previewData.isLoading) {
      return renderLoadingSpinner()
    }

    if (previewData.url) {
      if (previewData.type === 'image') {
        return (
          <div className={styles['image-preview-box']}>
            <img
              src={previewData.url}
              alt="Attachment preview"
              className={styles['preview-image']}
            />
          </div>
        )
      } else if (previewData.type === 'pdf') {
        return (
          <div className={styles['pdf-preview-container']}>
            <iframe src={previewData.url} className={styles['preview-pdf']} title="PDF Preview" />
          </div>
        )
      }
    }
  }

  // Default fallback
  return renderMainPreview()
}

export default DocumentPreview
