import { Col, Form, FormInstance, Input, Row } from 'antd'

import { gutter } from 'constants/index'

const { TextArea } = Input

type Props = {
  prDetailsFormRef: FormInstance
  isDisabledAllForm: boolean
}

const ExtraForm = ({ prDetailsFormRef, isDisabledAllForm }: Props) => {
  return (
    <Form labelWrap form={prDetailsFormRef} layout="vertical" disabled={isDisabledAllForm}>
      <Row gutter={gutter} align="bottom">
        <Col span={24}>
          <Form.Item name="remarkItem" label="Remark/หมายเหตุ">
            <TextArea rows={2} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default ExtraForm
