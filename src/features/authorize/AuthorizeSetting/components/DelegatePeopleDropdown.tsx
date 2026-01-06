import { Select, SelectProps } from 'antd'

import { useListDelegatePeopleQuery } from 'api/delegationApi'
import { useAppSelector } from 'app/hook'

import { selectUser } from 'features/auth/authSlice'

interface Props extends Omit<SelectProps, 'options' | 'loading' | 'onSelect'> {
  positionId?: string
}

const DelegatePeopleDropdown = ({ positionId, ...selectProps }: Props) => {
  const user = useAppSelector(selectUser)

  const {
    data: delegatePeople = [],
    isLoading,
    error,
  } = useListDelegatePeopleQuery({
    organizationId: user?.currentOrganizationId,
    positionId,
  })

  const options = delegatePeople.map((person) => ({
    label: `${person.employeeName} - ${person.posName}`,
    value: person.employeeId.toString(),
    ...person,
  }))

  return (
    <Select
      {...selectProps}
      showSearch
      allowClear
      loading={isLoading}
      options={options}
      placeholder={error ? 'Error loading authorize people' : 'Select authorize person'}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      optionFilterProp="label"
    />
  )
}

export default DelegatePeopleDropdown
