import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'

import CustomPagination from 'components/CustomPagination'
import PageHeader from 'components/PageHeader'

import { columns } from './columns'
import EditSupplierModal from './components/EditSupplierModal'
import { useSupplierManagement } from './hooks/useSupplierManagement'

const SupplierManagementPage = () => {
  const {
    editSupplierModal,
    openEditSupplierModal,
    closeEditSupplierModal,
    selectedSupplier,
    pagination,
    suppliers,
    loading,
    searchText,
    handleRowClick,
    handleSearch,
    handleNextPage,
    handlePrevPage,
  } = useSupplierManagement()
  
  return (
    <>
      <PageHeader
        pageTitle="Supplier Management"
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: 'Supplier Management',
          },
        ]}
      />
      <div style={{ marginTop: 16 }}>
        <Table
          bordered
          size="small"
          loading={loading}
          tableLayout="auto"
          columns={columns}
          dataSource={suppliers}
          rowKey="id"
          pagination={false}
          scroll={{ y: 600 }}
          rowClassName="clickable-row"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          title={() => (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '10px 5px',
                }}
              >
                <Input
                  allowClear
                  value={searchText}
                  onChange={handleSearch}
                  addonBefore={<SearchOutlined />}
                  placeholder="Search"
                  style={{ width: '350px', maxWidth: '100%' }}
                />
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  onClick={openEditSupplierModal}
                >
                  Add Supplier
                </Button>
              </div>
            </>
          )}
        />
        <div style={{ marginTop: 8 }}>
          <CustomPagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={pagination.current}
            disabledPrevious={pagination.current === 1}
            disabledNext={suppliers.length < pagination.pageSize}
          />
        </div>
      </div>
      {editSupplierModal.isModalMounted && (
        <EditSupplierModal
          editSupplierModal={editSupplierModal}
          closeEditSupplierModal={closeEditSupplierModal}
          selectedSupplier={selectedSupplier}
        />
      )}
    </>
  )
}
export default SupplierManagementPage