import { useCallback } from 'react'
import { Empty, Form, Skeleton } from 'antd'
import { useLazyGetAllBudgetQuery } from 'api/enquiryApi'
import DebounceSelect from 'components/DebounceSelect'

type Props = {
  formName?: string
  formLabel?: string
}

const SearchBudgetDropdown = ({ formName, formLabel }: Props) => {
  const [triggerGetBudget, { data = [], currentData, isFetching }] = useLazyGetAllBudgetQuery()

  const fetchBudgetOptions = useCallback(
    async (searchText: string) => {
      try {
        const result = await triggerGetBudget({
          page: 0, // ✅ fix ค่าตรงนี้ ไม่ต้องให้ส่งมาจากข้างนอก
          pageSize: 100,
          budgetCode: searchText,
          budgetDescription: searchText,
        }).unwrap()
  
        return result.map((budget) => ({
          ...budget,
          value: budget.id,
          label: `${budget.budgetCode} - ${budget.budgetDescription}`, // โชว์ code กับ name
        }))
      } catch (error) {
        console.error('Error fetching budget options:', error)
        return []
      }
    },
    [triggerGetBudget],
  )

  const renderDropdownContent = () => {
    if (data.length === 0 && !currentData) {
      return <Empty description="กรุณาพิมพ์เพื่อค้นหา Budget Code" />
    }
    if (isFetching) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
    return null
  }

  const budgetSelect = (
    <DebounceSelect
      showSearch
      allowClear
      disableFilterOption
      placeholder="< กรุณาเลือก/ค้นหา Budget Code >"
      fetchOptions={fetchBudgetOptions}
      notFoundContent={renderDropdownContent()}
    />
  )

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '80%', flex: 1, marginRight: '4px' }}>
        {formName ? (
          <Form.Item label={formLabel} name={formName}>
            {budgetSelect}
          </Form.Item>
        ) : (
          budgetSelect
        )}
      </div>
    </div>
  )
}

export default SearchBudgetDropdown