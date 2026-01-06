import { useEffect, useState } from 'react'

import { useCreateReportJobMutation, useLazyListReportsQuery } from 'api/reportApi'
import { AdditionBatchParams } from 'api/reportApi.types'
import useCustomModal from 'hooks/useCustomModal'

const useReport = (jobName: string) => {
  const { showModal, handleCancel, afterClose, isModalVisible, isModalMounted } = useCustomModal()

  // Use lazy query - only triggers when explicitly called
  const [triggerSearch, { data: reports = [], isFetching: isLoadingReports, isError, error }] =
    useLazyListReportsQuery()
  const [createReportJob, { isLoading: isCreatingReport }] = useCreateReportJobMutation()

  const [siteCode, setSiteCode] = useState<string | undefined>('')

  useEffect(() => {
    // Fetch reports when the component first mounts
    triggerSearch({ siteCode: '', jobName })
  }, [jobName, triggerSearch]) // Dependency array to re-fetch if jobName changes

  const onSearchReport = (siteCode: string | undefined) => {
    setSiteCode(siteCode)
    // Explicitly trigger the search with parameters
    triggerSearch({ siteCode: siteCode ?? '', jobName })
  }

  const onResetSearch = () => {
    setSiteCode('')
    // Trigger search with empty siteCode
    triggerSearch({ siteCode: '', jobName })
  }

  const onCreateReport = async (jobName: string, additionBatchParams: AdditionBatchParams) => {
    return createReportJob({ jobName, additionBatchParams }).unwrap()
  }

  return {
    // MODAL
    showModal,
    handleCancel,
    afterClose,
    isModalVisible,
    isModalMounted,

    // REPORTS
    reports,
    isLoadingReports,
    isError,
    error,
    isCreatingReport,
    siteCode,

    // FUNCTIONS
    onSearchReport,
    onResetSearch,
    onCreateReport,
  }
}

export default useReport
