import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetMaingroupsQuery } from 'api/masterApi'

import GenericDropdown from './GenericDropdown'

type MainGroupDropdownProps = SelectProps

const MainGroupDropdown: React.FC<MainGroupDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetMaingroupsQuery()

  const _options = useMemo(() => {
    return data.map((maingroup) => ({
      ...maingroup,
      value: maingroup.id,
      label: maingroup.mainGroupName,
    }))
  }, [data])

  return (
    <GenericDropdown
      isError={isError}
      loading={isLoading}
      error={error}
      options={_options}
      {...selectProps}
    />
  )
}

export default MainGroupDropdown
