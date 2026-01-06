import { SearchOutlined } from '@ant-design/icons'
import { Button, Collapse, Form, Row, Space, FormInstance } from 'antd'
import PREnquirySearchForm from './PREnquirySearchForm'

type SearchBoxProps = {
  formRef: FormInstance
  activeKey: string[]
  onCollapseChange: (key: string | string[]) => void
  onSearch: () => void
  onReset: () => void
}

const SearchBox = ({ formRef, activeKey, onCollapseChange, onSearch, onReset }: SearchBoxProps) => {
  return (
    <Collapse size="small" expandIconPosition="end" activeKey={activeKey} onChange={onCollapseChange}
      items={[
        {
          key: '1',
          label: (
            <Space>
              <SearchOutlined />
              Search/ค้นหา
            </Space>
          ),
          children: (
            <div>
              <Form labelWrap form={formRef} layout="vertical">
                <PREnquirySearchForm formRef={formRef} />
                <Row justify="end" style={{ marginTop: 6 }}>
                  <Space>
                    <Button onClick={onReset}>Reset</Button>
                    <Button type="primary" onClick={onSearch}>Search</Button>
                  </Space>
                </Row>
              </Form>
            </div>
          ),
        },
      ]}
    />
  )
}

export default SearchBox