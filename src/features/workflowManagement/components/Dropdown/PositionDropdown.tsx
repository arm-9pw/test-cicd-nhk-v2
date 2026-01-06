import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetListPositionsQuery } from 'api/workflowManagementApi'
import { ApproverPositionType } from 'api/workflowManangement.types'

import GenericDropdown from 'components/GenericDropdown'

type PositionProps = SelectProps & {
  onPositionChange?: (position: ApproverPositionType | null) => void
}

const PositionDropdown: React.FC<PositionProps> = ({ onPositionChange, value, ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetListPositionsQuery()

  const _options = useMemo(() => {
    return data.map((position: ApproverPositionType) => ({
      value: position.id,
      label: position.posName,
      position: position,
    }))
  }, [data])

  return (
    <GenericDropdown
      showSearch
      value={value}
      labelInValue={false}
      isError={isError}
      loading={isLoading}
      error={error}
      options={_options}
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      {...selectProps}
      onChange={(_, option) => {
        if (onPositionChange) {
          // ส่งข้อมูล position ที่เลือกกลับไป
          const selectedPosition = (option as { position: ApproverPositionType })?.position || null
          onPositionChange(selectedPosition)
        }
      }}
    />
  )
}

export default PositionDropdown
