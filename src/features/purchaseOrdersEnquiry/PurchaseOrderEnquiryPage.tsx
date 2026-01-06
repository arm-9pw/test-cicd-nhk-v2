import { useState } from 'react'

import { Card, Empty, Pagination, Table } from 'antd'

import PageHeader from 'components/PageHeader'

import { columns } from './columns'
import POEnquiryModalViewer from './components/POEnquiryModalViewer/POEnquiryModalViewer'
import SearchBox from './components/SeachBox'
import usePurchaseOrderEnquiryPage from './hooks/usePurchaseOrderEnquiryPage'

const PurchaseOrderEnquiryPage = () => {
  const {
    formRef,
    isLoading,
    purchaseOrders,
    currentPage,
    pageSize,
    handleSearch,
    handleReset,
    handleChangePage,
    handleCollapseChange,
    activeKey, // ✅ เพิ่มตรงนี้
  } = usePurchaseOrderEnquiryPage()

  // const handleRowClick = (record: { id: string }) => {
  //   window.open(`/purchase-order/${record.id}/edit`, '_blank', 'noopener,noreferrer')
  // }
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (record: { id: string }) => {
    setSelectedPoId(record.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setSelectedPoId(null)
    setIsModalOpen(false)
  }

  return (
    <>
      <PageHeader
        pageTitle="Purchase Order Enquiry"
        breadcrumbItems={[{ title: 'Purchase Order Enquiry' }]}
      />
      <div style={{ marginTop: 16 }} />
      <SearchBox
        formRef={formRef}
        activeKey={activeKey}
        onCollapseChange={handleCollapseChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <Card style={{ marginTop: 16 }}>
        <Table
          bordered
          size="small"
          tableLayout="auto"
          columns={columns}
          dataSource={purchaseOrders}
          scroll={{ x: 'auto' }}
          rowKey="id"
          pagination={false}
          rootClassName="clickable-row"
          loading={isLoading}
          locale={{ emptyText: <Empty description="No data" /> }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            onChange={handleChangePage}
          />
        </div>
      </Card>
      {selectedPoId && (
        <POEnquiryModalViewer poId={selectedPoId} open={isModalOpen} onClose={handleModalClose} />
      )}
    </>
  )
}

export default PurchaseOrderEnquiryPage
