import { useEffect, useMemo, useState } from 'react'

import { Select, SelectProps } from 'antd'

import { useGetOrganizationsTypesQuery } from 'api/siteManagementApi'
import { OrganizationResponseType } from 'api/siteManagementApi.types'

import debounce from 'lodash/debounce'

export type OrganizationOptionType = OrganizationResponseType & {
  value: string
  label: string
}

type OrganizationDropdownProps = SelectProps 

const OrganizationDropdown = ({  ...selectProps }: OrganizationDropdownProps) => {
  const [searchParam, setSearchParam] = useState('')
  const [currentOptions, setCurrentOptions] = useState<OrganizationOptionType[]>([])
  const { data, isFetching, isLoading, isError } = useGetOrganizationsTypesQuery(
    { alternativeName: searchParam },
  )

  useEffect(() => {
    if (data) {
      const _options = data.map((item) => ({
        ...item,
        value: item.id,
        label: item.alternativeName,
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
      loading={isFetching || isLoading}
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
export default OrganizationDropdown
