import { useMemo, useState } from 'react'

import { AutoComplete, Form, Skeleton, Typography } from 'antd'

import { useLazyGetSuppliersQuery } from 'api/masterApi'

import { debounce } from 'lodash'

const { Text } = Typography

type SupplierOption = {
  id: string | number
  supplierCode: string
  supplierName: string
  key: string | number
  label: string
  value: string
}

type Props = {
  inputName: string
  inputLabel: string
  labelKey: 'supplierCode' | 'supplierName'
  defaultValue?: string
  onSelectOption?: (option: SupplierOption) => void
}

const SearchSupplierDropdown = ({
  inputName,
  inputLabel,
  labelKey,
  defaultValue,
  onSelectOption,
}: Props) => {
  const [triggerGetSuppliers, { data: suppliers, isLoading, isFetching, isError }] =
    useLazyGetSuppliersQuery()
  const [inputValue, setInputValue] = useState(defaultValue || '')

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        triggerGetSuppliers({
          [labelKey]: value,
        })
        setInputValue(value)
      }, 300),
    [triggerGetSuppliers, labelKey],
  )

  const options = useMemo(
    () =>
      suppliers?.map((supplier) => ({
        ...supplier,
        key: supplier.id,
        label: supplier[labelKey],
        value: supplier[labelKey],
      })) || [],
    [suppliers, labelKey],
  )

  return (
    <Form.Item name={inputName} label={inputLabel}>
      <AutoComplete
        popupMatchSelectWidth
        placeholder=""
        options={options}
        onSearch={debouncedSearch}
        onSelect={(value, option) => {
          setInputValue(value)
          if (onSelectOption) onSelectOption(option)
        }}
        onFocus={() => triggerGetSuppliers({ [labelKey]: inputValue })}
        notFoundContent={<div> Not Found/ไม่พบที่ค้นหา </div>}
        style={{ width: '100%' }}
        dropdownRender={(menu) => {
          if (isError) {
            return (
              <div style={{ padding: '8px' }}>
                <Text type="secondary">
                  An error occurred while searching for data. Please try again...
                </Text>
              </div>
            )
          }
          if (isFetching || isLoading) {
            return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
          }
          return menu
        }}
        filterOption={(inputValue, option) =>
          String(option?.label).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </Form.Item>
  )
}

export default SearchSupplierDropdown
