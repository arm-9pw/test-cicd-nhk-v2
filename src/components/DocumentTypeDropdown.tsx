import { SelectProps } from 'antd'

import { useGetDocumentTypesQuery } from 'api/masterApi'

import GenericDropdown from './GenericDropdown'

type DocumentTypeDropdownProps = SelectProps & {
  domain: string
}

const DocumentTypeDropdown: React.FC<DocumentTypeDropdownProps> = ({ domain, ...selectProps }) => {
  const { data = [], isLoading, isError, error } = useGetDocumentTypesQuery({ domain })

  return (
    <GenericDropdown
      {...selectProps}
      isError={isError}
      loading={isLoading}
      error={error}
      options={data}
      labelInValue={false}
    />
  )
}

export default DocumentTypeDropdown
