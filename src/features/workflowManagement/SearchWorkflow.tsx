import { ClearOutlined, SearchOutlined, FileSearchOutlined } from '@ant-design/icons'
import { Button, Col, Form, Row, Space } from 'antd'

import { WorkflowQueryParams } from 'api/workflowManangement.types'

import ContentCard from 'components/ContentCard'
import SiteCodeDropdown from 'components/SiteCodeDropdown'

import WorkflowDepartmentDropdown from './components/Dropdown/WorkflowDepartmentDropdown'

interface Props {
  handleSearchWorkflow: (params: WorkflowQueryParams) => void
  handleResetSearch: () => void
}
const SearchWorkflow = ({ handleResetSearch, handleSearchWorkflow }: Props) => {
  const [form] = Form.useForm()
  const siteCode = Form.useWatch('siteCode', form)

  const handleSearch = async () => {
    try {
      const values = await form.validateFields()

      const queryParams: WorkflowQueryParams = {
        siteCode: values.siteCode,
        organizationId: values.departmentName,
      }
  
      handleSearchWorkflow(queryParams)
    } catch (error) {   
      console.error('Validation failed:', error)
    }
  }

  const handleReset = () => {
    form.resetFields()
    handleResetSearch()
  }

  return (
  <ContentCard style={{ marginTop: 16 }} title={"Workflow Management"} titlePreIcon={<FileSearchOutlined />}>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12} lg={12} xl={8}>
            <Form.Item label="Site Code" name="siteCode">
              <SiteCodeDropdown
                onChange={() => {
                  form.resetFields(['departmentName'])
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={12} xl={8}>
            <WorkflowDepartmentDropdown
              siteCode={siteCode}
              formName="departmentName"
              formLabel="Department Name"
            />
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: 16 }}>
          <Space>
            <Button icon={<ClearOutlined />} onClick={handleReset}>
              Clear
            </Button>
            <Button
              type="primary"   
              htmlType="submit"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Space>
        </Row>
      </Form>
    </ContentCard>
  )
}
export default SearchWorkflow
