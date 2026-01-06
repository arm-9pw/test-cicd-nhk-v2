import { useEffect, useState } from 'react'

import { Col, DatePicker, Form, FormInstance, Input, Row } from 'antd'

import { SiteType } from 'api/employeeApi.types'

import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import EmployeeDropdown from 'components/EmployeeDropdown'
import SearchSectionDropdown from 'components/SearchSectionDropdown'
import SiteDropdown from 'components/SiteDropdown'
import SupplierCodeDropdown from 'features/purchaseOrder/components/SupplierCodeDropdown'
import BudgetItemDropdown from 'features/purchaseRequisition/components/BudgetItemDropdown'

import { gutter } from 'constants/index'

const { RangePicker } = DatePicker

type RequesterSearchFormProps = {
  formRef: FormInstance
}

const RequesterSearchForm = ({ formRef }: RequesterSearchFormProps) => {
  const [siteCode, setSiteCode] = useState<string | null>(null)
  const budgetType = Form.useWatch('budgetType', formRef)

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      formRef.resetFields()
    }
  }, [formRef])

  return (
    <>
      <Row gutter={gutter}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="PR. No." name="prNo">
            <Input placeholder="Enter PR number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="PR. Date" name="prDate">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="Job Name" name="jobName">
            <Input placeholder="Enter job name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <EmployeeDropdown formLabel="Purchaser Name" formName="purchaserId" />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="Purchaser Site" name="siteId">
            <SiteDropdown
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
            formLabel="Purchaser Section"
          />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <SupplierCodeDropdown allowClear formName="supplierId" formLabel="Supplier Code" />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="Budget Type" name="budgetType">
            <BudgetTypeDropdown
              allowClear
              onChange={() => {
                formRef.resetFields(['budgetId'])
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <BudgetItemDropdown
            allowClear
            formName="budgetId"
            formLabel="Budget Code"
            budgetTypeId={budgetType?.value}
          />
        </Col>
      </Row>
    </>
  )
}

export default RequesterSearchForm
