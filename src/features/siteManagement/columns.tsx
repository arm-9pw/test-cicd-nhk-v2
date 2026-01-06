import { ColumnsType } from 'antd/es/table'

import { SiteManagementResponseType } from 'api/siteManagementApi.types'

export const columns: ColumnsType<SiteManagementResponseType> = [
  {
    title: 'Site Name',
    dataIndex: 'siteName',
    key: 'siteName',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left', paddingLeft: '20px' }}>{text}</div>,
  },
  {
    title: 'Organization Name',
    dataIndex: 'organizationName',
    key: 'organizationName',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Site Branch No',
    dataIndex: 'siteBranchNo',
    key: 'siteBranchNo',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Site Branch Name',
    dataIndex: 'siteBranchName',
    key: 'siteBranchName',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Address',
    key: 'fullAddress',
    align: 'center',
    render: (record: SiteManagementResponseType) => {
      const fullAddressConcat =
        `${record.addressTh || ''} ${record.provinceTh || ''} ${record.countryTH || ''}`.trim()
      return <div style={{ textAlign: 'left' }}>{fullAddressConcat}</div>
    },
  }
]
