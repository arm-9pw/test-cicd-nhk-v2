import { useState } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, FormInstance, Upload, message } from 'antd'

import { AttachmentFileType } from 'api/attachmentApi.types'

type Props = {
  formRef: FormInstance
  record: AttachmentFileType
  disabled: boolean
}

const UploadCell = ({ formRef, record, disabled }: Props) => {
  const [tempUploadingFileName, setTempUploadingFileName] = useState<string>('')

  const getEditFileName = (record: AttachmentFileType) => {
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
        rules={[{ required: true, message: 'Please upload a file' }]}
      >
        <Upload
          maxCount={1}
          beforeUpload={(file) => {
            const isLt10M = file.size / 1024 / 1024 < 10
            if (!isLt10M) {
              message.error('File must be smaller than 10MB!')
              return Upload.LIST_IGNORE
            }
            setTempUploadingFileName(file.name)
            return false
          }}
        >
          <Button
            color="primary"
            variant="outlined"
            size="small"
            icon={<UploadOutlined />}
            disabled={disabled}
          >
            Upload New File
          </Button>
        </Upload>
      </Form.Item>
      <div>{getEditFileName(record)}</div>
    </Form>
  )
}

export default UploadCell
