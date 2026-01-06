import React, { useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Button, Collapse, Form, Row, Space } from 'antd'

import { ProcurementContext, ProcurementQueryParams } from 'api/procurementApi.types'

import { formatToLocalDateTime } from 'utils/dateHelpers'

import PurchaserSearchForm from './PurchaserSearchForm'
import RequesterSearchForm from './RequesterSearchForm'

// import SiteDropdown from 'components/SiteDropdown'

type SearchBoxProps = {
  handleResetSearch: () => void
  handleSearchProcurement: (params: ProcurementQueryParams) => void
  defaultContext: ProcurementContext
}

const SearchBox: React.FC<SearchBoxProps> = ({
  handleResetSearch,
  handleSearchProcurement,
  defaultContext,
}) => {
  const [formRef] = Form.useForm()
  const budgetType = Form.useWatch('budgetType', formRef)
  const [activeKey, setActiveKey] = useState<string[]>([])

  const handleSearch = async () => {
    try {
      const values = await formRef.validateFields()

      // Handle the case when prDate is null or undefined
      let prStartDate, prEndDate
      if (values.prDate) {
        ;[prStartDate, prEndDate] = values.prDate
      }

      // Handle the case when poDate is null or undefined
      let poStartDate, poEndDate
      if (values.poDate) {
        ;[poStartDate, poEndDate] = values.poDate
      }

      const queryParams = {
        prNo: values.prNo,
        poNo: values.poNo,
        siteId: values.siteId,
        supplierId: values.supplierId,
        budgetId: values.budgetId,
        requesterId: values.requesterId,
        purchaserId: values.purchaserId,
        jobName: values.jobName,
        status: values.status,
        requesterSectionId: values.requesterSectionId,
        purchaserSectionId: values.purchaserSectionId,
        prStartDate: formatToLocalDateTime(prStartDate),
        prEndDate: formatToLocalDateTime(prEndDate),
        poStartDate: formatToLocalDateTime(poStartDate),
        poEndDate: formatToLocalDateTime(poEndDate),
        budgetTypeId: budgetType?.value,
      }

      // Call the handleSearchProcurement function with the query parameters
      handleSearchProcurement(queryParams)

      // Collapse the search box after search
      setActiveKey([])
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleReset = () => {
    formRef.resetFields()
    handleResetSearch()

    // Collapse the search box after search
    setActiveKey([])
  }

  return (
    <div>
      <Collapse
        size="small"
        expandIconPosition="end"
        activeKey={activeKey}
        onChange={(keys) => setActiveKey(keys as string[])}
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
                  {defaultContext === 'PURCHASER' ? (
                    <PurchaserSearchForm formRef={formRef} />
                  ) : (
                    <RequesterSearchForm formRef={formRef} />
                  )}
                  <Row justify="end" style={{ marginTop: 16 }}>
                    <Space>
                      <Button onClick={handleReset}>Reset</Button>
                      <Button type="primary" onClick={handleSearch}>
                        Search
                      </Button>
                    </Space>
                  </Row>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

export default SearchBox
