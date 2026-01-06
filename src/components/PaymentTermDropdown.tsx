import { useMemo } from 'react'

import { SelectProps } from 'antd'
import { DefaultOptionType } from 'antd/es/select'

import { useGetPaymentTermsQuery } from 'api/masterApi'
import { PaymentTermType } from 'api/masterApi.types'

import GenericDropdown from './GenericDropdown'

// Extend DefaultOptionType to include isShowDescription
export interface ExtendedOptionType extends DefaultOptionType {
  isShowDescription?: boolean
}

type PaymentTermDropdownProps = SelectProps

const PaymentTermDropdown: React.FC<PaymentTermDropdownProps> = ({ ...selectProps }) => {
  const { data, isLoading, isError, error } = useGetPaymentTermsQuery()

  const _options = useMemo(() => {
    return data?.content?.map(
      (paymentTerm: PaymentTermType): ExtendedOptionType => ({
        isShowDescription: paymentTerm.isShowDescription,
        value: paymentTerm.id,
        label: paymentTerm.name,
      }),
    )
  }, [data])

  return (
    <GenericDropdown
      isError={isError}
      loading={isLoading}
      error={error}
      options={_options}
      {...selectProps}
    />
  )
}

export default PaymentTermDropdown
