import { useMemo } from 'react'

import { SelectProps } from 'antd'

import { useGetSiteDeliveriesQuery } from 'api/masterApi'
import { SiteDeliveryType } from 'api/masterApi.types'

import GenericDropdown from './GenericDropdown'

type SiteDeliveryDropdownProps = SelectProps

const SiteDeliveryDropdown: React.FC<SiteDeliveryDropdownProps> = ({ ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetSiteDeliveriesQuery()

  const _options = useMemo(() => {
    return data.map((siteDelivery: SiteDeliveryType) => ({
      value: siteDelivery.id,
      label: siteDelivery.siteName,
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

export default SiteDeliveryDropdown
