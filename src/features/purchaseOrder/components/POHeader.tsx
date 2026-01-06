import { Descriptions, Typography } from 'antd'
import { DescriptionsProps } from 'antd/es/descriptions'

import ContentCard from 'components/ContentCard'

const { Text } = Typography

const SPAN = { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }

type Props = {
  poNo?: string
  poDate?: string
  purchaserName?: string
  purchaserSite?: string
  purchaserSection?: string
  // requesterName?: string
  // requesterSite?: string
  // requesterSection?: string
}

const POHeader = ({
  poNo = '-',
  poDate = '-',
  purchaserName = '-',
  purchaserSite = '-',
  purchaserSection = '-',
  // requesterName = '-',
  // requesterSite = '-',
  // requesterSection = '-',
}: Props) => {
  const items: DescriptionsProps['items'] = [
    {
      key: '3',
      label: ' ',
      children: ' ',
      span: SPAN,
      labelStyle: { display: 'none' },
    },
    {
      key: '1',
      label: 'PO. No./เลขที่',
      children: <Text strong>{poNo}</Text>,
      span: 1,
    },
    {
      key: '2',
      label: 'PO. Date/วันที่',
      children: <Text strong>{poDate}</Text>,
      span: 1,
    },

    {
      key: '4',
      label: 'Purchaser (PO.)/เจ้าหน้าที่จัดซื้อ',
      children: <Text strong>{purchaserName}</Text>,
      span: SPAN,
    },
    {
      key: '5',
      label: 'Site/สาขา',
      children: <Text strong>{purchaserSite}</Text>,
      span: 1,
    },
    {
      key: '6',
      label: 'Section/แผนก',
      children: <Text strong>{purchaserSection}</Text>,
      span: 1,
    },
    // {
    //   key: '7',
    //   label: 'Requester (PR.)/ผู้ขอสั่ง',
    //   children: <Text strong>{requesterName}</Text>,
    //   span: SPAN,
    // },
    // {
    //   key: '8',
    //   label: 'Site/สาขา',
    //   children: <Text strong>{requesterSite}</Text>,
    //   span: 1,
    // },
    // {
    //   key: '9',
    //   label: 'Section/แผนก',
    //   children: <Text strong>{requesterSection}</Text>,
    //   span: 1,
    // },
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

export default POHeader
