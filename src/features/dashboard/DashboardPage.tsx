import {
  BarChartOutlined,
  InfoCircleFilled,
  TableOutlined,
} from '@ant-design/icons'
import { Col, Row } from 'antd'

import ContentCard from 'components/ContentCard'
import PageHeader from 'components/PageHeader'

// import { gutter } from 'constants/index'
import BudgetTable from './components/BudgetTable'
import StackedBarChart from './components/StackedBarChart'

const DashboardPage = () => {
  return (
    <div>
      <PageHeader
        pageTitle="Dashboard"
        breadcrumbItems={[
          {
            title: 'Dashboard',
          },
        ]}
      />
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <ContentCard
            title="Summary Investment Y2024"
            titlePreIcon={<BarChartOutlined />}
            titlePostIcon={<InfoCircleFilled />}
          >
            <StackedBarChart />
          </ContentCard>
        </Col>
        <Col span={24}>
          <ContentCard
            title="Budget Detail"
            titlePreIcon={<TableOutlined />}
            titlePostIcon={<InfoCircleFilled />}
          >
            <BudgetTable />
          </ContentCard>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
