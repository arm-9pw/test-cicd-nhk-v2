import { Form, FormInstance, Input } from 'antd'

type Props = {
  formRef: FormInstance
  required: boolean
  name: string
}

const CustomInput = ({ formRef, required, name }: Props) => {
  const matCode = Form.useWatch('matCode', formRef)
  const isItemSelected = !!matCode && !matCode.includes('DUMMY')

  return (
    <Form form={formRef} disabled={!!isItemSelected}>
      <Form.Item name={name} rules={[{ required }]}>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default CustomInput
