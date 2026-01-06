import type { ColumnsType } from 'antd/es/table'

import { EmployeeUserType } from 'api/employeeApi.types'

const getFullName = (prefix: string, firstName: string, lastName: string) => {
  return [prefix, firstName, lastName].filter(Boolean).join(' ')
}

export const columns: ColumnsType<EmployeeUserType> = [
  {
    title: 'NameEN',
    dataIndex: 'firstNameEn',
    key: 'firstNameEn',
    align: 'center',
    render: (_text, record: EmployeeUserType) => (
      <div style={{ textAlign: 'left' }}>
        <span>{getFullName(record.prefixEn, record.firstNameEn, record.lastNameEn)}</span>
      </div>
    ),
  },
  {
    title: 'NameTH',
    dataIndex: 'firstNameTh',
    key: 'firstNameTh',
    align: 'center',
    render: (_text, record: EmployeeUserType) => (
      <div style={{ textAlign: 'left' }}>
        <span>{getFullName(record.prefixTh, record.firstNameTh, record.lastNameTh)}</span>
      </div>
    ),
  },
  {
    title: 'Username',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
]
