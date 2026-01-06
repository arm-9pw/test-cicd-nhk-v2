import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'

import PageHeader from 'components/PageHeader'

import { columns } from './columns'
import EditSiteModal from './components/EditSiteModal'
import useSiteManagement from './hooks/useSiteManagement'

const SiteManagementPage = () => {
  const {
    sites,
    editSiteModal,
    openEditSiteModal,
    closeEditSiteModal,
    handleClickRow,
    selectedSite,
    searchText,
    handleSearch,
    loading,
  } = useSiteManagement()

  return (
    <>
      <PageHeader
        pageTitle="Site Management"
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: 'Site Management',
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
          dataSource={sites}
          scroll={{ x: 'auto' }}
          rowKey="id"
          pagination={false}
          rowClassName="clickable-row"
          onRow={(record) => ({
            onClick: () => handleClickRow(record),
          })}
          title={() => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '10px 5px',
                }}
              >
                <Input
                  allowClear
                  value={searchText}
                  onChange={handleSearch}
                  addonBefore={<SearchOutlined />}
                  placeholder="Search"
                  style={{ marginLeft: '8px', width: '350px' }}
                />
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  onClick={openEditSiteModal}
                >
                  Add Site
                </Button>
              </div>
          )}
        />
      </div>
      {editSiteModal.isModalMounted && (
        <EditSiteModal
          editSiteModal={editSiteModal}
          closeEditSiteModal={closeEditSiteModal}
          selectedSite={selectedSite}
        />
      )}
    </>
  )
}
export default SiteManagementPage
