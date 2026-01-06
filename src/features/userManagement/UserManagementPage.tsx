import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Drawer, Empty, Input, Table } from 'antd'

import { clrNeutralLight } from 'styles/theme'

import CustomPagination from 'components/CustomPagination'
import PageHeader from 'components/PageHeader'

import { columns } from './columns'
import EditPositionModal from './components/EditPositionModal'
import EmployeeDetail from './components/EmployeeDetail'
import { useUserManagement } from './hooks/useUserManagement'
import CreateEmployeeModal from './components/CreateEmployee/components/CreateEmployeeModal'

const UserManagementPage = () => {
  const {
    pagination,
    users,
    loading,
    searchText,
    detailVisible,
    selectedEmployee,
    handleSearch,
    handleRowClick,
    handleNextPage,
    handlePrevPage,
    hideDetail,
    onEditPosition,
    selectedPosition,
    positionModal,
    hidePositionModal,
    onAddPosition,
    createUserModal,
    openCreateUserModal,
    closeCreateUserModal,
  } = useUserManagement()

  return (
    <>
      <PageHeader
        pageTitle="User Management"
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: 'User Management',
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
          dataSource={users}
          scroll={{ x: true }}
          rowKey="id"
          pagination={false}
          rowClassName="clickable-row"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          title={() => (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}>
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
                onClick={openCreateUserModal}
                style={{ marginLeft: '8px' }}>
                Create New User
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
            disabledNext={users.length < pagination.pageSize}
          />
        </div>
      </div>

      <Drawer
        width={'100%'}
        placement="right"
        closable={false}
        onClose={hideDetail}
        open={detailVisible}
        style={{ backgroundColor: clrNeutralLight }}
      >
        {selectedEmployee ? (
          <EmployeeDetail
            hideDetail={hideDetail}
            selectedEmployee={selectedEmployee}
            onEditPosition={onEditPosition}
            onAddPosition={onAddPosition}
          />
        ) : (
          <div>
            <Empty description="No employee selected" style={{ marginTop: '40vh' }} />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" onClick={hideDetail}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {positionModal.isModalMounted && (
        <EditPositionModal
          hidePositionModal={hidePositionModal}
          positionModal={positionModal}
          selectedPosition={selectedPosition}
          selectedEmployee={selectedEmployee}
        />
      )}
      {createUserModal.isModalMounted && (
        <CreateEmployeeModal
          createUserModal={createUserModal}
          closeCreateUserModal={closeCreateUserModal}
          mode="create"
        />
      )}
    </>
  )
}

export default UserManagementPage