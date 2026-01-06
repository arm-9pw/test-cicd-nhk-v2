import { useEffect, useMemo, useState } from 'react'

import { Select, SelectProps } from 'antd'

import { useGetBudgetManagementQuery } from 'api/budgetManagementApi'
import { BudgetsResponseType } from 'api/budgetManagementApi.types'

import debounce from 'lodash/debounce'

export type BudgetDropdownType = BudgetsResponseType & {
  value: string
  label: string
}

type BudgetDropdownProps = SelectProps

const BudgetDropdown = ({ ...selectProps }: BudgetDropdownProps) => {
  const [searchParam, setSearchParam] = useState('')
  const [currentOptions, setCurrentOptions] = useState<BudgetDropdownType[]>([])
  const { data, isFetching, isLoading, isError } = useGetBudgetManagementQuery({
    budgetCode: searchParam,
  })

  useEffect(() => {
    if (data) {
      const _options = data.map((item) => ({
        ...item,
        value: item.id,
        label: item.budgetCode,
      }))
      setCurrentOptions(_options)
    }
  }, [data])

  const debounceSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParam(value)
      }, 800),
    [setSearchParam],
  )

  const onSearch = (value: string) => {
    debounceSetSearch(value)
  }

  if (isError) {
    return <Select disabled placeholder="Error loading options" />
  }

  return (
    <Select
      showSearch
      labelInValue
      placeholder="< กรุณาเลือก >"
      disabled={isLoading}
      loading={isFetching}
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      onSearch={onSearch}
      options={currentOptions}
      {...selectProps}
    />
  )
}

export default BudgetDropdown
