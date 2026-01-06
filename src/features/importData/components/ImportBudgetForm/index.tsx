import { DownloadOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Col, Form, Row, Upload, message } from 'antd'

import { useUploadBudgetMutation } from 'api/importDataApi'
import { BudgetType } from 'api/importDataApiType'
import { useNotification } from 'hooks/useNotification'

import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import ContentCard from 'components/ContentCard'
import ImportBudgetList from 'features/importData/components/ImportBudgetList'

import { EXCEL_MIME_TYPES } from 'features/importData/constants'

const ImportBudgetForm = () => {
  const [form] = Form.useForm()
  const [uploadBudget, { isLoading }] = useUploadBudgetMutation()
  const { openNotification } = useNotification()

  const handleImportData = async () => {
    try {
      const values = await form.validateFields()

      const budgetType: BudgetType = {
        id: values.budgetType.value,
        name: values.budgetType.label,
      }
      const file = values.file.file

      // Call API to upload budget data
      await uploadBudget({ file, budgetType }).unwrap()

      // Success
      openNotification({
        type: 'success',
        title: 'Import Budget Successful',
        description: 'Successfully imported budget data',
      })

      // Reset form
      form.resetFields()
    } catch (error: any) {
      // Error handling
      const errorMessage = error?.data?.message || error?.message || 'Failed to import budget data'

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
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col span={24}>
                <Form.Item
                  name="file"
                  rules={[{ required: true, message: 'Please upload a file' }]}
                >
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
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Budget Type/ชนิดงบประมาณ"
                  name="budgetType"
                  rules={[{ required: true, message: 'Please select budget type' }]}
                >
                  <BudgetTypeDropdown allowClear />
                </Form.Item>
              </Col>
              <Col span={16} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleImportData}
                  loading={isLoading}
                >
                  Import Data
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </ContentCard>

      <ImportBudgetList />
    </div>
  )
}
export default ImportBudgetForm
