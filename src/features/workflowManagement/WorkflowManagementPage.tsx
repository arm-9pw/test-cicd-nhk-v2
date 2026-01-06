import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'

import useCustomModal from 'hooks/useCustomModal'

import CustomPagination from 'components/CustomPagination'
import HeaderTitle from 'components/HeaderTitle'
import PageHeader from 'components/PageHeader'

import SearchWorkflowManagement from './SearchWorkflow'
import { columns } from './columns'
import WorkflowModal from './components/WorkflowModal'
import { useWorkflowManagement } from './hooks/useWorkflowManangement'

const WorkflowManagementPage = () => {
  const workflowModalHook = useCustomModal()
  const approveModalHook = useCustomModal()

  const {
    workflowListData,
    loading,
    handleNextPage,
    handlePrevPage,
    handleRowClick,
    selectedWorkflow,
    openCreateWorkflow,
    page,
    sizePerPage,
    handleResetSearch,
    handleSearchWorkflow,
    setSelectedWorkflow,
  } = useWorkflowManagement({ workflowModalHook })

  return (
    <>
      <PageHeader
        pageTitle="Workflow Management"
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: 'Workflow Management',
          },
        ]}
      />
      <SearchWorkflowManagement
        handleSearchWorkflow={handleSearchWorkflow}
        handleResetSearch={handleResetSearch}
      />
      <div style={{ display: 'flex', margin: '16px 0 8px' }}></div>
      <Table
        rowKey="id"
        bordered
        loading={loading}
        size="middle"
        tableLayout="auto"
        scroll={{ x: true }}
        rowClassName="clickable-row"
        onRow={(record) => ({ onClick: () => handleRowClick(record) })}
        columns={columns}
        dataSource={workflowListData}
        pagination={false}
        title={() => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              padding: '3px',
            }}
          >
            <HeaderTitle title="ผลการค้นหา" titlePreIcon={<SearchOutlined />} />
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={openCreateWorkflow}
              style={{ marginLeft: '8px' }}
            >
              Create New Workflow
            </Button>
          </div>
        )}
      />
      <div style={{ marginTop: 8 }}>
        <CustomPagination
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          currentPage={page}
          disabledPrevious={page === 1}
          disabledNext={workflowListData.length < sizePerPage}
        />
      </div>

      {/* Workflow Modal */}
      {workflowModalHook.isModalMounted && (
        <WorkflowModal
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={setSelectedWorkflow}
          modalHook={workflowModalHook}
          approveModalHook={approveModalHook}
        />
      )}
    </>
  )
}

export default WorkflowManagementPage
