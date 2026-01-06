import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, Space } from 'antd'
import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb'

import styles from './PageHeader.module.css'

type PageHeaderProps = {
  breadcrumbItems: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
  pageTitle: string
  extraRightNote?: React.ReactNode
}

const PageHeader = ({ breadcrumbItems, pageTitle, extraRightNote }: PageHeaderProps) => {
  const _breadcrumbItems = [
    {
      href: '/',
      title: (
        <span>
          <HomeOutlined /> <span style={{ display: 'inline-block', marginLeft: 5 }}>Home</span>
        </span>
      ),
    },
    ...breadcrumbItems,
  ]
  return (
    <div className={styles['page-header']}>
      <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Breadcrumb items={_breadcrumbItems} />
          <h1>{pageTitle}</h1>
        </div>
        <div>{extraRightNote}</div>
      </Space>
    </div>
  )
}

export default PageHeader
