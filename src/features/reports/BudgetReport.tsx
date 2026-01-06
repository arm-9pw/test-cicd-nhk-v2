import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import PageHeader from 'components/PageHeader'

import { REPORT_NAME } from 'constants/index'

import CreateBudgetReportModal from './components/CreateBudgetReportModal'
import ReportResultTable from './components/ReportResultTable'
import SearchReportSection from './components/SearchReportSection'
import useReport from './hooks/useReport'

const BudgetReport = () => {
  const {
    // MODAL
    showModal,
    handleCancel,
    afterClose,
    isModalVisible,
    isModalMounted,

    // FUNCTIONS
    onSearchReport,
    onResetSearch,
    onCreateReport,

    // REPORTS
    reports,
    isLoadingReports,
    isCreatingReport,
    siteCode,
  } = useReport(REPORT_NAME.BUDGET_REPORT)

  return (
    <div>
      <PageHeader
        pageTitle="Budget Report"
        breadcrumbItems={[
          {
            title: 'Report',
          },
          {
            title: 'Budget Report',
          },
        ]}
      />
      <SearchReportSection
        reportName="Budget Report/รายงานการใช้งบประมาณ"
        loading={isLoadingReports}
        onSearchReport={onSearchReport}
        onResetSearch={onResetSearch}
      />
      <div style={{ margin: '16px 0 8px' }}>
        <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
          Create Report
        </Button>
      </div>
      <ReportResultTable
        reports={reports}
        loading={isLoadingReports}
        onSearchReport={onSearchReport}
        siteCode={siteCode}
        reportName={REPORT_NAME.BUDGET_REPORT}
      />

      {/* Create Report Modal */}
      {/* Only mount the modal when needed for better performance */}
      {isModalMounted && (
        <CreateBudgetReportModal
          title="Budget Report/รายงานการใช้งบประมาณ"
          open={isModalVisible}
          onCancel={handleCancel}
          afterClose={afterClose}
          onCreateReport={onCreateReport}
          isCreatingReport={isCreatingReport}
        />
      )}
    </div>
  )
}

export default BudgetReport
