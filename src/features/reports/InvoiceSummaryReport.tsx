import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import PageHeader from 'components/PageHeader'

import { REPORT_NAME } from 'constants/index'

import CreateInvoiceSummaryReportModal from './components/CreateInvoiceSummaryReportModal'
import ReportResultTable from './components/ReportResultTable'
import SearchReportSection from './components/SearchReportSection'
import useReport from './hooks/useReport'

const InvoiceSummaryReport = () => {
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
  } = useReport(REPORT_NAME.INVOICE_SUMMARY)

  return (
    <div>
      <PageHeader
        pageTitle="Invoice Summary"
        breadcrumbItems={[
          {
            title: 'Report',
          },
          {
            title: 'Invoice Summary',
          },
        ]}
      />
      <SearchReportSection
        reportName="Invoice Summary/สรุปรายการออกใบแจ้งหนี้"
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
        reportName={REPORT_NAME.INVOICE_SUMMARY}
        reports={reports}
        loading={isLoadingReports}
        onSearchReport={onSearchReport}
        siteCode={siteCode}
      />

      {/* Create Report Modal */}
      {/* Only mount the modal when needed for better performance */}
      {isModalMounted && (
        <CreateInvoiceSummaryReportModal
          title="Invoice Summary/สรุปรายการออกใบแจ้งหนี้"
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

export default InvoiceSummaryReport
