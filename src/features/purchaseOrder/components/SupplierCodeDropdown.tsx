import { useCallback } from 'react'

import { Form, Skeleton } from 'antd'

import { useLazyGetSuppliersQuery } from 'api/masterApi'
import { SupplierType } from 'api/masterApi.types'

import DebounceSelect from 'components/DebounceSelect'

type SupplierCodeDropdownProps = {
  allowClear?: boolean
  formName?: string
  formLabel?: string
  selectedSupplier?: SupplierType | null
  defaultOptions?: SupplierTypeDropdown[]
  onSetselectedSupplier?: (supplier: SupplierType) => void
  onClickButton?: () => void
}

export type SupplierTypeDropdown = SupplierType & {
  label: string
  value: string
}

const SupplierCodeDropdown = ({
  selectedSupplier,
  onSetselectedSupplier,
  // onClickButton,
  defaultOptions = [],
  formName,
  allowClear = false,
  formLabel = 'Supplier Code',
}: SupplierCodeDropdownProps) => {
  const [triggerGetSuppliers, { isFetching }] = useLazyGetSuppliersQuery()

  const fetchSupplierOptions = useCallback(
    async (search: string): Promise<SupplierTypeDropdown[]> => {
      try {
        const result = await triggerGetSuppliers({
          supplierName: search,
          supplierCode: search,
        }).unwrap()

        // Transform the API response to the format expected by DebounceSelect
        return result.map((supplier) => ({
          ...supplier,
          label:
            supplier.supplierCode + (supplier.supplierName ? ' - ' + supplier.supplierName : ''),
          value: supplier.id,
        }))
      } catch (error) {
        console.error('Error fetching supplier options:', error)
        return []
      }
    },
    [triggerGetSuppliers],
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

  // Common DebounceSelect component with shared props
  const supplierSelect = (
    <DebounceSelect
      showSearch
      allowClear={allowClear}
      placeholder="< กรุณาเลือก >"
      defaultOptions={defaultOptions}
      fetchOptions={fetchSupplierOptions}
      value={selectedSupplier?.id}
      onChange={(_, option) => {
        if (onSetselectedSupplier) {
          onSetselectedSupplier(option as SupplierType)
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
            {supplierSelect}
          </Form.Item>
        ) : (
          supplierSelect
        )}
      </div>
      {/* <Button type="primary" icon={<SelectOutlined />} onClick={onClickButton} /> */}
    </div>
  )
}

export default SupplierCodeDropdown
