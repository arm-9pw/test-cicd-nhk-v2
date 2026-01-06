import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetScopePurchasesQuery } from 'api/masterApi'

import GenericDropdown from './GenericDropdown'

type PurchaseSectionDropdownProps = SelectProps & {
  mainGroupId?: string
}

const PurchaseSectionDropdown: React.FC<PurchaseSectionDropdownProps> = ({
  mainGroupId,
  ...selectProps
}) => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useGetScopePurchasesQuery({ mainGroupId: mainGroupId || '' })

  const _options = useMemo(() => {
    return data.map((purchaseSection) => ({
      value: purchaseSection.purchaseSectionId,
      label: purchaseSection.purchaseSectionName,
    }))
  }, [data])

  return (
    <GenericDropdown
      isError={isError}
      loading={isLoading}
      error={error}
      options={_options}
      placeholder="< กรุณาเลือก >"
      // disabled={!mainGroupId}
      {...selectProps}
    />
  )
}

export default PurchaseSectionDropdown
