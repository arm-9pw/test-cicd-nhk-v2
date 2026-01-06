import { SearchOutlined } from '@ant-design/icons'
import { Button, Collapse, Form, FormInstance, Row, Space } from 'antd'
import POEnquirySearchForm from './POEnquirySearchForm'

type SearchBoxProps = {
  formRef: FormInstance
  activeKey: string[]                                // ✅ เพิ่ม
  onCollapseChange: (key: string | string[]) => void // ✅ เพิ่ม
  onSearch: () => void
  onReset: () => void
}

const 
SearchBox = ({ formRef, activeKey, onCollapseChange, onSearch, onReset }: SearchBoxProps) => {
  return (
    <Collapse
      size="small"
      expandIconPosition="end"
      activeKey={activeKey}         // ✅ ใช้ activeKey ที่รับมาจาก props
      onChange={onCollapseChange}   // ✅ ใช้ onCollapseChange ที่รับมาจาก props
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
                <POEnquirySearchForm formRef={formRef} />
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