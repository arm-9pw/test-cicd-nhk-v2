import { useEffect, useMemo, useState } from 'react'

import { useGetSiteManagementQuery } from 'api/siteManagementApi'
import { SiteManagementResponseType } from 'api/siteManagementApi.types'
import useCustomModal from 'hooks/useCustomModal'

import { PAGE_SIZE } from 'constants/index'

import debounce from 'lodash/debounce'

type PaginationType = {
  current: number
  pageSize: number
}

const useSiteManagement = () => {
  const editSiteModal = useCustomModal()
  const [selectedSite, setSelectedSite] = useState<SiteManagementResponseType | null>(null)
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: PAGE_SIZE,
  })

  const { data, isFetching, isError } = useGetSiteManagementQuery(
    {
      page: pagination.current || 1,
      pageSize: pagination.pageSize || PAGE_SIZE,
      siteCode: debouncedSearchText,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const openEditSiteModal = () => {
    editSiteModal.showModal()
  }

  const closeEditSiteModal = () => {
    editSiteModal.handleCancel()
    setSelectedSite(null)
  }

  const handleClickRow = (record: SiteManagementResponseType) => {
    setSelectedSite(record)
    openEditSiteModal()
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
    sites: isError ? [] : data || [],
    loading: isFetching,
    editSiteModal,
    openEditSiteModal,
    closeEditSiteModal,
    handleClickRow,
    selectedSite,
    searchText,
    handleSearch,
  }
}
export default useSiteManagement
