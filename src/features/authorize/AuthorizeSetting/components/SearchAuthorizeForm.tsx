import { ClearOutlined, FileSearchOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, DatePicker, Form, Row, Space } from 'antd'
import dayjs from 'dayjs'

import ContentCard from 'components/ContentCard'

import { TAB_KEYS } from '../constants'
import { SearchFilters } from '../types'

import DelegatePeopleDropdown from './DelegatePeopleDropdown'

type SearchReportSectionProps = {
  loading: boolean
  onSearchDelegations: (values: SearchFilters) => void
  onResetSearch: () => void
  delegationType: string
}

const SearchAuthorizeForm = ({
  delegationType,
  onSearchDelegations,
  onResetSearch,
  loading,
}: SearchReportSectionProps) => {
  const [form] = Form.useForm()

  // Default date range - same as hook defaults
  const today = dayjs()
  const next30Days = dayjs().add(30, 'day')
  const defaultDateRange = [today.startOf('day'), next30Days.endOf('day')]

  const handleSearch = (values: SearchFilters) => {
    onSearchDelegations(values)
  }

  const handleClear = () => {
    form.resetFields()
    onResetSearch()
  }

  return (
    <ContentCard title="Authorize Settings" titlePreIcon={<FileSearchOutlined />}>
      <div>
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="Authorize Period"
                name={['authorizePeriod']}
                rules={[{ required: true }]}
                initialValue={defaultDateRange}
              >
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  placeholder={['Authorize start date', 'Authorize end date']}
                />
              </Form.Item>
            </Col>

            {delegationType === TAB_KEYS.DELEGATE_TO && (
              <Col xs={24} md={12} lg={12} xl={12}>
                <Form.Item label="Active Authorize" name="activeOnly" valuePropName="checked">
                  <Checkbox>Active Authorize</Checkbox>
                </Form.Item>
              </Col>
            )}

            {/* <Col xs={24} md={12} lg={12} xl={12}>
              <Form.Item label="Delegation Type" name="delegationType" initialValue={'delegateTo'}>
                <Select
                  placeholder="Select delegation type"
                  options={[
                    { label: 'Delegate To', value: true },
                    { label: 'Delegator', value: false },
                  ]}
                />
              </Form.Item>
            </Col> */}

            {delegationType === TAB_KEYS.DELEGATE_TO && (
              <Col xs={24} md={12} lg={12} xl={12}>
                <Form.Item label="Authorize Person" name="delegatePersonId">
                  <DelegatePeopleDropdown />
                </Form.Item>
              </Col>
            )}
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

export default SearchAuthorizeForm
