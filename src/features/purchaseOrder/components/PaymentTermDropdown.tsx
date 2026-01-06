import { useMemo } from 'react'

import { SelectProps } from 'antd'
import { DefaultOptionType } from 'antd/es/select'

import { useGetPaymentTermsQuery } from 'api/masterApi'
import { PaymentTermType } from 'api/masterApi.types'

import GenericDropdown from 'components/GenericDropdown'
import { isSpecialPaymentTerm } from 'constants/paymentTerms'

// Extend DefaultOptionType to include isShowDescription
export interface ExtendedOptionType extends DefaultOptionType {
  isShowDescription?: boolean
}

type PaymentTermDropdownProps = SelectProps & {
  additionalOptions?: ExtendedOptionType[]
}

const PaymentTermDropdown: React.FC<PaymentTermDropdownProps> = ({
  additionalOptions,
  ...selectProps
}) => {
  const { data, isLoading, isError, error } = useGetPaymentTermsQuery()

  const _options = useMemo(() => {
    return data?.content
      ?.filter((paymentTerm: PaymentTermType) => isSpecialPaymentTerm(paymentTerm.name))
      .map(
        (paymentTerm: PaymentTermType): ExtendedOptionType => ({
          isShowDescription: paymentTerm.isShowDescription,
          value: paymentTerm.id,
          label: paymentTerm.name,
        }),
      )
      .concat(additionalOptions || [])
  }, [data, additionalOptions])

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
