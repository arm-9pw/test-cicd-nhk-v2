import { useCallback } from 'react'

import { Skeleton, Typography } from 'antd'

import { useLazyListPRForPOQuery } from 'api/poApi'
import { PurchaseRequisitionRespType } from 'api/prApi.types'

import DebounceSelect from 'components/DebounceSelect'

const { Text } = Typography

export type PRListDropdownType = Partial<PurchaseRequisitionRespType> & {
  key: string
  label: string
  value: string
}

type Props = {
  value: PRListDropdownType | undefined
  onChange: (value: PRListDropdownType | undefined) => void
}

const PRListDropdownType = ({ value, onChange }: Props) => {
  const [triggerListPRForPO, { isError, isFetching }] = useLazyListPRForPOQuery()

  const fetchPRList = useCallback(
    async (search: string): Promise<PRListDropdownType[]> => {
      try {
        const result = await triggerListPRForPO({
          prNo: search,
        }).unwrap()

        // Transform the API response to the format expected by DebounceSelect
        return result.map((pr) => ({
          ...pr,
          key: pr.id!,
          label: pr.prNo,
          value: pr.id!,
        }))
      } catch (error) {
        console.error('Error fetching PR options:', error)
        return []
      }
    },
    [triggerListPRForPO],
  )

  const renderDropdownContent = () => {
    if (isError) {
      return (
        <div style={{ padding: '8px' }}>
          <Text type="secondary">
            An error occurred while searching for data. Please try again...
          </Text>
        </div>
      )
    }
    if (isFetching) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
    return (
      <div style={{ padding: '4px 8px' }}>
        <Text type="secondary">Not Found/ไม่พบที่ค้นหา</Text>
      </div>
    )
  }

  return (
    <div>
      <DebounceSelect
        showSearch
        allowClear
        placeholder="PR. No."
        fetchOptions={fetchPRList}
        value={value?.value}
        onChange={(_, option) => {
          onChange(option as PRListDropdownType)
        }}
        notFoundContent={renderDropdownContent()}
      />
    </div>
  )
}

export default PRListDropdownType
