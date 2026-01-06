import { useEffect } from 'react'

import { CloseOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Form, FormInstance, Input, Row, Space, Typography } from 'antd'
import dayjs from 'dayjs'

import { AttachmentFileType } from 'api/attachmentApi.types'

import CustomDatePicker from 'components/CustomDatePicker'
import DocumentAttachment from 'components/DocumentAttachment'

import { DOMAINS } from 'constants/index'

const { Text } = Typography
const { TextArea } = Input

const SPAN = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }

type Props = {
  isDisabledForm: boolean
  formRef: FormInstance
  fileList: AttachmentFileType[]
  setFileList: React.Dispatch<React.SetStateAction<AttachmentFileType[]>>
  requesterName: string
  requesterSite: string
  requesterSection: string
  domainNo: string
  domainDate: string
  domain: (typeof DOMAINS)[keyof typeof DOMAINS]
  reasonCancel?: string | null
  onSaveCancel: () => void
  hideModal: () => void
}

const CancelPurchaseForm = ({
  isDisabledForm,
  formRef,
  fileList,
  setFileList,
  requesterName,
  requesterSite,
  requesterSection,
  domainNo,
  domainDate,
  domain,
  onSaveCancel,
  hideModal,
  reasonCancel,
}: Props) => {
  useEffect(() => {
    const _domainDate = domainDate ? dayjs(domainDate) : null

    formRef.setFieldsValue({
      domainNo,
      domainDate: _domainDate,
      reasonCancel,
    })
  }, [formRef, domainNo, domainDate, reasonCancel])

  const getDomainName = () => {
    switch (domain) {
      case 'PURCHASE_ORDER':
        return 'PO.'
      case 'PURCHASE_REQUISITION':
        return 'PR.'
      default:
        return ''
    }
  }

  const getDefaultDocumentType = () => {
    switch (domain) {
      case 'PURCHASE_ORDER':
        return 'PO_CANCEL'
      case 'PURCHASE_REQUISITION':
        return 'PR_CANCEL'
      default:
        return ''
    }
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Space>
            <Text strong>{`Purchaser (${getDomainName()})/เจ้าหน้าที่จัดซื้อ:`}</Text>
            <Text>{requesterName}</Text>
          </Space>
        </Col>
        <Col>
          <Space>
            <Text strong>Site/สาขา:</Text>
            <Text>{requesterSite}</Text>
          </Space>
        </Col>
        <Col>
          <Space>
            <Text strong>Section/แผนก:</Text>
            <Text>{requesterSection}</Text>
          </Space>
        </Col>
      </Row>
      <Form
        colon
        labelWrap
        form={formRef}
        layout="vertical"
        style={{ marginTop: '16px' }}
        disabled={isDisabledForm}
      >
        <Row gutter={[16, 16]}>
          <Col {...SPAN}>
            <Form.Item name="domainNo" label={`${getDomainName()}/เลขที่`}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col {...SPAN}>
            <Form.Item name="domainDate" label={`${getDomainName()}/วันที่`}>
              <CustomDatePicker disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="reasonCancel" label="เหตุผลในการยกเลิก" rules={[{ required: true }]}>
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row style={{ marginTop: '16px' }}>
        <DocumentAttachment
          domain={domain}
          fileList={fileList}
          setFileList={setFileList}
          isDisabledDocumentType={true}
          defaultDocumentType={getDefaultDocumentType()}
          isDisabledForm={isDisabledForm}
        />
      </Row>
      {!isDisabledForm && (
        <Row gutter={[16, 16]} justify="end" style={{ marginTop: '16px' }}>
          <Col>
            <Space>
              <Button size="large" icon={<CloseOutlined />} onClick={hideModal}>
                Cancel
              </Button>
              <Button size="large" icon={<SaveOutlined />} type="primary" onClick={onSaveCancel}>
                Save
              </Button>
            </Space>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default CancelPurchaseForm
