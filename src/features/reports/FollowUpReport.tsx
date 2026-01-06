import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import PageHeader from 'components/PageHeader'

import { REPORT_NAME } from 'constants/index'

import CreateFollowUpReportModal from './components/CreateFollowUpReportModal'
import ReportResultTable from './components/ReportResultTable'
import SearchReportSection from './components/SearchReportSection'
import useReport from './hooks/useReport'

const FollowUpReport = () => {
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
  } = useReport(REPORT_NAME.FOLLOW_UP)

  return (
    <div>
      <PageHeader
        pageTitle="Follow-up Report"
        breadcrumbItems={[
          {
            title: 'Report',
          },
          {
            title: 'Follow-up Report',
          },
        ]}
      />
      <SearchReportSection
        reportName="Follow-up Report/รายงานการติดตามผล"
        onSearchReport={onSearchReport}
        onResetSearch={onResetSearch}
        loading={isLoadingReports}
      />
      <div style={{ display: 'flex', margin: '16px 0 8px' }}>
        <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
          Create Report
        </Button>
      </div>
      <ReportResultTable
        reportName={REPORT_NAME.FOLLOW_UP}
        reports={reports}
        loading={isLoadingReports}
        onSearchReport={onSearchReport}
        siteCode={siteCode}
      />

      {/* Create Report Modal */}
      {/* Only mount the modal when needed for better performance */}
      {isModalMounted && (
        <CreateFollowUpReportModal
          title="Follow-up Report/รายงานการติดตามผล"
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

export default FollowUpReport
