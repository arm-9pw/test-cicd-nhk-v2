import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetCurrenciesQuery } from 'api/masterApi'

import GenericDropdown from './GenericDropdown'

type CurrencyDropdownProps = SelectProps

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetCurrenciesQuery()

  const _options = useMemo(() => {
    return data.map((currency) => ({
      value: currency.id,
      label: currency.currencyName,
    }))
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

export default CurrencyDropdown
