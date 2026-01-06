import { useMemo } from 'react'

import { SelectProps, Skeleton } from 'antd'

import { useListSiteQuery } from 'api/employeeApi'

import GenericDropdown from './GenericDropdown'

type SiteDropdownProps = SelectProps

const SiteDropdown: React.FC<SiteDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useListSiteQuery()

  const _options = useMemo(() => {
    return data.map((site) => ({
      ...site,
      value: site.id,
      label: site.name + ' - ' + site.alternativeName,
    }))
  }, [data])

  const renderDropdownContent = () => {
    if (isLoading) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
  }

  return (
    <GenericDropdown
      showSearch
      labelInValue={false}
      isError={isError}
      loading={isLoading}
      error={error}
      options={_options}
      notFoundContent={renderDropdownContent()}
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      {...selectProps}
    />
  )
}

export default SiteDropdown
