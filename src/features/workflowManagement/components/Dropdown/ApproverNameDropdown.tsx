import { useCallback } from 'react'

import { Empty, Form, Skeleton } from 'antd'
import { Rule } from 'antd/es/form'

import { useLazyGetListApproverNameQuery } from 'api/workflowManagementApi'
import { EmployeeApproverType } from 'api/workflowManangement.types'

import DebounceSelect from 'components/DebounceSelect'

type Props = {
  organizationId?: string | null
  positionId?: string | null
  formLabel?: string
  formName?: string
  rules?: Rule[]
  placeholder?: string
  style?: React.CSSProperties
  onChange?: (approverData: EmployeeApproverType | null) => void
  defaultValue?: string | null
  editMode?: boolean
  value: string | null
}

const ApproverNameDropdown: React.FC<Props> = ({
  organizationId,
  positionId,
  formLabel,
  rules,
  placeholder = '< กรุณาเลือก Approver >',
  style,
  value,
  onChange,
  formName,
}) => {
  const [triggerGetApprovalHierarchy, { data = [], currentData, isFetching }] =
    useLazyGetListApproverNameQuery()

  const fetchApproverOptions = useCallback(async () => {
    try {
      if (!organizationId || !positionId) return [] // ต้องมี 2 ตัวนี้ถึงจะดึงได้

      const params: { organizationId: string; positionId?: string } = {
        organizationId: String(organizationId),
        positionId: String(positionId),
      }

      const result = await triggerGetApprovalHierarchy(params).unwrap()
      return result.map((item) => ({
        ...item,
        value: item.employeeId,
        label: `${item.employeeName} - ${item.posName} (${item.approveAmount})`,
      }))
    } catch (error) {
      console.error('Error fetching approver options:', error)
      return []
    }
  }, [triggerGetApprovalHierarchy, organizationId, positionId])

  const renderDropdownContent = () => {
    if (!organizationId) {
      return <Empty description="กรุณาสร้าง Workflow ก่อน" />
    }
    if (!positionId) {
      return <Empty description="กรุณาเลือก Position ก่อน" />
    }
    if (data.length === 0 && !currentData) {
      return <Empty description="กรุณาพิมพ์เพื่อค้นหา" />
    }
    if (isFetching) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
    return 'ไม่พบข้อมูล Approver'
  }

  const approverSelect = (
    <DebounceSelect
      showSearch
      allowClear
      disableFilterOption
      placeholder={placeholder}
      fetchOptions={fetchApproverOptions}
      notFoundContent={renderDropdownContent()}
      style={style}
      value={value ?? undefined}
      disabled={!organizationId || !positionId}
      onChange={(_value, option) => {
        if (!onChange) return

        if (_value === undefined || _value === null || !option) {
          onChange(null) // ส่งค่า null
          return
        }

        const approverData = option as EmployeeApproverType
        onChange(approverData)
      }}
    />
  )
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '100%', flex: 1 }}>
        {formName ? (
          <Form.Item label={formLabel} name={formName} rules={rules}>
            {approverSelect}
          </Form.Item>
        ) : (
          approverSelect
        )}
      </div>
    </div>
  )
}

export default ApproverNameDropdown
