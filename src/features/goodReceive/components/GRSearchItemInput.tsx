import { useMemo } from 'react'

import { AutoComplete, Skeleton, Typography } from 'antd'

import { TPOGRItemQueryParams, TPOGRItems } from 'api/grApi.types'

import debounce from 'lodash/debounce'

const { Text } = Typography

type GRSearchItemInputProps = {
  GRSearchItemInputValue: string
  setGRSearchItemInputValue: (value: string) => void
  onClickButton: () => void
  isLoadingPOGRs: boolean
  isFetchingPOGRs: boolean
  isErrorPOGRs: boolean
  triggerGetPOGRs: (value: TPOGRItemQueryParams) => void
  POGRs: TPOGRItems | undefined
  disabled?: boolean
}

const GRSearchItemInput = ({
  GRSearchItemInputValue,
  setGRSearchItemInputValue,
  // onClickButton,
  isLoadingPOGRs: isLoading,
  isFetchingPOGRs: isFetching,
  isErrorPOGRs: isError,
  triggerGetPOGRs,
  POGRs,
  disabled,
}: GRSearchItemInputProps) => {
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        triggerGetPOGRs({ poNo: value, page: '0', sizePerPage: '5' })
      }, 300), // 300ms delay
    [triggerGetPOGRs],
  )

  const options = useMemo(
    () =>
      POGRs?.map((POGR) => ({
        value: POGR?.id,
        label: POGR?.poNo,
      })) || [],
    [POGRs],
  )

  // FIXME: Implement infinite scroll search
  return (
    <div style={{ display: 'flex' }}>
      <AutoComplete
        popupMatchSelectWidth
        placeholder="Po No./เลขที่"
        options={options}
        onSearch={debouncedSearch}
        value={GRSearchItemInputValue}
        onChange={(v) => {
          // NOTE: Set value when user type
          setGRSearchItemInputValue(v)
        }}
        onSelect={(_, option) => {
          // NOTE: Set value when user select value from dropdown
          setGRSearchItemInputValue(option?.label || '')
        }}
        onFocus={() => {
          //triggerGetPOGRs({})
        }} // FIXME: change when API is finished
        notFoundContent={<div> Not Found/ไม่พบที่ค้นหา </div>}
        style={{ width: '100%', marginRight: 8 }}
        dropdownRender={(menu) => {
          // if (!budgetTypeId) {
          //   return (
          //     <div style={{ padding: '8px' }}>
          //       <Text type="secondary">
          //         Please select a "Budget Type/ชนิดงบประมาณ"
          //       </Text>
          //     </div>
          //   )
          // }
          if (isError) {
            return (
              <div style={{ padding: '8px' }}>
                <Text type="secondary">An error occurred while searching for data.</Text>
              </div>
            )
          }
          if (isFetching || isLoading) {
            return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
          }
          return menu
        }}
        filterOption={(inputValue, option) =>
          option?.label?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        disabled={disabled}
      />
      {/* <Button type="primary" icon={<SelectOutlined />} onClick={onClickButton}
        disabled={disabled}
      /> */}
    </div>
  )
}

export default GRSearchItemInput
