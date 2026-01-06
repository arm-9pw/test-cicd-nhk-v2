import { useState } from 'react'

import { useGetBudgetAllocationsQuery } from 'api/allocateManagementApi'
import { OrganizationListType } from 'api/allocateManagementApi.types'
import useCustomModal from 'hooks/useCustomModal'

import { PAGE_SIZE } from 'constants/index'

import { useDebounce } from 'use-debounce'

type PaginationType = {
  current: number
  pageSize: number
}

const useAllocateManagementPage = () => {
  const editOrgModal = useCustomModal()
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationListType | null>(
    null,
  )
  const [searchText, setSearchText] = useState('')
  const [debouncedText] = useDebounce(searchText, 500)
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: PAGE_SIZE,
  })
  const { data, isFetching, isError } = useGetBudgetAllocationsQuery(
    {
      page: pagination.current || 1,
      pageSize: pagination.pageSize || PAGE_SIZE,
      name: debouncedText,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleClickRow = (record: OrganizationListType) => {
    setSelectedOrganization(record)
    editOrgModal.showModal()
  }

  const closeEditOrgModal = () => {
    editOrgModal.handleCancel()
    setSelectedOrganization(null)
  }

  // NOTE: Custom Pagination
  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      current: prev.current + 1,
    }))
  }

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      current: prev.current - 1,
    }))
  }

  return {
    organizations: isError ? [] : data || [],
    loading: isFetching,
    selectedOrganization,
    handleClickRow,
    closeEditOrgModal,
    editOrgModal,
    handleSearch,
    searchText,
    handleNextPage,
    handlePrevPage,
    pagination,
  }
}

export default useAllocateManagementPage
