import { DatePicker, DatePickerProps } from 'antd'

import { DISPLAY_DATE_FORMAT } from 'utils/dateHelpers'

type CustomDatePickerProps = DatePickerProps

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ ...datePickerProps }) => {
  return (
    <DatePicker
      format={{
        format: DISPLAY_DATE_FORMAT,
        type: 'mask',
      }}
      placeholder="< กรุณาเลือก >"
      style={{ width: '100%' }}
      {...datePickerProps}
    />
  )
}

export default CustomDatePicker
