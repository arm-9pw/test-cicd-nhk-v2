import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetListSiteQuery } from 'api/enquiryApi'

import GenericDropdown from 'components/GenericDropdown'

type SiteCodeDropdownProps = SelectProps

const SiteCodeDropdown: React.FC<SiteCodeDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetListSiteQuery()

  const _options = useMemo(() => {
    return data.map((site) => ({
      value: site.siteCode,
      label: site.siteCode,
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
        String(optionA?.label ?? '').toLowerCase().localeCompare(String(optionB?.label ?? '').toLowerCase())
      }
      {...selectProps}
    />
  )
}

export default SiteCodeDropdown