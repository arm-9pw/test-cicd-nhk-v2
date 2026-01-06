import { useMemo } from 'react'

import { SelectProps, Skeleton } from 'antd'

import { useListSiteWithPermissionQuery } from 'api/employeeApi'

import GenericDropdown from './GenericDropdown'

type SiteWithPermissionDropdownProps = SelectProps

const SiteWithPermissionDropdown: React.FC<SiteWithPermissionDropdownProps> = ({
  ...selectProps
}) => {
  const { data = [], isLoading, isError, error } = useListSiteWithPermissionQuery()

  const _options = useMemo(() => {
    return data.map((site) => ({
      ...site,
      value: site.siteCode,
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

export default SiteWithPermissionDropdown
