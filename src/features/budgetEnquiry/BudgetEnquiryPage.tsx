import {
  Card,
  Empty,
  Pagination,
  Table,
} from 'antd'

import PageHeader from 'components/PageHeader'
import { columns } from './columns'
import useBudgetEnquiryPage from './hooks/useBudgetEnquiryPage'
import SearchBox from './components/SearchBox'

const BudgetEnquiryPage = () => {
  const { formRef,
    isLoading,
    budgets,
    currentPage,
    pageSize,
    activeKey,
    handleSearch,
    handleReset,
    handleChangePage,
    handleCollapseChange,
    budgetCode,
    setBudgetCode,
  } = useBudgetEnquiryPage()

  return (
    <div>
      <PageHeader
        pageTitle="Budget Enquiry"
        breadcrumbItems={[{ title: 'Budget Enquiry' }]}
      />
      <div style={{ marginTop: 16 }}>
        <SearchBox
          formRef={formRef}
          activeKey={activeKey}
          onCollapseChange={handleCollapseChange}
          onSearch={handleSearch}
          onReset={handleReset}
          budgetCode={budgetCode}
          onBudgetCodeChange={setBudgetCode}
        />
        <Card style={{ marginTop: 16 }}>
          <Table
            bordered
            size="small"
            tableLayout="auto"
            columns={columns(budgets)}
            dataSource={budgets}
            loading={isLoading}
            scroll={{ x: 'auto' }}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: <Empty description="No data" /> }}
          />
        </Card>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            onChange={handleChangePage}
          />
        </div>
      </div>

    </div>
  )
}

export default BudgetEnquiryPage