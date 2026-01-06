import { Select, SelectProps } from 'antd'

type GenericDropdownProps = SelectProps & {
  isError: boolean
  error?: unknown
}

const GenericDropdown = ({ isError, error, ...selectProps }: GenericDropdownProps) => {
  if (isError) {
    console.error('Error loading options:', error)
    return <Select disabled labelInValue placeholder="Error loading options" {...selectProps} />
  }

  return <Select labelInValue placeholder="< กรุณาเลือก >" {...selectProps} />
}

export default GenericDropdown
