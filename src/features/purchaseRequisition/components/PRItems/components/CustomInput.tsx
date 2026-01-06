import { Form, FormInstance, Input } from 'antd'

type Props = {
  formRef: FormInstance
  isDisabledAllForm: boolean
  name: string
  required: boolean
}

const CustomInput = ({ formRef, isDisabledAllForm, name, required }: Props) => {
  const matCode = Form.useWatch('matCode', formRef)
  const isItemSelected = !!matCode && !matCode.includes('DUMMY')
  const isDisabled = isDisabledAllForm || isItemSelected

  return (
    <Form form={formRef} disabled={isDisabled}>
      <Form.Item
        name={name}
        rules={[{ required, message: `Please input ${name}` }]}
        style={{ margin: 0 }}
      >
        <Input />
      </Form.Item>
    </Form>
  )
}

export default CustomInput
