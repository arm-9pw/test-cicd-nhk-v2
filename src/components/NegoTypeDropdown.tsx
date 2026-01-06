import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetNegoTypesQuery } from 'api/masterApi'

import GenericDropdown from './GenericDropdown'

type NegoTypeDropdownProps = SelectProps

const NegoTypeDropdown: React.FC<NegoTypeDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetNegoTypesQuery({})

  const _options = useMemo(() => {
    return data.map((negoType) => ({
      value: negoType.id,
      label: negoType.name,
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

export default NegoTypeDropdown
