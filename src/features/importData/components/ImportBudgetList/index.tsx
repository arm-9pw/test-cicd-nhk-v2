import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'

import { useGetBudgetResponseQuery } from 'api/importDataApi'
import { ListBudgetResponse } from 'api/importDataApiType'

import HeaderTitle from 'components/HeaderTitle'
import { columns } from 'features/importData/components/ImportBudgetList/columns'

function ImportBudgetList() {
  const { data: budgetList, isLoading, refetch } = useGetBudgetResponseQuery()

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div style={{ marginTop: 16 }}>
      <Table<ListBudgetResponse>
        bordered
        size="small"
        loading={isLoading}
        tableLayout="auto"
        columns={columns()}
        dataSource={budgetList}
        scroll={{ x: 'auto' }}
        rowKey="jobId"
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
              icon={<ReloadOutlined />}
              type="primary"
              color="green"
              variant="solid"
              onClick={handleRefresh}
            >
              Refresh Budget
            </Button>
          </div>
        )}
      />
    </div>
  )
}
export default ImportBudgetList
