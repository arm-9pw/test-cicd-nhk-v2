import React, { useEffect } from 'react'

import { FileExclamationOutlined } from '@ant-design/icons'
import { Divider, Modal, Table } from 'antd'

import { useGetDocumentLocationQuery } from 'api/procurementApi'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'

import { formatUTCToBangkokDisplayDateTime } from 'utils/dateHelpers'

// Get the return type from the useCustomModal hook
type UseCustomModalReturnType = ReturnType<typeof useCustomModal>

type DocumentLocationModalProps = {
  modalHook: UseCustomModalReturnType
  documentNo: string
  operationType: string
}

const DocumentLocationModal: React.FC<DocumentLocationModalProps> = ({
  modalHook,
  documentNo,
  operationType,
}) => {
  const { openNotification } = useNotification()
  const shouldFetch =
    !!operationType &&
    !!documentNo &&
    (operationType === 'PURCHASE_REQUISITION' || operationType === 'PURCHASE_ORDER')

  const params =
    operationType === 'PURCHASE_REQUISITION' && documentNo
      ? { prNo: documentNo }
      : operationType === 'PURCHASE_ORDER' && documentNo
        ? { poNo: documentNo }
        : {}

  const {
    data: DocumentLocationData = [],
    isFetching,
    isError,
  } = useGetDocumentLocationQuery(params, { skip: !shouldFetch })

  useEffect(() => {
    if (isError) {
      openNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถดึงข้อมูลสถานะเอกสารได้ กรุณาลองใหม่อีกครั้ง',
      })
    }
  }, [isError, openNotification])

  const columns = [
    {
      title: 'No',
      key: 'DocLocNo',
      render: (_: string, __: unknown, index: number) => {
        return `${index + 1}`
      },
      align: 'center' as const,
    },
    {
      title: 'Document Status',
      dataIndex: 'documentStatus',
      key: 'documentStatus',
      align: 'center' as const,
      render: (text: string) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      },
    },
    {
      title: 'Date/Time',
      dataIndex: 'date',
      key: 'DocLocDate',
      align: 'center' as const,
      render: (text: string) => {
        return formatUTCToBangkokDisplayDateTime(text)
      },
    },
    {
      title: 'Performed By',
      dataIndex: 'name',
      key: 'DocLocName',
      align: 'center' as const,
      render: (text: string) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'DocLocAction',
      align: 'center' as const,
      // split text by "_" and show only the last part
      render: (text: string) => {
        const splitText = text.split('_')

        if (splitText.length > 1) {
          return splitText[splitText.length - 1]
        } else {
          return splitText[0]
        }
      },
    },
  ]

  return (
    <Modal
      title={
        <>
          <HeaderTitle title="Document Location" titlePreIcon={<FileExclamationOutlined />} />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={modalHook.isModalVisible}
      onOk={modalHook.handleOk}
      onCancel={modalHook.handleCancel}
      okText="OK"
      cancelText="Cancel"
      style={{ minWidth: '80%', minHeight: '80%' }}
      afterClose={modalHook.afterClose}
      footer={null}
    >
      <Table
        rowHoverable
        bordered
        size="middle"
        tableLayout="auto"
        columns={columns}
        dataSource={Array.isArray(DocumentLocationData) ? DocumentLocationData : []}
        loading={isFetching}
        pagination={false}
        scroll={{ x: true }}
        style={{ marginBottom: 32 }}
        rowKey="id"
      />
    </Modal>
  )
}

export default DocumentLocationModal
