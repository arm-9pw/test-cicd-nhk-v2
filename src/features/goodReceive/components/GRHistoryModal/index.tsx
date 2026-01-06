import React from 'react'

import { Col, Modal, Row, Spin, Table } from 'antd'

import css from './GRHistoryModal.module.css'

import { GRHistoryDataType } from 'api/grApi.types'

import HeaderTitle from 'components/HeaderTitle'

import { formatDisplayDate } from 'utils/dateHelpers'
import { formatNumber } from 'utils/generalHelpers'

type GRHistoryModalProps = {
  onOKGRHistory: () => void
  onCancelGRHistory: () => void
  isGRHistoryModalOpen: boolean
  GRHistoryData: Partial<GRHistoryDataType>
  isLoadingGRHistory: boolean
}

const GRHistoryModal: React.FC<GRHistoryModalProps> = ({
  onOKGRHistory,
  onCancelGRHistory,
  isGRHistoryModalOpen,
  GRHistoryData,
  isLoadingGRHistory,
}) => {
  // example item:
  // {
  //   "id": 7890829038,
  //   "name": "Item A",
  //   "model": "Model A",
  //   "brand": "Brand A",
  //   "detail": "Detail A",
  //   "receiveQty": 1,
  //   "receivePrice": 100.00,
  //   "receiveTotal": 100.00,
  //   "invoiceReceiveName": "Inv Name 01",
  //   "invoiceReceiveNo": "Inv No 01",
  //   "invoiceDate": "2024-12-02T07:58:47.874048601",
  //   "remark": "SN-001"
  //  },

  const columns = [
    {
      title: 'No',
      // dataIndex: 'id',
      key: 'GRhistNo',
      render: (_: string, __: unknown, index: number) => {
        return `${index + 1}`
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
    },
    {
      title: 'Recieve QTY',
      dataIndex: 'receiveQty',
      key: 'receiveQty',
    },
    {
      title: 'Receive Price',
      dataIndex: 'receivePrice',
      key: 'receivePrice',
      render: (text: number | null) =>
        text ? <div style={{ textAlign: 'right' }}>{formatNumber(text)}</div> : null,
    },
    {
      title: 'Receive Total',
      dataIndex: 'receiveTotal',
      key: 'receiveTotal',
      render: (text: number | null) =>
        text ? <div style={{ textAlign: 'right' }}>{formatNumber(text)}</div> : null,
    },
    {
      title: 'Inv. Receive Name',
      dataIndex: 'invoiceReceiveName',
      key: 'invoiceReceiveName',
    },
    {
      title: 'Inv. No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
    {
      title: 'Inv. Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (text: string) => {
        return formatDisplayDate(text)
      },
    },
    {
      title: 'Paid Date',
      dataIndex: 'paidDate',
      key: 'paidDate',
      render: (text: string) => {
        return formatDisplayDate(text)
      },
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
    },
  ]

  return (
    <Modal
      title={<HeaderTitle title="GR. History/ประวัติการรับ" />}
      open={isGRHistoryModalOpen}
      onOk={onOKGRHistory}
      onCancel={onCancelGRHistory}
      okText="OK"
      cancelText="Cancel"
      className={css['gr-hist-modal']}
      style={{ minWidth: '80%', minHeight: '80%' }}
      footer={[]}
    >
      {isLoadingGRHistory === true && (
        <>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Spin>กำลังดึงข้อมูล</Spin>
            </Col>
          </Row>
        </>
      )}

      {isLoadingGRHistory === false &&
      Array.isArray(GRHistoryData?.goodReceiveHistories) &&
      GRHistoryData.goodReceiveHistories.length <= 0 ? (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p>ไม่มีประวัติการรับ</p>
          </Col>
        </Row>
      ) : null}

      {isLoadingGRHistory === false &&
        Array.isArray(GRHistoryData?.goodReceiveHistories) &&
        GRHistoryData?.goodReceiveHistories.map((goodReceiveHistory, index) => (
          <>
            <Row key={index} gutter={[16, 16]}>
              <Col span={24}>
                <Table
                  title={() => `รับครั้งที่ ${index + 1}`}
                  bordered
                  size="small"
                  tableLayout="auto"
                  columns={columns}
                  dataSource={
                    Array.isArray(goodReceiveHistory?.goodReceiveHistoryItems)
                      ? goodReceiveHistory?.goodReceiveHistoryItems
                      : []
                  }
                  loading={false}
                  pagination={false}
                  scroll={{ x: true }}
                  style={{ marginBottom: 32 }}
                />
              </Col>
            </Row>
          </>
        ))}
    </Modal>
  )
}

export default GRHistoryModal
