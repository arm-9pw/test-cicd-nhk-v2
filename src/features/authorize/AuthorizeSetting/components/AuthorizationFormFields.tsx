import React from 'react'

import { Checkbox, Col, DatePicker, Form, FormInstance, Input, Row } from 'antd'
import dayjs from 'dayjs'

import { DelegationPersonType } from 'api/delegationApi.types'

import { gutter } from 'constants/index'

import DelegatePeopleDropdown from './DelegatePeopleDropdown'

interface AuthorizationFormFieldsProps {
  formRef: FormInstance
  isDisabledDelegatePerson?: boolean
}

const AuthorizationFormFields: React.FC<AuthorizationFormFieldsProps> = ({
  formRef,
  isDisabledDelegatePerson,
}) => {
  return (
    <Row gutter={gutter} align="bottom">
      {isDisabledDelegatePerson ? (
        <Col span={24}>
          <Form.Item label="Name" name="delegateName">
            <Input disabled />
          </Form.Item>
        </Col>
      ) : (
        <Col span={24}>
          <Form.Item
            label="Name"
            name="delegateId"
            style={{ width: '100%' }}
            rules={[{ required: true }]}
          >
            <DelegatePeopleDropdown
              onChange={(_, option) => {
                const optionValue = option as DelegationPersonType
                formRef.setFieldsValue({
                  delegateName: optionValue?.employeeName,
                  delegatePosition: optionValue?.posName,
                  delegatePositionName: optionValue?.posName,
                  delegatePositionCode: optionValue?.posCode,
                  delegatePositionId: optionValue?.positionId,
                  delegateSectionName: optionValue?.sectionName,
                  delegateSectionId: optionValue?.sectionId,
                  delegateEmail: optionValue?.email,
                  delegateSite: optionValue?.siteCode,
                })
              }}
            />
          </Form.Item>
          <Form.Item name="delegateName" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="delegatePositionName" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="delegatePositionCode" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="delegatePositionId" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="delegateSectionId" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="delegateSite" hidden>
            <Input disabled />
          </Form.Item>
        </Col>
      )}
      <Col span={24}>
        <Form.Item label="Position" name="delegatePosition">
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Section" name="delegateSectionName">
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Email" name="delegateEmail">
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Authorize Period" name={['authorizePeriod']} rules={[{ required: true }]}>
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            minDate={dayjs()}
            placeholder={['Authorize start date', 'Authorize end date']}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Reason"
          name="reasonDetails"
          rules={[{ max: 1000, message: 'Maximum 1000 characters allowed.' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Active</Checkbox>
        </Form.Item>
      </Col>
    </Row>
  )
}

export default AuthorizationFormFields
