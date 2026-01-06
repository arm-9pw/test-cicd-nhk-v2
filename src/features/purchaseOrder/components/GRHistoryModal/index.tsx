import { HistoryOutlined } from '@ant-design/icons'
import { Divider, Empty, Skeleton, Spin, Table } from 'antd'
import { Modal } from 'antd'

import { useGetGRHistoryQuery } from 'api/grApi'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'

import { formatDisplayDate } from 'utils/dateHelpers'
import { formatNumber } from 'utils/generalHelpers'

type GRHistoryModalProps = {
  modalHook: ReturnType<typeof useCustomModal>
  poId: string
}

const columns = [
  {
    title: 'No',
    // dataIndex: 'id',
    key: 'GRhistNo',
    minWidth: 60,
    render: (_: string, __: unknown, index: number) => {
      return `${index + 1}`
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    minWidth: 150,
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
    minWidth: 100,
  },
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    minWidth: 100,
  },
  {
    title: 'Detail',
    dataIndex: 'detail',
    key: 'detail',
    minWidth: 250,
  },
  {
    title: 'Recieve QTY',
    dataIndex: 'receiveQty',
    key: 'receiveQty',
    minWidth: 100,
  },
  {
    title: 'Receive Price',
    dataIndex: 'receivePrice',
    key: 'receivePrice',
    minWidth: 120,
    render: (text: number | null) =>
      text ? <div style={{ textAlign: 'right' }}>{formatNumber(text)}</div> : '',
  },
  {
    title: 'Receive Total',
    dataIndex: 'receiveTotal',
    key: 'receiveTotal',
    minWidth: 120,
    render: (text: number | null) =>
      text ? <div style={{ textAlign: 'right' }}>{formatNumber(text)}</div> : '',
  },
  {
    title: 'Inv. Receive Name',
    dataIndex: 'invoiceReceiveName',
    key: 'invoiceReceiveName',
    minWidth: 150,
  },
  {
    title: 'Inv. No',
    dataIndex: 'invoiceNo',
    key: 'invoiceNo',
    minWidth: 100,
  },
  {
    title: 'Inv. Date',
    dataIndex: 'invoiceDate',
    key: 'invoiceDate',
    minWidth: 100,
    render: (text: string) => {
      return formatDisplayDate(text)
    },
  },
  {
    title: 'Paid Date',
    dataIndex: 'paidDate',
    key: 'paidDate',
    minWidth: 100,
    render: (text: string) => {
      return formatDisplayDate(text)
    },
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
    minWidth: 150,
  },
]

const GRHistoryModal = ({ modalHook, poId }: GRHistoryModalProps) => {
  const { data, isFetching: isFetchingGRHistory } = useGetGRHistoryQuery(
    { poId },
    { skip: !poId, refetchOnMountOrArgChange: true },
  )

  const GRHistoryData = data?.goodReceiveHistories || []

  const getModalContent = () => {
    if (!poId) {
      return <Empty description="ไม่มี PO id กรุณาลองใหม่อีกครั้ง" />
    }

    if (isFetchingGRHistory) {
      return (
        <Spin tip="กำลังดึงข้อมูล">
          <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
        </Spin>
      )
    }

    if (GRHistoryData.length === 0) {
      return <Empty description="ไม่มีประวัติการรับ / No GR history found" />
    }

    return GRHistoryData.map((item, index) => {
      return (
        <Table
          key={item.id}
          title={() => `รับครั้งที่ ${index + 1}`}
          bordered
          size="small"
          tableLayout="auto"
          columns={columns}
          dataSource={item.goodReceiveHistoryItems || []}
          loading={isFetchingGRHistory}
          pagination={false}
          scroll={{ x: true }}
          style={{ marginBottom: 32 }}
          rowKey={(record) => record.id}
          locale={{
            emptyText: <Empty description="ไม่มีประวัติการรับ / No GR history found" />,
          }}
        />
      )
    })
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle title="GR. History/ประวัติการรับ" titlePreIcon={<HistoryOutlined />} />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={modalHook.isModalVisible}
      onOk={modalHook.handleOk}
      onCancel={modalHook.handleCancel}
      width="80vw"
      footer={null}
      afterClose={modalHook.afterClose}
    >
      {getModalContent()}
    </Modal>
  )
}

export default GRHistoryModal
