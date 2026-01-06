import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetSiteInvoiceTaxesQuery } from 'api/masterApi'
import { GenericDropdownType } from 'api/masterApi.types'

import GenericDropdown from './GenericDropdown'

type SiteInvoiceTaxDropdownProps = SelectProps

const SiteInvoiceTaxDropdown: React.FC<SiteInvoiceTaxDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetSiteInvoiceTaxesQuery()

  const _options = useMemo(() => {
    return data.map((siteInvoiceTax: GenericDropdownType) => ({
      value: siteInvoiceTax.id,
      label: siteInvoiceTax.name,
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

export default SiteInvoiceTaxDropdown
