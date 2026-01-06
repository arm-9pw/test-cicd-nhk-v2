import { useEffect, useMemo, useState } from 'react'

import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { useGetEmployeesQuery } from 'api/employeeApi'
import { EmployeeUserType, PositionType, } from 'api/employeeApi.types'
import useCustomModal from 'hooks/useCustomModal'

import { PAGE_SIZE } from 'constants/index'

import debounce from 'lodash/debounce'

type UseUserManagementReturnType = {
  users: EmployeeUserType[]
  loading: boolean
  error?: FetchBaseQueryError | SerializedError
  searchText: string
  pagination: PaginationType
  detailVisible: boolean
  selectedEmployee: EmployeeUserType | null
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRowClick: (record: EmployeeUserType) => void
  handleNextPage: () => void
  handlePrevPage: () => void
  hideDetail: () => void
  onEditPosition: (position: PositionType) => void
  selectedPosition: PositionType | null
  positionModal: ReturnType<typeof useCustomModal>
  hidePositionModal: () => void
  onAddPosition: () => void
  createUserModal: ReturnType<typeof useCustomModal>
  openCreateUserModal: () => void
  closeCreateUserModal: () => void
}

type PaginationType = {
  current: number
  pageSize: number
}

export const useUserManagement = (): UseUserManagementReturnType => {
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: PAGE_SIZE,
  })
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeUserType | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<PositionType | null>(null)
  const positionModal = useCustomModal()
  const createUserModal = useCustomModal()


  // NOTE: API Call - List Employees
  const { data, isFetching, isError } = useGetEmployeesQuery(
    {
      page: pagination.current || 1,
      pageSize: pagination.pageSize || PAGE_SIZE,
      search: debouncedSearchText,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  // NOTE: Search Employees
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchText(value)
        setPagination((prev) => ({ ...prev, current: 1 }))
      }, 800),
    [setDebouncedSearchText, setPagination],
  )

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel()
    }
  }, [debouncedSetSearch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)
    debouncedSetSearch(value)
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

  // NOTE: Handle Employee Detail
  const handleRowClick = (record: EmployeeUserType) => {
    setDetailVisible(true)
    setSelectedEmployee(record)
  }

  const hideDetail = () => {
    setDetailVisible(false)
    setSelectedEmployee(null)
  }

  // NOTE: Handle Edit Employee Position
  const onEditPosition = (position: PositionType) => {
    setSelectedPosition(position)
    positionModal.showModal()
  }

  const hidePositionModal = () => {
    setSelectedPosition(null)
    positionModal.handleCancel()
  }

  const onAddPosition = () => {
    positionModal.showModal()
  }

  const openCreateUserModal = () => {
    createUserModal.showModal()
  }

  const closeCreateUserModal = () => {
    createUserModal.handleCancel()
  }

  return {
    users: isError ? [] : data || [],
    loading: isFetching,
    searchText,
    pagination,
    detailVisible,
    selectedEmployee,
    handleSearch,
    handleRowClick,
    handleNextPage,
    handlePrevPage,
    hideDetail,
    onEditPosition,
    selectedPosition,
    positionModal,
    hidePositionModal,
    onAddPosition,
    createUserModal,
    openCreateUserModal,
    closeCreateUserModal,
  }
}