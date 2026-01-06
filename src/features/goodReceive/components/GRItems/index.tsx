import React from 'react'

import { DeleteOutlined, UndoOutlined, UnorderedListOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Collapse,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
} from 'antd'
import { valueType } from 'antd/es/statistic/utils'
import { ColumnsType } from 'antd/es/table'

import { GRinvoiceItem } from 'api/grApi.types'

import CustomDatePicker from 'components/CustomDatePicker'

import { formatToLocalDateTime } from 'utils/dateHelpers'
import { formatNumber, unitPriceNumberFormatter } from 'utils/generalHelpers'

const SPAN = { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }

// type DataType = {
//   key: string
//   no: number | null
//   name: string
//   brand: string
//   model: string
//   detail: string
//   receiveQty: number | null
//   receivePrice: number | null
//   receiveTotal: number | null
//   invoiceReceiveName: string
//   invoiceReceiveNo: string
//   invoiceDate: string
//   remark: string
//   isNewRow?: boolean
// }

type GRItemsProps = {
  isDisabledAllForm: boolean
  GRinvoiceItems: GRinvoiceItem[] | undefined
  onClickSetAllGRInvoiceItems: () => void
  GRIForm: FormInstance
  isLoadingPOGRRemainingItems?: boolean
  onChangeGRInvoiceItems: ({
    key,
    value,
    record,
    index,
  }: {
    key: string
    value: valueType | null
    record: GRinvoiceItem
    index: number
  }) => void
  selectedGRinvoiceItemKeys: React.Key[]
  setSelectedGRinvoiceItemKeys: (keys: React.Key[]) => void
  onDeleteGRinvoiceItems: () => void
  onRestoreGRinvoiceItems: () => void
  isUpdatingGR?: boolean
  onBlurGRInvoiceItems: ({ key, record }: { key: string; record: GRinvoiceItem }) => void
}

