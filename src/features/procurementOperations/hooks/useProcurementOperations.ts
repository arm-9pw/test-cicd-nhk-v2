import { useState } from 'react'
import { useEffect } from 'react'

import { useGetProcurementCountsQuery, useListProcurementOperationsQuery } from 'api/procurementApi'
import {
  ProcurementContext,
  ProcurementQueryParams,
  ProcurementStatus,
} from 'api/procurementApi.types'
import usePagination from 'hooks/usePagination'

import { STATUS_CONFIGS } from './procurementConfig'

export const useProcurementOperations = (defaultContext: ProcurementContext) => {
  const [selectedStatus, setSelectedStatus] = useState<ProcurementStatus | null>(
    STATUS_CONFIGS[defaultContext][0].status,
  )

  // Reset selectedStatus when defaultContext changes
  useEffect(() => {
    setSelectedStatus(STATUS_CONFIGS[defaultContext][0].status)
  }, [defaultContext])

  const [queryParams, setQueryParams] = useState<ProcurementQueryParams>({})
  const [page, setPage] = useState(1)
  const [sizePerPage, setSizePerPage] = useState(10)

  const { handleNextPage, handlePrevPage, handlePageChange } = usePagination({
    setPage,
    setSizePerPage,
  })

  // API queries
  const {
    currentData = [],
    isFetching: isTableLoading,
    refetch: refetchList,
  } = useListProcurementOperationsQuery(
    {
      domain: defaultContext,
      groupState: selectedStatus || '',
      page,
      sizePerPage,
      ...queryParams,
    },
    // { refetchOnFocus: true },
  )

  const {
    data: countData = [],
    isFetching: isLoadingCounts,
    refetch: refetchCounts,
  } = useGetProcurementCountsQuery(
    {
      domain: defaultContext,
      ...queryParams,
    },
    // { refetchOnFocus: true },
  )

  const statusCounts = countData.reduce(
    (acc, item) => {
      acc[item.status] = item.amount
      return acc
    },
    {} as Record<ProcurementStatus, number>,
  )

  const handleStatusChange = async (status: ProcurementStatus) => {
    setSelectedStatus(status)
    setPage(1)
    refetchList()
    refetchCounts()
    // setQueryParams({})
  }

  const handleSearchProcurement = (params: ProcurementQueryParams) => {
    setSelectedStatus(null)
    handlePageChange(1)
    setQueryParams({ ...params, domain: defaultContext })
    refetchList()
    refetchCounts()
  }

  const handleResetSearch = () => {
    setSelectedStatus(STATUS_CONFIGS[defaultContext][0].status)
    handlePageChange(1)
    setQueryParams({})
  }

  return {
    tableData: currentData,
    isTableLoading,
    isLoadingCounts,
    selectedStatus,
    statusCounts,
    handleStatusChange,
    handleSearchProcurement,
    handleResetSearch,

    // Pagination
    page,
    sizePerPage,
    handleNextPage,
    handlePrevPage,
  }
}
