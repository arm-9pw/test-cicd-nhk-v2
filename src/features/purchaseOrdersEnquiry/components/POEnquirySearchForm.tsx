import { useEffect, useState } from 'react'

import { Col, DatePicker, Form, FormInstance, Input, Row } from 'antd'

import { SiteType } from 'api/employeeApi.types'

import CustomDatePicker from 'components/CustomDatePicker'
import DocumentStatusDropdown from 'components/DocumentStatusDropdown'
import SearchSectionDropdown from 'components/SearchSectionDropdown'
import SiteCodeDropdown from 'components/SiteCodeDropdown'
import SiteDeliveryDropdown from './SearchFields/SiteDeliveryDropdown'
import SupplierCodeDropdown from 'features/purchaseOrder/components/SupplierCodeDropdown'

import { gutter } from 'constants/index'

import SearchBudgetDropdown from './SearchFields/SearchBudgetDropdown'

const { RangePicker } = DatePicker

type POEnquirySearchFormProps = {
  formRef: FormInstance
}

const POEnquirySearchForm = ({ formRef }: POEnquirySearchFormProps) => {
  const [siteCode, setSiteCode] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      formRef.resetFields()
    }
  }, [formRef])

  return (
    <Row gutter={gutter}>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item label="PO. No./เลขที่ใบสั่งซื้อ" name="poNo">
          <Input placeholder="Enter PO number" allowClear />
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item label="PO. Date/วันที่สั่งซื้อ" name="poDate">
          <RangePicker style={{ width: '100%' }} allowClear />
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <DocumentStatusDropdown formName="poStatus" formLabel="PO. Status/สถานะใบสั่งซื้อ" />
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item label="PR. No./เลขที่ใบขอสั่งซื้อ" name="prNo">
          <Input placeholder="Enter PR number" allowClear />
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item label="Job Name/ชื่องาน" name="jobName">
          <Input placeholder="Enter job name" allowClear />
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <SearchBudgetDropdown formName="budgetId" formLabel="Budget Code/รหัสงบประมาณ" />
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item label="Site/สาขา" name="purchaserSite">
          <SiteCodeDropdown
            allowClear
            onChange={(_: unknown, option) => {
              const site = option as SiteType
              setSiteCode(site?.siteCode)
              formRef.resetFields(['purchaserSectionId'])
            }}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <SearchSectionDropdown
          siteCode={siteCode}
          formName="purchaserSectionId"
          formLabel="Section/แผนก"
        />
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <SupplierCodeDropdown
          formName="supplierId"
          formLabel="Supplier Name/ชื่อบริษัทผู้ขาย"
          allowClear
        />
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item name="siteDeliveryId" label="Site Delivery/สถานที่ส่งของ">
          <SiteDeliveryDropdown allowClear />
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item name="siteInvoiceId" label="Site Invoice/สถานที่ออกใบกำกับภาษี">
          <SiteDeliveryDropdown allowClear />
        </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Form.Item name="deliveryDate" label="Delivery Date/วันที่ส่งของ">
          <CustomDatePicker
            style={{ width: '100%' }}
            placeholder="Select delivery date"
            allowClear
          />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default POEnquirySearchForm
