import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetSiteCodesQuery } from 'api/employeeApi'

import GenericDropdown from './GenericDropdown'

type SiteCodeDropdownProps = SelectProps

const SiteCodeDropdown: React.FC<SiteCodeDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetSiteCodesQuery()

  const _options = useMemo(() => {
    return data.map((siteCode) => ({
      value: siteCode.siteCode,
      label: siteCode.siteCode,
    }))
  }, [data])

  return (
    <GenericDropdown
      showSearch
      labelInValue={false}
      isError={isError}
      loading={isLoading}
      error={error}
      options={_options}
      filterSort={(optionA, optionB) =>
        String(optionA?.label ?? '')
          .toLowerCase()
          .localeCompare(String(optionB?.label ?? '').toLowerCase())
      }
      {...selectProps}
    />
  )
}

export default SiteCodeDropdown
