import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'

import PageHeader from 'components/PageHeader'

import { columns } from './columns'
import EditItemModal from './components/EditItemModal/EditItemModal'
import { useItemManagement } from './hooks/useItemManagement'

const ItemManagementPage = () => {
  const {
    editItemModal,
    openEditItemModal,
    closeEditItemModal,
    selectedItem,
    itemsMater,
    loading,
    searchText,
    handleRowClick,
    handleSearch,
  } = useItemManagement()

  return (
    <>
      <PageHeader
        pageTitle="Item Management"
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: 'Item Management',
          },
        ]}
      />
      <div style={{ marginTop: 16 }}>
        <Table
          bordered
          size="small"
          loading={loading}
          columns={columns}
          dataSource={itemsMater}
          rowKey={'id'}
          pagination={false}
          scroll={{ y: 600 }}
          rowClassName={'clickable-row'}
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
                  margin: '10px 0',
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
                  onClick={openEditItemModal}
                >
                  Add Item
                </Button>
              </div>
            </>
          )}
        />
      </div>
      {editItemModal.isModalMounted && (
        <EditItemModal
          editItemModal={editItemModal}
          selectedItems={selectedItem}
          closeEditItemModal={closeEditItemModal}
          mode="EDIT" // or the appropriate mode value
        />
      )}
    </>
  )
}
export default ItemManagementPage
