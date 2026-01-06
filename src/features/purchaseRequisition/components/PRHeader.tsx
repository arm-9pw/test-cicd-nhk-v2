import React from 'react'

import { Descriptions, Typography } from 'antd'
import { DescriptionsProps } from 'antd/es/descriptions'

import ContentCard from 'components/ContentCard'

const { Text } = Typography

interface PRHeaderProps {
  prNo?: string
  prDate?: string
  name?: string
  position?: string
  site?: string
  section?: string
}

const PRHeader: React.FC<PRHeaderProps> = ({
  prNo = '-',
  prDate = '-',
  name = '-',
  position = '-',
  site = '-',
  section = '-',
}) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'spacer1',
      label: ' ',
      children: ' ',
      span: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 },
      labelStyle: { display: 'none' },
    },
    {
      key: 'prNo',
      label: 'PR. No./เลขที่',
      children: <Text strong>{prNo}</Text>,
      span: 1,
    },
    {
      key: 'prDate',
      label: 'PR. Date/วันที่',
      children: <Text strong>{prDate}</Text>,
      span: 1,
    },
    {
      key: 'name',
      label: 'Name/ชื่อ',
      children: <Text strong>{name}</Text>,
      span: 1,
    },
    {
      key: 'position',
      label: 'Position/ตำแหน่ง',
      children: <Text strong>{position}</Text>,
      span: 1,
    },
    {
      key: 'site',
      label: 'Site/สาขา',
      children: <Text strong>{site}</Text>,
      span: 1,
    },
    {
      key: 'section',
      label: 'Section/แผนก',
      children: <Text strong>{section}</Text>,
      span: 1,
    },
  ]

  return (
    <ContentCard>
      <Descriptions
        size="small"
        items={items}
        layout="horizontal"
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 4 }}
      />
    </ContentCard>
  )
}

export default PRHeader
