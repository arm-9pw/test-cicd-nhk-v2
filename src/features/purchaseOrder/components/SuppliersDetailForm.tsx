import { IdcardOutlined } from '@ant-design/icons'
import { Col, Collapse, Form, FormInstance, Input, InputNumber, Row, Space } from 'antd'
import { useWatch } from 'antd/es/form/Form'

import { SupplierType } from 'api/masterApi.types'

import NegoTypeDropdown from 'components/NegoTypeDropdown'

import { gutter } from 'constants/index'
import { isSpecialPaymentTerm } from 'constants/paymentTerms'

import PaymentTermDropdown, { ExtendedOptionType } from './PaymentTermDropdown'
// import SearchSupplierDropdown from './SearchSupplierDropdown'
import SupplierCodeDropdown from './SupplierCodeDropdown'

const SPAN = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }
const NO_VENDOR = [
  'NO_VENDOR 120DAYS',
  'NO_VENDOR 90DAYS',
  'NO_VENDOR 60DAYS',
  'NO_VENDOR 30DAYS',
  'NO_VENDOR_CREDIT',
]

type Props = {
  isDisabledAllForm: boolean
  supplierDetailsFormRef: FormInstance
  isShowPaymentDesc: boolean
  setIsShowPaymentDesc: React.Dispatch<React.SetStateAction<boolean>>
  selectedSupplier: SupplierType | undefined
  setSelectedSupplier: React.Dispatch<React.SetStateAction<SupplierType | undefined>>
}

