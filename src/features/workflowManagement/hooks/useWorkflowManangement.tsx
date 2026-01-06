import { useState } from 'react'

import { useGetListWorkflowsQuery } from 'api/workflowManagementApi'
import { WorkflowManagemantType, WorkflowQueryParams } from 'api/workflowManangement.types'
import useCustomModal from 'hooks/useCustomModal'
import usePagination from 'hooks/usePagination'

type UseWorkflowManagementProps = {
  workflowModalHook: ReturnType<typeof useCustomModal>
}
export const useWorkflowManagement = ({ workflowModalHook }: UseWorkflowManagementProps) => {

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowManagemantType | null>(null)
  const [queryParams, setQueryParams] = useState<WorkflowQueryParams>({})

  const [page, setPage] = useState(1)
  const [sizePerPage, setSizePerPage] = useState(10)

  const { handleNextPage, handlePrevPage } = usePagination({
    setPage,
    setSizePerPage,
  })

  const {
    data: workflowListData,
    isFetching,
    isError,
    refetch: refetchList,
  } = useGetListWorkflowsQuery(
    {
      page,
      sizePerPage,
      ...queryParams,
    },
  )

  const handleSearchWorkflow = (params: WorkflowQueryParams) => {
    setPage(1)
    setQueryParams(params)
    refetchList()
  }

  const handleResetSearch = () => {
    setPage(1)
    setQueryParams({})
    refetchList()
  }

  const handleRowClick = (record: WorkflowManagemantType) => {
    setSelectedWorkflow(record)
    workflowModalHook.showModal()
  }

  const OpenEditWorkflowModal = () => {
    workflowModalHook.showModal()
  }

  const closeEditWorkflowModal = () => {
    workflowModalHook.handleCancel()
    setSelectedWorkflow(null)
  }

  const openCreateWorkflow = () => {
    setSelectedWorkflow(null)
    workflowModalHook.showModal()
  }
  return {
    workflowListData: isError ? [] : workflowListData || [],
    loading: isFetching,
    handleNextPage,
    handleSearchWorkflow,
    handlePrevPage,
    handleRowClick,
    OpenEditWorkflowModal,
    closeEditWorkflowModal,
    selectedWorkflow,
    openCreateWorkflow,
    page,
    sizePerPage,
    handleResetSearch,
    queryParams,
    setSelectedWorkflow
  }
}
