import { useEffect, useMemo, useState } from 'react'

import { useGetBudgetManagementQuery } from 'api/budgetManagementApi'
import { BudgetsResponseType } from 'api/budgetManagementApi.types'
import useCustomModal from 'hooks/useCustomModal'

import { PAGE_SIZE } from 'constants/index'

import debounce from 'lodash/debounce'

type PaginationType = {
  current: number
  pageSize: number
}

const useBudgetManagement = () => {
  const editBudgetModal = useCustomModal()
  const [selectedBudget, setSelectedBudget] = useState<BudgetsResponseType | null>(null)
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: PAGE_SIZE,
  })
  // Local state for managing budgets data
  const [localBudgets, setLocalBudgets] = useState<BudgetsResponseType[]>([])
  
  const { data, isFetching, isError } = useGetBudgetManagementQuery(
    {
      page: pagination.current || 1,
      pageSize: pagination.pageSize || PAGE_SIZE,
      budgetCode: debouncedSearchText,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )
  
  // Update local state when API data changes
  useEffect(() => {
    if (data) {
      setLocalBudgets(data)
    }
  }, [data])

  // Function to update specific budget in local state
  const updateBudgetInList = (updatedBudget: BudgetsResponseType) => {
    setLocalBudgets(prev => 
      prev.map(budget => 
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    )
  }

  const openEditBudgetModal = () => {
    editBudgetModal.showModal()
  }

  const closeEditBudgetModal = () => {
    editBudgetModal.handleCancel()
    setSelectedBudget(null)
  }

  const handleClickRow = (record: BudgetsResponseType) => {
    setSelectedBudget(record)
    openEditBudgetModal()
  }

  // NOTE: Search Budget
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
    budgets: isError ? [] : localBudgets,
    loading: isFetching,
    editBudgetModal,
    openEditBudgetModal,
    closeEditBudgetModal,
    handleClickRow,
    selectedBudget,
    searchText,
    handleSearch,
    pagination,
    handleNextPage,
    handlePrevPage,
    updateBudgetInList,
  }
}

export default useBudgetManagement
