import { Descriptions, Typography } from 'antd'
import { DescriptionsProps } from 'antd/es/descriptions'

import ContentCard from 'components/ContentCard'

const { Text } = Typography

interface GRHeaderProps {
  GRName?: string
  GRSite?: string
  GRsection?: string
}

const GRHeader: React.FC<GRHeaderProps> = ({GRName,GRSite,GRsection}) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'grName',
      label: 'GR. Name / ผู้ทำรับสินค้า', 
      children: <Text strong>{GRName}</Text>,
      span: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 },
    },
    {
      key: 'site',
      label: 'Site/สาขา',
      children: <Text strong>{GRSite}</Text>,
      span: 1,
    },
    {
      key: 'section',
      label: 'Section/แผนก',
      children: <Text strong>{GRsection}</Text>,
      span: 1,
    },
  ]

  return (
    <ContentCard>
      <Descriptions
        size="small"
        items={items}
        layout="horizontal"
        column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 4 }}
      />
    </ContentCard>
  )
}

export default GRHeader
