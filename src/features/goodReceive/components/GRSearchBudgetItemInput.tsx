import { useMemo } from 'react'

import { SelectOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Skeleton, Typography } from 'antd'

import { UserInfoType } from 'api/authApi.types'
import { useLazyGetBudgetsQuery } from 'api/prApi'
import { BudgetItemType } from 'api/prApi.types'

import debounce from 'lodash/debounce'

const { Text } = Typography

type GRSearchBudgetItemInputProps = {
  budgetTypeId?: number
  inputValue: string | null
  onClickButton: () => void
  onSetInputValue: (value: string) => void
  // onSetValidBudgetCode: (isValid: boolean) => void
  onSetSelectedBudget?: (budget: BudgetItemType) => void
  disabled?: boolean
  onFocus?: () => void
  onBlur?: () => void
  width?: number
  user: UserInfoType | null
}

const GRSearchBudgetItemInput = ({
  budgetTypeId,
  inputValue,
  onClickButton,
  onSetInputValue,
  // onSetValidBudgetCode,
  disabled,
  onFocus,
  onBlur,
  width,
  user,
}: GRSearchBudgetItemInputProps) => {
  const [
    triggerGetBudgets,
    {
      data: budgets,
      isLoading,
      isFetching,
      isError,
      //currentData
    },
  ] = useLazyGetBudgetsQuery()

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        triggerGetBudgets({
          organizationId: user?.currentOrganizationId,
          budgetCode: value,
          // budgetTypeId: String(budgetTypeId),
          page: 0,
          sizePerPage: 20,
        })

        // if (currentData && currentData.length === 1) {
        //   // FIXME: Still need to test when API is finished
        //   onSetValidBudgetCode(true)
        // } else {
        //   onSetValidBudgetCode(false)
        // }
      }, 300), // 300ms delay
    [triggerGetBudgets, user?.currentOrganizationId],
  )

  const options = useMemo(
    () =>
      budgets?.map((budget) => ({
        value: budget.budgetCode,
        label: budget.budgetCode + ' : ' + budget.budgetDescription,
      })) || [],
    [budgets],
  )

  // FIXME: Implement infinite scroll search
  return (
    <div style={{ display: 'flex' }}>
      <AutoComplete
        popupMatchSelectWidth={false}
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
        onFocus={() => {
          triggerGetBudgets({
            organizationId: user?.currentOrganizationId,
            budgetCode: inputValue ? inputValue : '',
            budgetTypeId: '1',
            page: 0,
            sizePerPage: 20,
          })

          if (onFocus) {
            onFocus()
          }
        }}
        onBlur={() => {
          if (onBlur) {
            onBlur()
          }
        }}
        notFoundContent={<div> Not Found/ไม่พบที่ค้นหา </div>}
        style={{ width: width, marginRight: 8 }}
        dropdownRender={(menu) => {
          if (!budgetTypeId) {
            return (
              <div style={{ padding: '8px', width: width }}>
                <Text type="secondary">Please select a "Budget Type/ชนิดงบประมาณ"</Text>
              </div>
            )
          }
          if (isError) {
            return (
              <div style={{ padding: '8px', width: width }}>
                <Text type="secondary">An error occurred while searching for data.</Text>
              </div>
            )
          }
          if (isFetching || isLoading) {
            return <Skeleton active paragraph={{ rows: 3, width: width }} title={false} />
          }
          return menu
        }}
        filterOption={(inputValue, option) =>
          option?.label?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        disabled={disabled}
      />
      <Button
        type="primary"
        icon={<SelectOutlined />}
        onClick={onClickButton}
        disabled={disabled}
      />
    </div>
  )
}

export default GRSearchBudgetItemInput
