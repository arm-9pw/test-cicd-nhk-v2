import { useEffect, useMemo, useState } from 'react'

import { Select, SelectProps } from 'antd'

import { useListSectionQuery } from 'api/employeeApi'
import { SiteType } from 'api/employeeApi.types'

import debounce from 'lodash/debounce'

export type OrganizationOptionType = SiteType & {
  value: string
  label: string
}

type OrganizationDropdownProps = SelectProps & {
  selectedSiteCode: string | null
}

const OrganizationDropdown = ({ selectedSiteCode, ...selectProps }: OrganizationDropdownProps) => {
  const [searchParam, setSearchParam] = useState('')
  const [currentOptions, setCurrentOptions] = useState<OrganizationOptionType[]>([])
  const { data, isFetching, isLoading, isError } = useListSectionQuery(
    { alternativeName: searchParam, siteCode: selectedSiteCode || '' },
    {
      skip: !selectedSiteCode,
    },
  )

  useEffect(() => {
    if (data) {
      const _options = data.map((item) => ({
        ...item,
        value: item.id,
        label: `${item.name} - ${item.alternativeName}`,
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
      disabled={!selectedSiteCode || isLoading}
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

export default OrganizationDropdown
