import React from 'react'

import { ContainerOutlined } from '@ant-design/icons'
import { Col, Collapse, Form, FormInstance, Input, Row } from 'antd'

import { TPOGRItemQueryParams, TPOGRItems, TPOGRRemainingItem } from 'api/grApi.types'

import { PAGE_MODE } from 'constants/index'

import GRSearchItemInput from './GRSearchItemInput'

const { TextArea } = Input

const SPAN = { xs: 24, sm: 24, md: 12, lg: 12, xl: 6 }

type GRDetailProps = {
  GRSearchItemInputValue: string
  setGRSearchItemInputValue: (value: string) => void
  isLoadingPOGRs: boolean
  isFetchingPOGRs: boolean
  isErrorPOGRs: boolean
  triggerGetPOGRs: (value: TPOGRItemQueryParams) => void
  POGRs: TPOGRItems | undefined
  // POGR: TPOGRItem | undefined
  GRForm: FormInstance
  POGRRemainingItems: TPOGRRemainingItem | undefined
  onClickGRSearchItem: (value: string) => void
  // onChangeGRSearchItemInputValue: (value: string) => void // TODO remove broken code
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  isDisabledAllForm: boolean
}

const GRDetail: React.FC<GRDetailProps> = ({
  GRSearchItemInputValue,
  setGRSearchItemInputValue,
  isLoadingPOGRs,
  isFetchingPOGRs,
  isErrorPOGRs,
  triggerGetPOGRs,
  POGRs,
  // POGR,
  GRForm,
  // POGRRemainingItems,
  onClickGRSearchItem,
  // onChangeGRSearchItemInputValue,
  mode,
  isDisabledAllForm,
}) => {
  // set form items using values from POGR
  // useEffect(() => {
  //   if (POGRRemainingItems) {
  //     GRForm.setFieldsValue({
  //       poDate: POGRRemainingItems.poDate,
  //       grNo: POGRRemainingItems.grNo,
  //       grDate: POGRRemainingItems.grDate,
  //       prNo: POGRRemainingItems.prNo,
  //       prDate: POGRRemainingItems.prDate,
  //       supplierName: POGRRemainingItems.supplierName,
  //       paymentTermName: POGRRemainingItems.paymentTermName,
  //       receiveCondition: POGRRemainingItems.receiveCondition,
  //       comment: POGRRemainingItems.comment,
  //     })
  //   } else {
  //     GRForm.setFieldsValue({
  //       poDate: '',
  //       grNo: '',
  //       grDate: '',
  //       prNo: '',
  //       prDate: '',
  //       supplierName: '',
  //       paymentTermName: '',
  //       receiveCondition: '',
  //       comment: '',
  //     })
  //   }
  // }, [POGRRemainingItems, GRForm])

  const items = [
    {
      key: '1',
      label: (
        <span>
          <ContainerOutlined />
          {isLoadingPOGRs ? 'Loading... ' : null} Goods Receive Detail/ใบรับสินค้า
        </span>
      ),
      children: (
        <Form layout="vertical" form={GRForm}>
          <Row gutter={[16, 0]}>
            <Col {...SPAN}>
              {mode === PAGE_MODE.CREATE ? (
                <Form.Item label="PO. No./เลขที่ใบสั่งซื้อ">
                  <GRSearchItemInput
                    GRSearchItemInputValue={GRSearchItemInputValue}
                    setGRSearchItemInputValue={(value: string) => {
                      setGRSearchItemInputValue(value)
                    }}
                    // onSetValidBudgetCode={() => {}}
                    onClickButton={() => {
                      onClickGRSearchItem(GRSearchItemInputValue)
                    }}
                    isLoadingPOGRs={isLoadingPOGRs}
                    isFetchingPOGRs={isFetchingPOGRs}
                    isErrorPOGRs={isErrorPOGRs}
                    triggerGetPOGRs={triggerGetPOGRs}
                    POGRs={POGRs}
                    disabled={false}
                  />
                </Form.Item>
              ) : (
                <Form.Item label="PO. No./เลขที่ใบสั่งซื้อ" name="poNo">
                  <Input disabled />
                </Form.Item>
              )}
            </Col>
            <Col {...SPAN}>
              <Form.Item label="PO. Date/วันที่สั่งซื้อ" name="poDate">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="GR. No./เลขที่ใบรับสินค้า" name="grNo">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="GR. Date/วันที่รับสินค้า" name="grDate">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col {...SPAN}>
              <Form.Item label="Refer PR. No./เลขที่ใบขอสั่งซื้อ" name="prNo">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="PR. Date/วันที่ขอสั่งซื้อ" name="prDate">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Supplier Name/ชื่อบริษัทผู้ขาย" name="supplierName">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col lg={24} xl={12} xxl={12}>
              <Form.Item label="Payment Term/เงื่อนไขการชำระเงิน" name="paymentTermName">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col lg={24} xl={12} xxl={12}>
              <Form.Item label="Receive Condition/เงื่อนไขการรับสินค้า" name="receiveCondition">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Comment/ข้อคิดเห็น" name="comment">
                <TextArea rows={4} disabled={isDisabledAllForm} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
  ]

  return <Collapse items={items} defaultActiveKey={['1']} expandIconPosition="end" />
}

export default GRDetail
