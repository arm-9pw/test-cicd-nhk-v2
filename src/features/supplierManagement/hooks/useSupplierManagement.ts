import { useEffect, useMemo, useState } from 'react'

import { useGetSuppliersManagementQuery } from 'api/supplier'
import { SupplierType } from 'api/supplierApi.types'
import useCustomModal from 'hooks/useCustomModal'

import { PAGE_SIZE } from 'constants/index'

import debounce from 'lodash/debounce'

type PaginationType = {
  current: number
  pageSize: number
}

export const useSupplierManagement = () => {
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [pagination, setPagination] = useState<PaginationType>({ current: 1, pageSize: PAGE_SIZE })
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierType | null>(null)
  const editSupplierModal = useCustomModal()

  const { data, isFetching, error, isError } = useGetSuppliersManagementQuery(
    {
      supplierCode: debouncedSearchText,
      page: pagination.current,
      pageSize: pagination.pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const openEditSupplierModal = () => {
    editSupplierModal.showModal()
  }

  const closeEditSupplierModal = () => {
    editSupplierModal.handleCancel()
    setSelectedSupplier(null)
  }

  const handleRowClick = (record: SupplierType) => {
    setSelectedSupplier(record)
    openEditSupplierModal()
  }

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

  return {
    suppliers: isError ? [] : data || [],
    loading: isFetching,
    handlePrevPage,
    editSupplierModal,
    openEditSupplierModal,
    closeEditSupplierModal,
    error,
    searchText,
    pagination,
    selectedSupplier,
    handleSearch,
    handleRowClick,
    handleNextPage,
  }
}