const GRItems: React.FC<GRItemsProps> = ({
  isDisabledAllForm,
  GRinvoiceItems,
  onClickSetAllGRInvoiceItems,
  GRIForm,
  isLoadingPOGRRemainingItems,
  onChangeGRInvoiceItems,
  selectedGRinvoiceItemKeys,
  setSelectedGRinvoiceItemKeys,
  onDeleteGRinvoiceItems,
  onRestoreGRinvoiceItems,
  isUpdatingGR,
  onBlurGRInvoiceItems,
}) => {
  const columns: ColumnsType<GRinvoiceItem> = [
    {
      title: 'No.',
      dataIndex: 'GRIno',
      key: 'GRIno',
      width: 80,
      align: 'center',
      render: (_, record, index) => (
        <Form.Item name={`no-${record.GRIkey}`}>
          <span>{index + 1}</span>
        </Form.Item>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'GRIkey',
      key: 'GRIkey',
      align: 'center',
      minWidth: 200,
      fixed: 'left',
      render: (_, record) => (
        <Form.Item
          name={`GRIname-${record.GRIkey}`}
          rules={[
            {
              required: false,
              message: 'Please input name',
            },
          ]}
        >
          {/* <Input
            // value={text}
            onChange={(e) => {
              onChangeGRInvoiceItems({ key: 'GRIname', value: e?.target?.value, record, index })
            }}
            disabled
          /> */}
          {record.GRIname}
        </Form.Item>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      align: 'center',
      minWidth: 140,
      render: (_, record) => (
        <Form.Item
          name={`GRIbrand-${record.GRIkey}`}
          rules={[
            {
              required: false,
              message: 'Please input brand',
            },
          ]}
        >
          {/* <Input
            // value={text}
            onChange={(e) => {
              onChangeGRInvoiceItems({ key: 'GRIbrand', value: e?.target?.value, record, index })
            }}
            disabled
          /> */}
          {record.GRIbrand}
        </Form.Item>
      ),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      align: 'center',
      minWidth: 140,
      render: (_, record) => (
        <Form.Item
          name={`GRImodel-${record.GRIkey}`}
          rules={[
            {
              required: false,
              message: 'Please input model',
            },
          ]}
        >
          {/* <Input
            // value={text}
            onChange={(e) => {
              onChangeGRInvoiceItems({ key: 'GRImodel', value: e?.target?.value, record, index })
            }}
            disabled
          /> */}
          {record.GRImodel}
        </Form.Item>
      ),
    },

    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      align: 'center',
      minWidth: 300,
      render: (_, record, index) => (
        <Form.Item
          name={`GRIdetail-${record.GRIkey}`}
          rules={[
            {
              required: false,
              message: 'Please input detail',
            },
          ]}
        >
          <Input
            // value={text}
            disabled={isDisabledAllForm}
            onChange={(e) => {
              onChangeGRInvoiceItems({ key: 'GRIdetail', value: e?.target?.value, record, index })
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Receive QTY',
      dataIndex: 'GRIqty',
      key: 'GRIqty',
      minWidth: 120,
      align: 'center',
      render: (_: number | null, record: GRinvoiceItem, index: number) => (
        <Form.Item
          name={`GRIqty-${record.GRIkey}`}
          rules={[
            {
              validator: async (_, v) => {
                if (v === null) {
                  return Promise.reject('Please input receive qty')
                }

                const value = parseFloat(v || '0')
                const maxReceiveQty = record.GRImaxReceiveQty || 0

                // drop all decimal points before Convert values to BigInt for comparison
                // const maxReceiveQtyBigInt = BigInt(
                //   formatNumber0FractionDigits(record.GRImaxReceiveQty || 0),
                // )
                // const valueBigInt = BigInt(formatNumber0FractionDigits(parseFloat(v || '0')))

                // value must be less than or equal to record.receiveQty
                // if (valueBigInt > maxReceiveQtyBigInt) {
                if (value > maxReceiveQty) {
                  return Promise.reject(
                    `Receive Qty (${formatNumber(value)}) must be less than or equal to maximum receive Qty (${formatNumber(maxReceiveQty)})`,
                  )
                } else if (value <= 0) {
                  return Promise.reject('Receive Qty must be greater than 0')
                } else {
                  return Promise.resolve()
                }
              },
            },
          ]}
        >
          <Input
            disabled={isDisabledAllForm}
            style={{ width: '100%' }}
            onChange={(e) => {
              // don't update state if value matches the regex
              // prevent premature formattings when user is typing . or .0*
              const valueString = e?.target?.value

              if (typeof valueString !== 'string') {
                return
              }

              const pattern = /\.[0]*$/gm
              if (pattern.test(valueString)) {
                return
              }

              const valueNumber = Number(valueString)
              if (isNaN(valueNumber)) {
                return
              }

              if (valueNumber !== null && typeof valueNumber === 'number') {
                onChangeGRInvoiceItems({
                  key: 'GRIqty',
                  value: valueNumber,
                  record,
                  index,
                })
              } else {
                onChangeGRInvoiceItems({
                  key: 'GRIqty',
                  value: null,
                  record,
                  index,
                })
              }
            }}
            // formatter={(value) => `${value}`.replace(/\d(?=(\d{3})+(?!\d)\.)/g, '$&,')}
            // formatter={(v) => insertCommaToNumber(v)}
            onBlur={() => {
              onBlurGRInvoiceItems({
                key: 'GRIqty',
                record,
              })
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Receive Price',
      dataIndex: 'GRIunitPrice',
      key: 'GRIunitPrice',
      minWidth: 120,
      align: 'center',
      render: (text: number | null) =>
        text ? <div style={{ textAlign: 'right' }}>{unitPriceNumberFormatter(text)}</div> : null,
    },
    {
      title: (
        <>
          <span style={{ color: 'red' }}>*</span>Receive Total
        </>
      ),
      dataIndex: 'GRInetTotal',
      key: 'GRInetTotal',
      minWidth: 120,
      align: 'center',
      render: (_: number | null, record, index) => (
        <Form.Item
          name={`GRInetTotal-${record.GRIkey}`}
          rules={[
            {
              required: true,
              message: 'Please input receive total',
            },
          ]}
        >
          <Input
            disabled={isDisabledAllForm}
            style={{ width: '100%' }}
            onChange={(e) => {
              let value = e?.target?.value

              // don't update state if value matches the regex
              // prevent premature formattings when user is typing . or .0*
              const pattern = /\.[0]*$/gm
              if (pattern.test(value)) {
                return
              }

              // remove commas from the value
              value = value?.replace(/,/g, '')

              const valueNumber = parseFloat(value)

              // dont update state if value is not a number
              if (isNaN(valueNumber)) {
                return
              }

              if (valueNumber !== null && typeof valueNumber === 'number') {
                onChangeGRInvoiceItems({
                  key: 'GRInetTotal',
                  value: valueNumber,
                  record,
                  index,
                })
              } else {
                onChangeGRInvoiceItems({
                  key: 'GRInetTotal',
                  value: null,
                  record,
                  index,
                })
              }
            }}
            // formatter={(value) => insertCommaToNumber(value)}
            onBlur={() => {
              onBlurGRInvoiceItems({
                key: 'GRInetTotal',
                record,
              })
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <>
          <span style={{ color: 'red' }}>*</span>Inv. Receive Name
        </>
      ),
      dataIndex: 'GRIinvoiceReceiveName',
      key: 'GRIinvoiceReceiveName',
      minWidth: 180,
      align: 'center',
      render: (_, record, index) => (
        <Form.Item
          name={`GRIinvoiceReceiveName-${record.GRIkey}`}
          rules={[
            {
              required: true,
              message: 'Please input invoice receive name.',
            },
          ]}
        >
          <Input
            // value={text}
            disabled={isDisabledAllForm}
            onChange={(e) => {
              onChangeGRInvoiceItems({
                key: 'GRIinvoiceReceiveName',
                value: e?.target?.value,
                record,
                index,
              })
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <>
          <span style={{ color: 'red' }}>*</span>Inv. No.
        </>
      ),
      dataIndex: 'GRIinvoiceNo',
      key: 'GRIinvoiceNo',
      minWidth: 180,
      align: 'center',
      render: (_, record, index) => (
        <Form.Item
          name={`GRIinvoiceNo-${record.GRIkey}`}
          rules={[
            {
              required: true,
              message: 'Please input invoice No.',
            },
          ]}
        >
          <Input
            // value={text}
            disabled={isDisabledAllForm}
            onChange={(e) => {
              onChangeGRInvoiceItems({
                key: 'GRIinvoiceNo',
                value: e?.target?.value,
                record,
                index,
              })
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <>
          <span style={{ color: 'red' }}>*</span>Inv. Date
        </>
      ),
      dataIndex: 'GRIinvoiceDate',
      key: 'GRIinvoiceDate',
      minWidth: 180,
      align: 'center',
      render: (_, record, index) => (
        <Form.Item
          name={`GRIinvoiceDate-${record.GRIkey}`}
          rules={[
            {
              required: true,
              message: 'Please input invoice date.',
            },
          ]}
        >
          <CustomDatePicker
            disabled={isDisabledAllForm}
            style={{ width: '100%' }}
            // value={text ? getDateFromString(text, 'DD/MM/YYYY') : undefined}
            // format="DD/MM/YYYY"
            onChange={(date) => {
              onChangeGRInvoiceItems({
                key: 'GRIinvoiceDate',
                value: date ? formatToLocalDateTime(date.toString()) : '',
                record,
                index,
              })
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Paid Date',
      dataIndex: 'GRIpaidDate',
      key: 'GRIpaidDate',
      minWidth: 180,
      align: 'center',
      render: (_, record, index) => (
        <Form.Item
          name={`GRIpaidDate-${record.GRIkey}`}
          // rules={[
          //   {
          //     required: true,
          //     message: 'Please input paid date.',
          //   },
          // ]}
        >
          <CustomDatePicker
            disabled={isDisabledAllForm}
            style={{ width: '100%' }}
            // value={text ? getDateFromString(text, 'DD/MM/YYYY') : undefined}
            // format="DD/MM/YYYY"
            onChange={(date) => {
              onChangeGRInvoiceItems({
                key: 'GRIpaidDate',
                value: date ? formatToLocalDateTime(date.toString()) : '',
                record,
                index,
              })
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Remark',
      dataIndex: 'GRIremark',
      key: 'GRIremark',
      align: 'center',
      minWidth: 200,
      render: (_, record, index) => (
        <Form.Item
          name={`GRIremark-${record.GRIkey}`}
          rules={[
            {
              required: false,
              message: 'Please input remark',
            },
          ]}
        >
          <Input
            disabled={isDisabledAllForm}
            // value={record.remark}
            onChange={(e) => {
              onChangeGRInvoiceItems({
                key: 'GRIremark',
                value: e?.target?.value,
                record,
                index,
              })
            }}
          />
        </Form.Item>
      ),
    },
  ]

  const items = [
    {
      key: '1',
      label: (
        <span>
          <UnorderedListOutlined />
          Goods Receive Items/รายการรับสินค้า
        </span>
      ),
      children: (
        <Form form={GRIForm} layout="vertical">
          <Row gutter={[16, 0]} align="bottom">
            <Col {...SPAN}>
              <Form.Item label="Inv. Receive Name/ชื่อผู้รับ Invoice" name="SETALLinvReceiveName">
                <Input disabled={isDisabledAllForm} />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Inv. No/เลขที่ Invoice" name="SETALLinvNo">
                <Input disabled={isDisabledAllForm} />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Inv. Date/วันที่ออก Invoice" name="SETALLinvDate">
                <CustomDatePicker style={{ width: '100%' }} disabled={isDisabledAllForm} />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Paid Date/วันที่ชำระ" name="SETALLpaidDate">
                <CustomDatePicker style={{ width: '100%' }} disabled={isDisabledAllForm} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginTop: 10, textAlign: 'right' }}>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={onClickSetAllGRInvoiceItems}
                  disabled={isDisabledAllForm}
                >
                  กำหนด Inv. ทั้งหมด
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Space size="small">
                <Popconfirm
                  title="Delete all selected items?"
                  onConfirm={() => {
                    onDeleteGRinvoiceItems()
                  }}
                >
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => {}}
                    danger
                    disabled={isDisabledAllForm}
                  >
                    ลบที่เลือก
                  </Button>
                </Popconfirm>
              </Space>{' '}
              <Space size="small">
                <Popconfirm
                  title="Restore all deleted items?"
                  onConfirm={() => {
                    onRestoreGRinvoiceItems()
                  }}
                >
                  <Button icon={<UndoOutlined />} onClick={() => {}} disabled={isDisabledAllForm}>
                    กู้คืนที่ลบ
                  </Button>
                </Popconfirm>
              </Space>
            </Col>

            <Col span={24}>
              <Table
                bordered
                rowKey={(record) => (record.GRIkey ? record.GRIkey.toString() : '')}
                size="small"
                tableLayout="auto"
                columns={columns}
                dataSource={GRinvoiceItems}
                loading={isLoadingPOGRRemainingItems || isUpdatingGR}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: selectedGRinvoiceItemKeys,
                  onChange: (keys) => setSelectedGRinvoiceItemKeys(keys),
                  getCheckboxProps: (record: GRinvoiceItem) => ({
                    disabled: record.GRIisNewRow,
                  }),
                }}
                pagination={false}
                scroll={{ x: true }}
              />
            </Col>
          </Row>
        </Form>
      ),
    },
  ]

  return <Collapse items={items} defaultActiveKey={['1']} expandIconPosition="end" />
}

export default GRItems
