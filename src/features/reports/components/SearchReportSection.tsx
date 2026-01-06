import { ClearOutlined, FileSearchOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Form, Row, Space } from 'antd'

import ContentCard from 'components/ContentCard'
import SiteWithPermissionDropdown from 'components/SiteWithPermissionDropdown'

// Define interface for form values
interface SearchFormValues {
  reportName?: string
  siteCode?: string
}

type SearchReportSectionProps = {
  loading: boolean
  reportName: string
  onSearchReport: (siteCode: string | undefined) => void
  onResetSearch: () => void
}

const SearchReportSection = ({
  loading,
  reportName,
  onSearchReport,
  onResetSearch,
}: SearchReportSectionProps) => {
  const [form] = Form.useForm()

  const handleSearch = (values: SearchFormValues) => {
    onSearchReport(values.siteCode)
  }

  const handleClear = () => {
    form.resetFields()
    onResetSearch()
  }

  return (
    <ContentCard style={{ marginTop: 16 }} title={reportName} titlePreIcon={<FileSearchOutlined />}>
      <div>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12} lg={12} xl={8}>
              <Form.Item label="Site/โรงงาน" name="siteCode">
                <SiteWithPermissionDropdown allowClear />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" style={{ marginTop: 16 }}>
            <Space>
              <Button onClick={handleClear} icon={<ClearOutlined />}>
                Clear
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                Search
              </Button>
            </Space>
          </Row>
        </Form>
      </div>
    </ContentCard>
  )
}

export default SearchReportSection
