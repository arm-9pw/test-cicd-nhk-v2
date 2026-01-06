import { DownloadOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { ReportData } from 'api/reportApi.types'

import { REPORT_NAME } from 'constants/index'
import { formatDisplayDate } from 'utils/dateHelpers'

const { Text } = Typography

interface ColumnParams {
  reportName: string
  onDownload: (jobId: number) => void
}

const column = ({ reportName, onDownload }: ColumnParams): ColumnsType<ReportData> => {
  const startColumns: ColumnsType<ReportData> = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
      render: (_: unknown, __: ReportData, index: number) => index + 1,
    },
    {
      title: 'Report',
      dataIndex: 'jobName',
      key: 'jobName',
      align: 'center',
    },
    {
      title: 'Site',
      dataIndex: 'siteCode',
      key: 'siteCode',
      width: 100,
      align: 'center',
    },
  ]

  const endColumns: ColumnsType<ReportData> = [
    {
      title: 'Report Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 100,
      align: 'center',
      render: (text: string) => formatDisplayDate(text),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (text: string) => (
        <Text
          style={{
            color:
              text === 'COMPLETED'
                ? 'var(--clr-green)'
                : text === 'FAIL'
                  ? 'var(--clr-red)'
                  : undefined,
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_: unknown, record: ReportData) => (
        <Button
          type="text"
          icon={<DownloadOutlined />}
          disabled={record.status !== 'COMPLETED'}
          onClick={() => onDownload(record.jobId)}
        />
      ),
    },
  ]

  const followUpColumns: ColumnsType<ReportData> = [
    ...startColumns,
    {
      title: 'Budget Year',
      dataIndex: 'budgetYear',
      key: 'budgetYear',
      width: 100,
      align: 'center',
    },
    {
      title: 'Budget Type',
      dataIndex: 'budgetTypeName',
      key: 'budgetTypeName',
      width: 100,
      align: 'center',
    },
    {
      title: 'Budget Code',
      dataIndex: 'budgetCode',
      key: 'budgetCode',
      // width: 100,
      align: 'center',
    },
    ...endColumns,
  ]

  const budgetColumns: ColumnsType<ReportData> = [
    ...startColumns,
    {
      title: 'Section',
      dataIndex: 'sectionName',
      key: 'sectionName',
      width: 100,
      align: 'center',
    },
    {
      title: 'Budget Type',
      dataIndex: 'budgetTypeName',
      key: 'budgetTypeName',
      width: 100,
      align: 'center',
    },
    {
      title: 'Budget Year',
      dataIndex: 'budgetYear',
      key: 'budgetYear',
      width: 100,
      align: 'center',
    },
    ...endColumns,
  ]

  const invoiceSummaryColumns: ColumnsType<ReportData> = [
    ...startColumns,
    {
      title: 'Section',
      dataIndex: 'sectionName',
      key: 'sectionName',
      width: 100,
      align: 'center',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 100,
      align: 'center',
      render: (text: string) => formatDisplayDate(text),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 100,
      align: 'center',
      render: (text: string) => formatDisplayDate(text),
    },
    ...endColumns,
  ]

  if (reportName === REPORT_NAME.FOLLOW_UP) {
    return followUpColumns
  }

  if (reportName === REPORT_NAME.INVOICE_SUMMARY) {
    return invoiceSummaryColumns
  }

  return budgetColumns
}

export default column
