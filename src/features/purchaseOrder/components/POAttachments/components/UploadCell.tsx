import { useState } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, FormInstance, Upload } from 'antd'

import { useFileValidation } from 'hooks/useFileValidation'

import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

type Props = {
  formRef: FormInstance
  record: PRAttachmentDataType
}

const UploadCell = ({ formRef, record }: Props) => {
  const [tempUploadingFileName, setTempUploadingFileName] = useState<string>('')
  const { validateFile, fileUploadHint } = useFileValidation()

  const getEditFileName = (record: PRAttachmentDataType) => {
    if (record.fileName && tempUploadingFileName !== '') {
      // NOTE: ถ้ามีการ upload file ใหม่ก็ไม่ต้องแสดงชื่อไฟล์เก่าแล้ว
      return ''
    } // NOTE: กรณีที่ Edit ให้แสดงชื่อไฟล์ปัจจุบัน
    return record.fileName
  }

  return (
    <Form form={formRef}>
      <Form.Item
        name="fileName"
        style={{ margin: 0 }}
        valuePropName="fileName"
        rules={[
          {
            required: true,
            message: `Please upload a file`,
          },
        ]}
      >
        <Upload
          maxCount={1}
          beforeUpload={(file) => {
            const result = validateFile(file)

            if (result !== Upload.LIST_IGNORE) {
              setTempUploadingFileName(file.name)
            }

            return result
          }}
          showUploadList={{
            showRemoveIcon: false,
          }}
        >
          <Button color="primary" variant="outlined" size="small" icon={<UploadOutlined />}>
            Upload New File
          </Button>
          <p style={{ marginTop: 0, fontSize: 10 }}>{fileUploadHint}</p>
        </Upload>
      </Form.Item>
      <div>{getEditFileName(record)}</div>
    </Form>
  )
}

export default UploadCell
