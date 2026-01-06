import { SearchOutlined } from '@ant-design/icons'
import { Input, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

import { OrganizationListType } from 'api/allocateManagementApi.types'

import CustomPagination from 'components/CustomPagination'
import PageHeader from 'components/PageHeader'

import EditOrganizationModal from './components/EditOrganizationModal'
import useAllocateManagementPage from './hooks/useAllocateManagementPage'

const columns: ColumnsType<OrganizationListType> = [
  {
    title: 'Organization Name',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Organization Code',
    dataIndex: 'code',
    key: 'code',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
]

const AllocateManagementPage = () => {
  const {
    handleClickRow,
    closeEditOrgModal,
    editOrgModal,
    selectedOrganization,
    handleSearch,
    searchText,
    organizations,
    loading,
    pagination,
    handleNextPage,
    handlePrevPage,
  } = useAllocateManagementPage()

  return (
    <>
      <PageHeader
        pageTitle="Allocate Management"
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: 'Allocate Management',
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
          dataSource={organizations}
          scroll={{ x: 'auto' }}
          rowKey="id"
          pagination={false}
          rowClassName="clickable-row"
          onRow={(record: OrganizationListType) => ({
            onClick: () => handleClickRow(record),
          })}
          title={() => (
            <div>
              <Input
                allowClear
                value={searchText}
                onChange={handleSearch}
                addonBefore={<SearchOutlined />}
                placeholder="Search"
                style={{ maxWidth: '100%', width: '350px' }}
              />
            </div>
          )}
        />
        <div style={{ marginTop: 8 }}>
          <CustomPagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={pagination.current}
            disabledPrevious={pagination.current === 1}
            disabledNext={organizations.length < pagination.pageSize}
          />
        </div>
      </div>

      {editOrgModal.isModalMounted && (
        <EditOrganizationModal
          editOrgModal={editOrgModal}
          closeEditOrgModal={closeEditOrgModal}
          selectedOrganization={selectedOrganization}
        />
      )}
    </>
  )
}

export default AllocateManagementPage
