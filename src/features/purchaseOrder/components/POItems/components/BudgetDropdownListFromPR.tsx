import { Select } from 'antd'

import { BudgetItemType } from 'api/prApi.types'

import { BudgetItemTypeDropdown } from 'features/purchaseRequisition/components/BudgetItemDropdown'

type Props = {
  selectedBudget?: BudgetItemType | null
  onSetSelectedBudget: (budget: BudgetItemType) => void
  budgetListFromPR: BudgetItemTypeDropdown[]
}

const BudgetDropdownListFromPR = ({
  selectedBudget,
  onSetSelectedBudget,
  budgetListFromPR,
}: Props) => {
  return (
    <Select
      showSearch
      value={selectedBudget?.budgetId}
      placeholder="Budget Code"
      optionFilterProp="label"
      onChange={(_, option) => {
        console.log('option', option)
        onSetSelectedBudget(option as BudgetItemType)
      }}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={budgetListFromPR}
    />
  )
}

export default BudgetDropdownListFromPR
