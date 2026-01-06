import { SelectProps } from 'antd'

import GenericDropdown from './GenericDropdown'

type BudgetYearDropdownProps = SelectProps

const BudgetYearDropdown: React.FC<BudgetYearDropdownProps> = ({ ...selectProps }) => {
  // Generate year options as numbers from 2012 to (current year + 1)
  const currentYear = new Date().getFullYear()
  const _options = Array.from({ length: currentYear + 1 - 2012 + 1 }, (_, idx) => 2012 + idx)
    .reverse()
    .map(
      (year) => ({ value: year, label: year }),
    )

  return (
    <GenericDropdown
      showSearch
      labelInValue={false}
      placeholder="< กรุณาเลือก >"
      isError={false}
      options={_options}
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      {...selectProps}
    />
  )
}

export default BudgetYearDropdown
