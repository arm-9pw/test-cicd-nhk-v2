import { useCallback } from 'react'

import { Form, Skeleton } from 'antd'

import { useLazyGetEmployeesQuery } from 'api/employeeApi'
import { EmployeeUserType } from 'api/employeeApi.types'

import DebounceSelect from 'components/DebounceSelect'

type EmployeeDropdownProps = {
  onSetselectedEmployee?: (employee: EmployeeUserType) => void
  formName?: string
  formLabel?: string
  selectedEmployee?: EmployeeUserType | null
  defaultOptions?: EmployeeTypeDropdown[]
}

export type EmployeeTypeDropdown = EmployeeUserType & {
  label: string
  value: string
}

const EmployeeDropdown = ({
  selectedEmployee,
  onSetselectedEmployee,
  defaultOptions = [],
  formName,
  formLabel = 'Employee',
}: EmployeeDropdownProps) => {
  const [triggerGetEmployees, { isFetching }] = useLazyGetEmployeesQuery()

  const fetchEmployeeOptions = useCallback(
    async (search: string): Promise<EmployeeTypeDropdown[]> => {
      try {
        const result = await triggerGetEmployees({
          search,
          page: 1,
          pageSize: 100,
        }).unwrap()

        // Transform the API response to the format expected by DebounceSelect
        return result.map((employee) => ({
          ...employee,
          label: [employee.prefixEn || '', employee.firstNameEn || '', employee.lastNameEn || '']
            .filter(Boolean)
            .join(' '),
          value: employee.id,
        }))
      } catch (error) {
        console.error('Error fetching employee options:', error)
        return []
      }
    },
    [triggerGetEmployees],
  )

  const renderDropdownContent = () => {
    if (isFetching) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
  }

  // Common DebounceSelect component with shared props
  const employeeSelect = (
    <DebounceSelect
      showSearch
      allowClear
      disableFilterOption
      placeholder="< กรุณาเลือก >"
      defaultOptions={defaultOptions}
      fetchOptions={fetchEmployeeOptions}
      value={selectedEmployee?.id}
      onChange={(_, option) => {
        if (onSetselectedEmployee) {
          onSetselectedEmployee(option as EmployeeUserType)
        }
      }}
      notFoundContent={renderDropdownContent()}
    />
  )

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '80%', flex: 1, marginRight: '4px' }}>
        {formName ? (
          <Form.Item label={formLabel} name={formName}>
            {employeeSelect}
          </Form.Item>
        ) : (
          employeeSelect
        )}
      </div>
    </div>
  )
}

export default EmployeeDropdown
