import { useEffect } from 'react'

import { Form, Table } from 'antd'

import { AttachmentFileType } from 'api/attachmentApi.types'

import { DOMAINS, PAGE_MODE } from 'constants/index'

import { columns } from './columns'
import useDocumentAttachment from './hooks/useDocumentAttachment'

type Props = {
  isDisabledForm: boolean
  fileList: AttachmentFileType[]
  setFileList: React.Dispatch<React.SetStateAction<AttachmentFileType[]>>
  refId?: string
  domain: (typeof DOMAINS)[keyof typeof DOMAINS]
  defaultDocumentType?: string
  isDisabledDocumentType?: boolean
}

const DocumentAttachment = ({
  isDisabledForm,
  fileList,
  setFileList,
  refId,
  domain,
  defaultDocumentType,
  isDisabledDocumentType = false,
}: Props) => {
  const [newFormRef] = Form.useForm()
  const [editFormRef] = Form.useForm()
  const attachmentHook = useDocumentAttachment({
    mode: PAGE_MODE.CREATE,
    newFormRef,
    editFormRef,
    domain,
    setFileList,
    refId,
    defaultDocumentType,
  })

  const newRow: AttachmentFileType = {
    key: 'new',
    domain,
    documentType: '',
    documentNo: '',
    documentDate: '',
    fileName: '',
    isUse: true,
  }

  useEffect(() => {
    if (defaultDocumentType) {
      newFormRef.setFieldsValue({ documentType: defaultDocumentType })
    }
  }, [newFormRef, defaultDocumentType])

  return (
    <div>
      <Table
        sticky
        bordered
        size="small"
        tableLayout="auto"
        style={{ marginTop: 0 }}
        columns={columns({
          domain,
          newFormRef,
          editFormRef,
          isDisabledDocumentType,
          isDisabledForm,
          editingKey: attachmentHook.editingKey,
          onAddNewFile: attachmentHook.onAddNewFile,
          onDownloadFile: attachmentHook.onDownloadFile,
          onEditFile: attachmentHook.onEditFile,
          onCancelEditing: attachmentHook.onCancelEditing,
          onSaveEditingRecord: attachmentHook.onSaveEditingRecord,
          onDeleteFile: attachmentHook.onDeleteFile,
        })}
        dataSource={isDisabledForm ? fileList : [...fileList, newRow]}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  )
}

export default DocumentAttachment
