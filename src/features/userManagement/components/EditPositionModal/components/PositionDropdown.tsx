import { useEffect, useMemo, useState } from 'react'

import { Select, SelectProps } from 'antd'

import { useGetPositionsQuery } from 'api/employeeApi'
import { PositionDropdownType } from 'api/employeeApi.types'

import debounce from 'lodash/debounce'

export type PositionOptionType = PositionDropdownType & {
  value: string
  label: string
}

type PositionDropdownProps = SelectProps

const PositionDropdown = ({ ...selectProps }: PositionDropdownProps) => {
  const [searchParam, setSearchParam] = useState('')
  const [currentOptions, setCurrentOptions] = useState<PositionOptionType[]>([])
  const { data, isFetching, isLoading, isError } = useGetPositionsQuery({ posName: searchParam })

  useEffect(() => {
    if (data) {
      const _options = data.map((item) => ({
        ...item,
        value: item.id,
        label: item.posName,
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

export default PositionDropdown