const SuppliersDetailForm = ({
  isDisabledAllForm,
  supplierDetailsFormRef,
  isShowPaymentDesc,
  setIsShowPaymentDesc,
  selectedSupplier,
  setSelectedSupplier,
}: Props) => {
  const onSelectSupplier = (supplier: SupplierType) => {
    setSelectedSupplier(supplier)
    setIsShowPaymentDesc(supplier.isShowDescription)

    // NOTE: Set Supplier Details to form
    supplierDetailsFormRef.setFieldsValue({
      supplierId: supplier.id,
      supplierName: supplier.supplierName,
      supplierCode: supplier.supplierCode,
      supplierAttention: supplier.supplierAttention,
      supplierAttentionPosition: supplier.supplierPosition,
      supplierAddress: supplier.supplierAddress,
      supplierTelephone: supplier.supplierTelephone,
      supplierEmail: supplier.supplierEmail,
      supplierTaxId: supplier.taxId,
      paymentTerm: { value: supplier.paymentTermId, label: supplier.paymentTermName },
      // paymentTermDescription: supplier.paymentTermDescription, // MAY'S NOTE: ไม่ต้อง Auto Fill Separate Payment/Other Payment แล้ว
      supplierCondition: supplier.supplierCondition,
      firstSupplier: supplier,
      firstSupplierName: supplier.supplierName,
      firstSupplierCode: supplier.supplierCode,
      firstSupplierId: supplier.id,
    })

    // NOTE: Reset Payment Term if Supplier does not have Payment Term so the form will not show error
    if (!supplier.paymentTermId) {
      supplierDetailsFormRef.resetFields(['paymentTerm', 'paymentTermDescription'])
    }
  }

  const defaultSupplierOptions = selectedSupplier
    ? [
        {
          id: selectedSupplier?.id || '',
          supplierName: selectedSupplier?.supplierName || '',
          supplierCode: selectedSupplier?.supplierCode || '',
          supplierAddress: selectedSupplier?.supplierAddress || '',
          supplierTelephone: selectedSupplier?.supplierTelephone || '',
          supplierEmail: selectedSupplier?.supplierEmail || '',
          supplierAttention: selectedSupplier?.supplierAttention || '',
          supplierPosition: selectedSupplier?.supplierPosition || '',
          supplierCondition: selectedSupplier?.supplierCondition || '',
          paymentTermId: selectedSupplier?.paymentTermId || '',
          paymentTermName: selectedSupplier?.paymentTermName || '',
          paymentTermDescription: selectedSupplier?.paymentTermDescription || '',
          isShowDescription: selectedSupplier?.isShowDescription || false,
          taxId: selectedSupplier?.taxId || null,
          value: selectedSupplier?.id || '',
          label: selectedSupplier?.supplierName || '',
        },
      ]
    : []

  const isNoVendor = NO_VENDOR.includes(selectedSupplier?.supplierCode || '')

  const firstSupplierCode = useWatch('firstSupplierCode', supplierDetailsFormRef)
  const isEnableEditFirstSupplierName = NO_VENDOR.includes(firstSupplierCode || '')

  const items = [
    {
      key: '1',
      label: (
        <Space>
          <IdcardOutlined />
          Suppliers Detail/รายละเอียดผู้ขาย
        </Space>
      ),
      children: (
        <Form disabled={isDisabledAllForm} form={supplierDetailsFormRef} layout="vertical">
          <Row gutter={gutter}>
            <Col {...SPAN}>
              <Form.Item
                name="supplierCode"
                label="Supplier Code/รหัสผู้ขาย"
                rules={[{ required: true }]}
              >
                <SupplierCodeDropdown
                  defaultOptions={defaultSupplierOptions}
                  selectedSupplier={selectedSupplier}
                  onSetselectedSupplier={(option) => {
                    onSelectSupplier(option)
                  }}
                  onClickButton={() => {}} // FIXME: Implement this
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="supplierName" label="Supplier Name/ชื่อบริษัทผู้ขาย">
                <Input disabled={!isNoVendor} />
              </Form.Item>
              <Form.Item name="supplierId" hidden>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="supplierAttention"
                label="Attention/ชื่อพนักงานขาย"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="supplierAttentionPosition" label="Position/ตำแหน่ง">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="supplierAddress" label="Address/ที่อยู่">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="supplierTelephone" label="Tel/โทร">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="supplierEmail" label="Fax/email">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="paymentTerm"
                label="Payment Term/เงื่อนไขการชำระเงิน"
                rules={[{ required: true }]}
              >
                <PaymentTermDropdown
                  additionalOptions={
                    selectedSupplier?.paymentTermId
                      ? [
                          {
                            isShowDescription: isSpecialPaymentTerm(
                              selectedSupplier?.paymentTermName,
                            ),
                            value: selectedSupplier?.paymentTermId,
                            label: selectedSupplier?.paymentTermName,
                          },
                        ]
                      : []
                  }
                  onChange={(_, option) =>
                    setIsShowPaymentDesc(!!(option as ExtendedOptionType).isShowDescription)
                  }
                />
              </Form.Item>
            </Col>
            {/* {isShowPaymentDesc && ( */}
            <Col {...SPAN}>
              <Form.Item
                name="paymentTermDescription"
                label="Separate Payment/Other Payment"
                rules={[{ required: isShowPaymentDesc ? true : false }]}
              >
                <Input disabled={!isShowPaymentDesc} />
              </Form.Item>
            </Col>
            {/* )} */}
            {/* ซ่อน supplierCondition เพราะ print ยังไม่ดึงไปใช้*/}
            {/* <Col {...SPAN}>
              <Form.Item name="supplierCondition" label="Condition/เงื่อนไขแบ่งชำระ">
                <Input />
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={gutter} style={{ marginTop: 8 }}>
            <Col {...SPAN}>
              <Form.Item name="negoType" label="Nego Type">
                <NegoTypeDropdown />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="costSaving" label="Saving">
                <InputNumber
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined): number => {
                    const parsed = value?.replace(/\$\s?|(,*)/g, '')
                    return parsed ? Number(parsed) : 0
                  }}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <SupplierCodeDropdown
                formName="firstSupplier"
                formLabel="First Supplier Code/รหัสผู้ขายใน PR."
                onSetselectedSupplier={(option) => {
                  supplierDetailsFormRef.setFieldsValue({
                    firstSupplierCode: option?.supplierCode,
                    firstSupplierName: option?.supplierName,
                    firstSupplierId: option?.id,
                  })
                }}
              />
              <Form.Item name="firstSupplierCode" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item name="firstSupplierId" hidden>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="firstSupplierName" label="First Supplier Name/ชื่อผู้ขายใน PR.">
                <Input disabled={!isEnableEditFirstSupplierName} />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="firstSupplierPrice" label="First Supplier Price/ราคาใน PR.">
                <InputNumber
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined): number => {
                    const parsed = value?.replace(/\$\s?|(,*)/g, '')
                    return parsed ? Number(parsed) : 0
                  }}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="definition" label="Detail">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={gutter} style={{ marginTop: 8 }}>
            <Col {...SPAN}>
              <SearchSupplierDropdown
                inputName="firstSupplierName"
                inputLabel="First Supplier Name/ชื่อผู้ขายใน PR."
                labelKey="supplierName"
                onSelectOption={(option) => {
                  supplierDetailsFormRef.setFieldsValue({
                    firstSupplierId: option?.id,
                  })
                }}
              />
              <Form.Item name="firstSupplierId" hidden>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <SearchSupplierDropdown
                inputName="firstSupplierCode"
                inputLabel="First Supplier Code/รหัสผู้ขายใน PR."
                labelKey="supplierCode"
              />
            </Col>
            <Col {...SPAN}>
              <Form.Item name="negoType" label="Nego Type">
                <NegoTypeDropdown />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="definition" label="Definition">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="firstSupplierPrice" label="First Supplier Price/ราคาใน PR.">
                <InputNumber
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined): number => {
                    const parsed = value?.replace(/\$\s?|(,*)/g, '')
                    return parsed ? Number(parsed) : 0
                  }}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="costSaving" label="Saving">
                <InputNumber
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined): number => {
                    const parsed = value?.replace(/\$\s?|(,*)/g, '')
                    return parsed ? Number(parsed) : 0
                  }}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      ),
    },
  ]

  return <Collapse items={items} defaultActiveKey={['1']} expandIconPosition="end" />
}

export default SuppliersDetailForm
