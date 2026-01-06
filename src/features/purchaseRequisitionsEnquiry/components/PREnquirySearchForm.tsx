import { useEffect, useState } from 'react'

import { Col, DatePicker, Form, FormInstance, Input, Row } from 'antd'

import { SiteType } from 'api/employeeApi.types'

import DocumentStatusDropdown from 'components/DocumentStatusDropdown'
import SearchSectionDropdown from 'components/SearchSectionDropdown'
import SiteCodeDropdown from 'components/SiteCodeDropdown'
import SearchBudgetDropdown from 'features/purchaseOrdersEnquiry/components/SearchFields/SearchBudgetDropdown'

import { gutter } from 'constants/index'

const { RangePicker } = DatePicker

type PREnquirySearchFormProps = {
  formRef: FormInstance
}

const PREnquirySearchForm = ({ formRef }: PREnquirySearchFormProps) => {
  const [siteCode, setSiteCode] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      formRef.resetFields()
    }
  }, [formRef])

  return (
    <>
      <Row gutter={gutter}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="PR. No./เลขที่ใบขอสั่งซื้อ" name="prNo">
            <Input placeholder="Enter PR number" allowClear />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="PR. Date/วันที่ขอสั่งซื้อ" name="prDate">
            <RangePicker style={{ width: '100%' }} allowClear />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <DocumentStatusDropdown formName="purchaseStatus" formLabel="PR. Status/สถานะใบขอสั่งซื้อ" />
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="Job Name/ชื่องาน" name="jobName">
            <Input placeholder="Enter job name" allowClear />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <SearchBudgetDropdown formName="budgetId" formLabel="Budget Code/รหัสงบประมาณ" />
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8} />

        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="Site/สาขา" name="requesterSite">
            <SiteCodeDropdown
              allowClear
              onChange={(_: unknown, option) => {
                const site = option as SiteType
                setSiteCode(site?.siteCode)
                formRef.resetFields(['requesterSectionId'])
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <SearchSectionDropdown siteCode={siteCode} formName="requesterSectionId" formLabel="Section/แผนก" />
        </Col>
      </Row>
    </>
  )
}

export default PREnquirySearchForm