import React, { useEffect, useMemo } from 'react'

import { UserOutlined } from '@ant-design/icons'
import { Col, Collapse, Form, Row, Space } from 'antd'
import type { CollapseProps, FormInstance } from 'antd'

import { useGetScopePurchasesQuery } from 'api/masterApi'

import PurchaseSectionDropdown from 'components/PurchaseSectionDropdown'

import { gutter } from 'constants/index'

import { DropdownValueType } from '../PurchaseRequisitionPage.types'

type PRPurchasingInchargeFormValues = {
  purchaseInchargeSection: DropdownValueType
}

type PRPurchasingInchargeProps = {
  mode: 'CREATE' | 'EDIT' | 'VIEW'
  isDisabledAllForm: boolean
  selectedMainGroup?: DropdownValueType
  prPurchasingInchargeFormRef: FormInstance<PRPurchasingInchargeFormValues>
}

const PRPurchasingIncharge: React.FC<PRPurchasingInchargeProps> = ({
  mode,
  isDisabledAllForm,
  selectedMainGroup,
  prPurchasingInchargeFormRef,
}) => {
  const { data = [], isError } = useGetScopePurchasesQuery(
    { mainGroupId: selectedMainGroup?.value || '' },
    { skip: !selectedMainGroup },
  )

  const defaultValue = useMemo(() => {
    const mainPoIssuer = data.find((section) => section.isMainPoIssuer === true)
    if (!mainPoIssuer) return undefined

    return {
      value: mainPoIssuer.purchaseSectionId,
      label: mainPoIssuer.purchaseSectionName,
    }
  }, [data])

  useEffect(() => {
    if (data.length > 0 && mode === 'CREATE') {
      prPurchasingInchargeFormRef.setFieldsValue({
        purchaseInchargeSection: defaultValue,
      })
    } else if (isError) {
      prPurchasingInchargeFormRef.setFieldsValue({
        purchaseInchargeSection: undefined,
      })
    }
  }, [defaultValue, data, isError, prPurchasingInchargeFormRef, mode])

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space>
          <UserOutlined />
          Purchasing In-charge/ผู้รับผิดชอบในการจัดซื้อ
        </Space>
      ),
      children: (
        <Form form={prPurchasingInchargeFormRef} layout="vertical">
          <Row gutter={gutter}>
            <Col span={24}>
              <Form.Item
                label="Purchaser Section/ส่วนการสั่งซื้อ"
                name="purchaseInchargeSection"
                rules={[
                  {
                    required: true,
                    message: 'Please select Purchaser Section/ส่วนการสั่งซื้อ',
                  },
                ]}
              >
                <PurchaseSectionDropdown
                  mainGroupId={selectedMainGroup?.value}
                  disabled={isDisabledAllForm}
                />
              </Form.Item>
            </Col>
            {/* <Col span={24}>
              <Form.Item label="Document Route" name="documentRoute">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      ),
    },
  ]

  return <Collapse defaultActiveKey={['1']} items={collapseItems} expandIconPosition="end" />
}

export default PRPurchasingIncharge
