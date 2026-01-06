import { Form, FormInstance, InputNumber } from 'antd'

type Props = {
  formRef: FormInstance
  isDisabledAllForm: boolean
}

const UnitPriceInput = ({ formRef, isDisabledAllForm }: Props) => {
  return (
    <Form form={formRef} disabled={isDisabledAllForm}>
      <Form.Item
        name="unitPrice"
        rules={[{ required: true, message: 'Please input unitPrice' }]}
        style={{ margin: 0 }}
      >
        <InputNumber
          min={0}
          precision={4}
          style={{ width: '100%' }}
          formatter={(value: string | number | undefined): string => {
            if (!value) return ''
            const parts = value.toString().split('.')
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

            // Limit decimal part to 4 digits
            if (parts.length > 1 && parts[1].length > 4) {
              parts[1] = parts[1].substring(0, 4)
            }

            return parts.join('.')
          }}
          parser={(value: string | undefined): string => {
            if (!value) return ''
            return value.replace(/,/g, '')
          }}
        />
      </Form.Item>
    </Form>
  )
}

export default UnitPriceInput
