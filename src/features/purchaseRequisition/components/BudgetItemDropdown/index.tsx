import { useCallback, useEffect, useRef } from 'react'

import { Form, Select, Skeleton } from 'antd'

import { useLazyGetBudgetsQuery } from 'api/prApi'
import { BudgetItemType } from 'api/prApi.types'
import { useAppSelector } from 'app/hook'

import DebounceSelect from 'components/DebounceSelect'
import { selectUser } from 'features/auth/authSlice'

type BudgetItemDropdownProps = {
  allowClear?: boolean
  formName?: string
  formLabel?: string
  isBudgetCenter?: boolean
  budgetTypeId?: string
  selectedBudget?: BudgetItemType | null
  defaultOptions?: BudgetItemTypeDropdown[]
  forceOptions?: BudgetItemTypeDropdown[]
  maxWidth?: number
  organizationId?: string
  includeAllOption?: boolean
  onClickButton?: () => void
  onSetSelectedBudget?: (budget: BudgetItemType) => void
}

export type BudgetItemTypeDropdown = BudgetItemType & {
  label: string
  value: string
}

const BudgetItemDropdown = ({
  includeAllOption,
  organizationId,
  allowClear = false,
  budgetTypeId,
  selectedBudget,
  defaultOptions = [],
  isBudgetCenter = false,
  onSetSelectedBudget,
  maxWidth,
  // onClickButton,
  formName,
  formLabel = 'Budget Code',
  forceOptions = [],
}: BudgetItemDropdownProps) => {
  const user = useAppSelector(selectUser)
  const [triggerGetBudgets, { isFetching, isLoading }] = useLazyGetBudgetsQuery()
  const abortControllerRef = useRef<AbortController | null>(null)

  // Use organizationId from props if provided, otherwise from user
  const resolvedOrganizationId = organizationId || user?.currentOrganizationId

  const fetchBudgetOptions = useCallback(
    async (search: string): Promise<BudgetItemTypeDropdown[]> => {
      try {
        // Skip API call if no organization ID is provided
        if (!resolvedOrganizationId) {
          console.warn('No organization ID provided, skipping budget fetch')
          return []
        }

        // Cancel any previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create a new AbortController for this request
        const abortController = new AbortController()
        abortControllerRef.current = abortController

        const request = triggerGetBudgets({
          organizationId: resolvedOrganizationId,
          budgetCode: search,
          budgetTypeId,
          isBudgetCenter,
          page: 0,
          sizePerPage: 20,
        })

        // Manually handle abortion if the controller is aborted
        abortController.signal.addEventListener('abort', () => {
          request.abort()
        })

        const result = await request.unwrap()

        // Transform the API response to the format expected by DebounceSelect
        return (
          includeAllOption
            ? [
                {
                  budgetId: 'ALL',
                  budgetCode: '',
                  budgetSiteId: '',
                  label: 'All / เลือกทั้งหมด',
                  value: 'ALL',
                },
              ]
            : []
        ).concat(
          result.map((budget) => ({
            ...budget,
            label:
              budget.budgetCode +
              (budget.budgetDescription ? ' : ' + budget.budgetDescription : ''),
            value: budget.budgetId,
          })),
        )
      } catch (error) {
        // Don't log errors caused by cancellation
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching budget options:', error)
        }
        return []
      }
    },
    [budgetTypeId, isBudgetCenter, triggerGetBudgets, resolvedOrganizationId, includeAllOption],
  )

  const renderDropdownContent = () => {
    // if (isError) {
    //   return (
    //     <div style={{ padding: '8px' }}>
    //       <Text type="secondary">
    //         An error occurred while searching for data. Please try again...
    //       </Text>
    //     </div>
    //   )
    // }
    if (isFetching) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
    // return (
    //   <div style={{ padding: '8px' }}>
    //     <Text type="secondary"> Not Found/ไม่พบที่ค้นหา </Text>
    //   </div>
    // )
  }

  useEffect(() => {
    if (!selectedBudget?.budgetCode) {
      // NOTE: ถ้าไม่ได้เลือกมา ค่อย fetch เพราะถ้ามี selectedBudget แล้วแปลว่าเคยมีการ fetch ไปแล้ว
      fetchBudgetOptions(selectedBudget?.budgetCode || '')
    }
  }, [isBudgetCenter, fetchBudgetOptions, selectedBudget])

  const budgetSelect = (
    <DebounceSelect
      showSearch
      loading={isFetching}
      allowClear={allowClear}
      placeholder="< กรุณาเลือก >"
      defaultOptions={defaultOptions}
      forceOptions={forceOptions}
      fetchOptions={fetchBudgetOptions}
      value={selectedBudget?.budgetId}
      onChange={(_, option) => {
        if (onSetSelectedBudget) {
          onSetSelectedBudget(option as BudgetItemType)
        }
      }}
      notFoundContent={renderDropdownContent()}
    />
  )

  return (
    <>
      <div style={{ width: '100%', display: isLoading ? 'block' : 'none' }}>
        <Select loading disabled placeholder="Loading..." />
      </div>
      <div style={{ display: isLoading ? 'none' : 'flex' }}>
        <div
          style={{
            width: '100%',
            flex: 1,
            marginRight: '4px',
            maxWidth: maxWidth ? maxWidth : 'undefined',
          }}
        >
          {formName ? (
            <Form.Item label={formLabel} name={formName}>
              {budgetSelect}
            </Form.Item>
          ) : (
            budgetSelect
          )}
        </div>
        {/* <Button type="primary" icon={<SelectOutlined />} onClick={onClickButton} /> */}
      </div>
    </>
  )
}

export default BudgetItemDropdown
