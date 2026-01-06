import { useEffect, useMemo, useState } from 'react'

import { useGetItemManagementQuery } from 'api/itemManagementApi'
import { ItemManagementRespType } from 'api/itemManagementApiType'
import useCustomModal from 'hooks/useCustomModal'

// import { PAGE_SIZE } from 'constants/index'

import debounce from 'lodash/debounce'

type PaginationType = {
  current: number
  pageSize: number
}

export const useItemManagement = () => {
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 99,
  })
  const [selectedItem, setSelectedItem] = useState<ItemManagementRespType | null>(null)
  const editItemModal = useCustomModal()

  const { data, isFetching, error, isError } = useGetItemManagementQuery(
    {
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 99,
      name: debouncedSearchText,
      model: debouncedSearchText,
      brand: debouncedSearchText,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const openEditItemModal = () => {
    editItemModal.showModal()
  }

  const closeEditItemModal = () => {
    editItemModal.handleCancel()
    setSelectedItem(null)
  }

  const handleRowClick = (record: ItemManagementRespType) => {
    setSelectedItem(record)
    openEditItemModal()
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

  return {
    itemsMater: isError ? [] : data || [],
    loading: isFetching,
    searchText,
    pagination,
    handleSearch,
    handleRowClick,
    selectedItem,
    editItemModal,
    closeEditItemModal,
    error,
    openEditItemModal,
  }
}
