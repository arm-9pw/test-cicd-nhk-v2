import { useMemo } from 'react'

import { SelectProps, Skeleton } from 'antd'

import { useGetBudgetsQuery } from 'api/prApi'

import GenericDropdown from './GenericDropdown'

type LabelRender = SelectProps['labelRender']

type BudgetCodeDropdownProps = SelectProps & {
  includeAllOption?: boolean
  budgetTypeId?: string
}

const BudgetCodeDropdown: React.FC<BudgetCodeDropdownProps> = ({
  budgetTypeId,
  ...selectProps
}) => {
  const {
    data = [],
    isFetching,
    isError,
    error,
  } = useGetBudgetsQuery(
    {
      budgetTypeId,
    },
    { skip: !budgetTypeId },
  )

  const _options = useMemo(() => {
    const baseOptions = data.map((budget) => ({
      ...budget,
      label: budget.budgetCode + (budget.budgetDescription ? ' : ' + budget.budgetDescription : ''),
      value: budget.budgetId,
    }))
    return baseOptions
  }, [data])

  const labelRender: LabelRender = (props) => {
    const { label } = props

    if (isFetching) {
      return <span>Loading...</span>
    }

    if (label) {
      return label
    }
  }

  return (
    <GenericDropdown
      showSearch
      labelInValue={false}
      popupMatchSelectWidth={false}
      labelRender={labelRender}
      placeholder="< กรุณาเลือก >"
      isError={isError}
      loading={isFetching}
      error={error}
      options={_options}
      notFoundContent={
        isFetching ? <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} /> : null
      }
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      {...selectProps}
    />
  )
}

export default BudgetCodeDropdown
