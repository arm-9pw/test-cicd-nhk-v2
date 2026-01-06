import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'

import { downloadReport } from 'api/reportApi'
import { ReportData } from 'api/reportApi.types'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'

import columns from './columns'

interface Props {
  loading: boolean
  reports: ReportData[]
  siteCode?: string
  reportName: string
  onSearchReport: (siteCode: string | undefined) => void
}

const ReportResultTable = ({ loading, reports, siteCode, reportName, onSearchReport }: Props) => {
  const { openNotification } = useNotification()

  const handleDownload = async (jobId: number) => {
    try {
      await downloadReport(jobId)
    } catch {
      openNotification({
        type: 'error',
        title: 'Error Downloading Report',
        description: 'Please try again',
      })
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <Table
        bordered
        size="small"
        loading={loading}
        tableLayout="auto"
        columns={columns({
          reportName,
          onDownload: handleDownload,
        })}
        dataSource={reports}
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
              onClick={() => onSearchReport(siteCode)}
            >
              Refresh Report
            </Button>
          </div>
        )}
      />
    </div>
  )
}

export default ReportResultTable
