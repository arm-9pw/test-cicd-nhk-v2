import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetBudgetTypesQuery } from 'api/masterApi'

import GenericDropdown from './GenericDropdown'

type BudgetTypeDropdownProps = SelectProps & {
  includeAllOption?: boolean
}

const BudgetTypeDropdown: React.FC<BudgetTypeDropdownProps> = ({
  includeAllOption = false,
  ...selectProps
}) => {
  const { data = [], isLoading, isError, error } = useGetBudgetTypesQuery()

  const _options = useMemo(() => {
    const baseOptions = data.map((budgetType) => ({
      value: budgetType.id,
      label: budgetType.budgetTypeName,
    }))
    return includeAllOption
      ? [{ value: 'ALL', label: 'All / เลือกทั้งหมด' }, ...baseOptions]
      : baseOptions
  }, [data, includeAllOption])

  return (
    <GenericDropdown
      placeholder="< กรุณาเลือก >"
      isError={isError}
      loading={isLoading}
      error={error}
      options={_options}
      {...selectProps}
    />
  )
}

export default BudgetTypeDropdown
