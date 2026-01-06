import { ColumnsType } from 'antd/es/table'

import { ListBudgetResponse } from 'api/importDataApiType'

import { formatDisplayDate } from 'utils/dateHelpers'

export const columns = (): ColumnsType<ListBudgetResponse> => {
  return [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      align: 'center',
      render: (_, __, index) => {
        return index + 1
      },
    },
    {
      title: 'Job Name',
      dataIndex: 'jobName',
      key: 'jobName',
      align: 'center',
      render: (_, record) => {
        return (
          <div style={{ textAlign: 'left' }}>
            {record.jobName} ({record.jobId})
          </div>
        )
      },
    },
    {
      title: 'Job Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 200,
      align: 'center',
      render: (text) => formatDisplayDate(text),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (text) => (
        <div
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
        </div>
      ),
    },
  ]
}
