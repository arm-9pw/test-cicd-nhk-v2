import { useMemo } from 'react'

import { SelectOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Skeleton, Typography } from 'antd'

import { useLazyGetBudgetsQuery } from 'api/prApi'
import { BudgetItemType } from 'api/prApi.types'
import { useAppSelector } from 'app/hook'

import { selectUser } from 'features/auth/authSlice'

import debounce from 'lodash/debounce'

const { Text } = Typography

type SearchBudgetItemInputProps = {
  budgetTypeId?: number
  inputValue: string | null
  onClickButton: () => void
  onSetInputValue: (value: string) => void
  onSetValidBudgetCode: (isValid: boolean) => void
  onSetSelectedBudget?: (budget: BudgetItemType) => void
}

const SearchBudgetItemInput = ({
  budgetTypeId,
  inputValue,
  onClickButton,
  onSetInputValue,
  onSetValidBudgetCode,
}: SearchBudgetItemInputProps) => {
  const user = useAppSelector(selectUser)
  const [triggerGetBudgets, { data: budgets, isLoading, isFetching, isError, currentData }] =
    useLazyGetBudgetsQuery()

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        triggerGetBudgets({
          sizePerPage: 50,
          page: 0,
          organizationId: user?.currentOrganizationId,
          budgetCode: value,
          budgetTypeId: String(budgetTypeId),
        })

        if (currentData && currentData.length === 1) {
          // FIXME: Still need to test when API is finished
          onSetValidBudgetCode(true)
        } else {
          onSetValidBudgetCode(false)
        }
      }, 300),
    [triggerGetBudgets, budgetTypeId, currentData, onSetValidBudgetCode, user],
  )

  const options = useMemo(
    () =>
      budgets?.map((budget) => ({
        value: budget.budgetCode,
        label: budget.budgetCode,
      })) || [],
    [budgets],
  )

  // FIXME: Implement infinite scroll search
  return (
    <div style={{ display: 'flex' }}>
      <AutoComplete
        popupMatchSelectWidth
        placeholder="Budget Code"
        options={options}
        onSearch={debouncedSearch}
        value={inputValue}
        onChange={(value) => {
          // NOTE: Set value when user type
          onSetInputValue(value)
        }}
        onSelect={(_, option) => {
          // NOTE: Set value when user select value from dropdown
          onSetInputValue(option?.label || '')
        }}
        onFocus={() =>
          triggerGetBudgets({
            sizePerPage: 50,
            page: 0,
            organizationId: user?.currentOrganizationId,
            budgetTypeId: String(budgetTypeId),
          })
        }
        notFoundContent={<div> Not Found/ไม่พบที่ค้นหา </div>}
        style={{ width: '100%', marginRight: 8 }}
        dropdownRender={(menu) => {
          if (!budgetTypeId) {
            return (
              <div style={{ padding: '8px' }}>
                <Text type="secondary">Please select a "Budget Type/ชนิดงบประมาณ"</Text>
              </div>
            )
          }
          if (isError) {
            return (
              <div style={{ padding: '8px' }}>
                <Text type="secondary">
                  An error occurred while searching for data. Please try again...
                </Text>
              </div>
            )
          }
          if (isFetching || isLoading) {
            return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
          }
          return menu
        }}
        filterOption={(inputValue, option) =>
          option?.label?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
      <Button type="primary" icon={<SelectOutlined />} onClick={onClickButton} />
    </div>
  )
}

export default SearchBudgetItemInput
