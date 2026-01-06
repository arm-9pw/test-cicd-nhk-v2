import { useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Button, Collapse, Form, Pagination, Row, Space, Table } from 'antd'

import PageHeader from 'components/PageHeader'

import { columns } from './columns'
import PREnquiryModalViewer from './components/PREnquiryModalViewer'
import PREnquirySearchForm from './components/PREnquirySearchForm'
import { usePurchaseRequisitionEnquiry } from './hooks/usePurchaseRequisitionEnquiry'

const PurchaseRequisitionEnquiryPage = () => {
  const {
    formRef,
    tableData,
    isLoading,
    currentPage,
    activeKey,
    handleCollapseChange,
    handleSearch,
    handleReset,
    handlePageChange,
  } = usePurchaseRequisitionEnquiry()

  interface RecordType {
    id: string
  }

  // const handleRowClick = (record: RecordType) => {
  //   window.open(`/purchase-requisition/${record.id}/edit`, '_blank', 'noopener,noreferrer')
  // }

  const [selectedPrId, setSelectedPrId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (record: RecordType) => {
    setSelectedPrId(record.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setSelectedPrId(null)
  }

  return (
    <>
      <PageHeader
        pageTitle="Purchase Requisition Enquiry"
        breadcrumbItems={[{ title: 'Purchase Requisition Enquiry' }]}
      />

      <div style={{ marginTop: 16 }} />

      {/* 🔵 Search Box */}
      <Collapse
        size="small"
        expandIconPosition="end"
        activeKey={activeKey}
        onChange={handleCollapseChange}
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

      <div style={{ marginTop: 16 }}>
        {/* 🔵 Table */}
        <Table
          className="small-font-table"
          bordered
          size="small"
          tableLayout="auto"
          columns={columns}
          dataSource={tableData}
          scroll={{ x: 'auto' }}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          rootClassName="clickable-row"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />

        {/* 🔵 Pagination */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
          />
        </div>
      </div>
      {selectedPrId && (
        <PREnquiryModalViewer prId={selectedPrId} open={isModalOpen} onClose={handleModalClose} />
      )}
    </>
  )
}

export default PurchaseRequisitionEnquiryPage
