import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'

import { BudgetsResponseType } from 'api/budgetManagementApi.types'

import CustomPagination from 'components/CustomPagination'
import PageHeader from 'components/PageHeader'

import { columns } from './columns'
import EditBudgetModal from './components/EditBudgetModal'
import useBudgetManagement from './hooks/useBudgetManagement'

const BudgetManagementPage = () => {
  const {
    budgets,
    editBudgetModal,
    openEditBudgetModal,
    closeEditBudgetModal,
    handleClickRow,
    selectedBudget,
    searchText,
    handleSearch,
    loading,
    handleNextPage,
    handlePrevPage,
    pagination,
    updateBudgetInList,
  } = useBudgetManagement()

  return (
    <>
      <PageHeader
        pageTitle="Budget Management"
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: 'Budget Management',
          },
        ]}
      />
      <div style={{ marginTop: 16 }}>
        <Table
          bordered
          size="middle"
          loading={loading}
          tableLayout="auto"
          columns={columns}
          dataSource={budgets}
          scroll={{ x: 'auto' }}
          rowKey="id"
          pagination={false}
          rowClassName="clickable-row"
          onRow={(record: BudgetsResponseType) => ({
            onClick: () => handleClickRow(record),
          })}
          title={() => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <Input
                allowClear
                value={searchText}
                onChange={handleSearch}
                addonBefore={<SearchOutlined />}
                placeholder="Search"
                style={{ maxWidth: '100%', width: '350px' }}
              />
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={openEditBudgetModal}
                style={{ marginLeft: '8px' }}
              >
                Add Budget
              </Button>
            </div>
          )}
        />
        <div style={{ marginTop: 8 }}>
          <CustomPagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={pagination.current}
            disabledPrevious={pagination.current === 1}
            disabledNext={budgets.length < pagination.pageSize}
          />
        </div>
      </div>

      {editBudgetModal.isModalMounted && (
        <EditBudgetModal
          editBudgetModal={editBudgetModal}
          closeEditBudgetModal={closeEditBudgetModal}
          selectedBudget={selectedBudget}
          onBudgetUpdated={updateBudgetInList}
        />
      )}
    </>
  )
}

export default BudgetManagementPage
