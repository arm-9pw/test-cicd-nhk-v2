import { useMemo, useState } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Upload } from 'antd'

import { useGetDocumentTypesQuery } from 'api/masterApi'
import { useFileValidation } from 'hooks/useFileValidation'

import CustomDatePicker from 'components/CustomDatePicker'
import DocumentTypeDropdown from 'components/DocumentTypeDropdown'
import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { formatDisplayDate } from 'utils/dateHelpers'
import { transformArrayToObject } from 'utils/generalHelpers'

const EditableCell: React.FC<{
  editing: boolean
  dataIndex: string
  title: string
  inputType: 'text' | 'select' | 'date' | 'upload'
  record: PRAttachmentDataType
  index: number
  children: React.ReactNode
  disabled?: boolean
}> = ({ editing, dataIndex, title, inputType, record, children, disabled, ...restProps }) => {
  const { validateFile } = useFileValidation()
  const [tempUploadingFileName, setTempUploadingFileName] = useState<string>('')
  const { data = [] } = useGetDocumentTypesQuery({ domain: 'PR' })
  const documentTypelabel = useMemo(() => transformArrayToObject(data), [data])

  const getEditFileName = (record: PRAttachmentDataType) => {
    if (record.fileName && tempUploadingFileName) {
      // NOTE: ถ้ามีการ upload file ใหม่ก็ไม่ต้องแสดงชื่อไฟล์เก่าแล้ว
      return ''
    } // NOTE: กรณีที่ Edit ให้แสดงชื่อไฟล์ปัจจุบัน
    return record.fileName
  }

  let inputNode = children
  const isAdding = record?.key === 'new'
  const formItemName = isAdding ? `newItem-${dataIndex}` : dataIndex

  if (!editing && dataIndex === 'documentType') {
    inputNode = <span>{documentTypelabel[record.documentType]}</span>
  }

  if (dataIndex === 'documentDate' && !editing && !isAdding) {
    inputNode = <span>{formatDisplayDate(record.documentDate)}</span>
  }

  if (editing || isAdding) {
    switch (inputType) {
      case 'select':
        inputNode = (
          <Form.Item
            name={formItemName}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please select ${title}` }]}
          >
            <DocumentTypeDropdown domain="PR" />
          </Form.Item>
        )
        break
      case 'date':
        inputNode = (
          <Form.Item
            name={formItemName}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please select ${title}` }]}
          >
            <CustomDatePicker style={{ width: '100%' }} format="DD/MMM/YYYY" disabled={disabled} />
          </Form.Item>
        )
        break
      case 'upload':
        inputNode = (
          <>
            <Form.Item name={formItemName} style={{ margin: 0 }} valuePropName={formItemName}>
              <Upload
                maxCount={1}
                beforeUpload={(file) => {
                  const result = validateFile(file)

                  if (result !== Upload.LIST_IGNORE) {
                    setTempUploadingFileName(file.name)
                  }

                  return result
                }}
              >
                <Button color="primary" variant="outlined" size="small" icon={<UploadOutlined />}>
                  Upload New File
                </Button>
              </Upload>
            </Form.Item>
            {getEditFileName(record)}
          </>
        )
        break
      default:
        inputNode = (
          <Form.Item
            name={formItemName}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please input ${title}` }]}
          >
            <Input />
          </Form.Item>
        )
    }
  }

  return <td {...restProps}>{inputNode}</td>
}

export default EditableCell
