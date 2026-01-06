import { DownloadOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, Upload, message } from 'antd'

import { useUploadEmployeeMutation } from 'api/importDataApi'
import { useNotification } from 'hooks/useNotification'

import ContentCard from 'components/ContentCard'

import { EXCEL_MIME_TYPES } from 'features/importData/constants'

function ImportEmployeeForm() {
  const [form] = Form.useForm()
  const [uploadEmployee, { isLoading }] = useUploadEmployeeMutation()
  const { openNotification } = useNotification()

  const handleImportData = async () => {
    try {
      const values = await form.validateFields()

      const file = values.file?.file
      const password = values.passcode

      // Call API to upload employee data
      await uploadEmployee({ file, password }).unwrap()

      // Success
      openNotification({
        type: 'success',
        title: 'Import Employee Successful',
        description: 'Successfully imported employee data',
      })

      // Reset form
      form.resetFields()
    } catch (error: any) {
      // Error handling
      const errorMessage =
        error?.data?.message || error?.message || 'Failed to import employee data'

      openNotification({
        type: 'error',
        title: 'Import Failed',
        description: errorMessage,
      })
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <ContentCard>
        <div style={{ padding: '8px' }}>
          <Form form={form}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Form.Item name="file" rules={[{ required: true, message: 'Please upload a file' }]}>
                <Upload
                  maxCount={1}
                  beforeUpload={(file) => {
                    // Validate Excel file type
                    const isExcel = EXCEL_MIME_TYPES.includes(file.type)

                    if (!isExcel) {
                      message.error('Please upload Excel file only (.xls or .xlsx)')
                      return Upload.LIST_IGNORE
                    }
                    return false
                  }}
                >
                  <Button type="default" icon={<FileAddOutlined />}>
                    Add File
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="passcode"
                rules={[{ required: true, message: 'Please enter password' }]}
              >
                <Space>
                  <Input.Password placeholder="File Password" disabled={isLoading} />
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleImportData}
                    loading={isLoading}
                  >
                    Import Data
                  </Button>
                </Space>
              </Form.Item>
            </Space>
          </Form>
        </div>
      </ContentCard>
    </div>
  )
}

export default ImportEmployeeForm
