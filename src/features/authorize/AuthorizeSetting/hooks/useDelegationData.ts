import { useEffect, useState } from 'react'

import dayjs from 'dayjs'

import { useLazyListDelegationsQuery } from 'api/delegationApi'
import { useNotification } from 'hooks/useNotification'
import usePagination from 'hooks/usePagination'

import { TAB_KEYS, TabKey } from '../constants'
import { SearchFilters } from '../types'

export const useDelegationData = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.DELEGATE_TO)
  const [page, setPage] = useState(1)
  const [sizePerPage, setSizePerPage] = useState(20)
  const { handleNextPage, handlePrevPage } = usePagination({
    setPage,
    setSizePerPage,
  })

  const getDefaultDateRange = () => {
    const today = dayjs()
    const next30Days = dayjs().add(30, 'day')
    return {
      activatedDate: today.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
      expiredDate: next30Days.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
    }
  }

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    page: page - 1,
    sizePerPage,
    activeOnly: false,
    isDelegate: false,
    ...getDefaultDateRange(),
  })
  const { openNotification } = useNotification()

  const [triggerSearch, { data: delegations = [], isFetching, error }] =
    useLazyListDelegationsQuery()

  // Initial data fetch on component mount
  useEffect(() => {
    triggerSearch(searchFilters)
  }, [triggerSearch, searchFilters]) // Include dependencies

  useEffect(() => {
    if (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message
      console.error('Error loading delegations:', errorMessage)
      openNotification({
        type: 'error',
        title: 'Error Loading Delegations',
        description: errorMessage || 'Failed to fetch delegation data. Please try again.',
      })
    }
  }, [error, openNotification])

  const handleSearch = (filters: SearchFilters) => {
    // Handle date range conversion
    let activatedDate: string | undefined
    let expiredDate: string | undefined

    if (filters.authorizePeriod && filters.authorizePeriod.length === 2) {
      const [startDate, endDate] = filters.authorizePeriod
      activatedDate = startDate.format('YYYY-MM-DDT00:00:00')
      expiredDate = endDate.format('YYYY-MM-DDT23:59:59')
    }

    const searchParams: SearchFilters = {
      page: page - 1,
      sizePerPage,
      activeOnly: filters.activeOnly || false,
      activatedDate,
      expiredDate,
      delegateId: filters.delegatePersonId,
      isDelegate: activeTab === TAB_KEYS.DELEGATOR,
    }

    if (activeTab === TAB_KEYS.DELEGATOR) {
      delete searchParams.activeOnly
      delete searchParams.delegatorId
    }

    setSearchFilters(searchParams)
    triggerSearch(searchParams)
  }

  const handleReset = () => {
    const resetParams = {
      page: 0,
      sizePerPage,
      isDelegate: activeTab === TAB_KEYS.DELEGATOR,
      ...getDefaultDateRange(),
    }
    setSearchFilters(resetParams)
    triggerSearch(resetParams)
  }

  const handleNextDelegationPage = () => {
    handleNextPage()
    const nextPageParams = {
      ...searchFilters,
      page: page, // page will be updated by handleNextPage
    }
    triggerSearch(nextPageParams)
  }

  const handlePrevDelegationPage = () => {
    handlePrevPage()
    const prevPageParams = {
      ...searchFilters,
      page: page - 2, // page will be updated by handlePrevPage
    }
    triggerSearch(prevPageParams)
  }

  const handleTabChange = (key: string) => {
    const params = {
      ...searchFilters,
      isDelegate: key === TAB_KEYS.DELEGATOR,
      page: 0,
    }
    triggerSearch(params)
    setSearchFilters(params)
    setActiveTab(key as TabKey)
  }

  return {
    delegations,
    isLoading: isFetching,
    handleSearch,
    handleReset,
    searchFilters,
    // Tab state
    activeTab,
    handleTabChange,
    // Pagination
    page,
    sizePerPage,
    handleNextPage: handleNextDelegationPage,
    handlePrevPage: handlePrevDelegationPage,
  }
}
