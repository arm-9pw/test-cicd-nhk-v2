import { useEffect } from 'react'

import { CloseOutlined, FileExclamationOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Modal, Radio, Row, Space, Spin, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import { useApprovePurchaseLogMutation } from 'api/purchaseLogApi'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import CustomDatePicker from 'components/CustomDatePicker'
import HeaderTitle from 'components/HeaderTitle'

import { DOMAINS, PO_STATUS } from 'constants/index'
import { formatToLocalDateTime, getDateFromString } from 'utils/dateHelpers'

import useGetCancelPOData from '../../hooks/useGetCancelPOData'

const { Text } = Typography

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingLeft: 16,
  paddingTop: 8,
}

type Props = {
  poId: string
  modalHook: ReturnType<typeof useCustomModal>
  approverName: string
  approverSite: string
  approverSection: string
  domainStatus: string
}

const ApproveCancelPOModal = ({
  poId,
  modalHook,
  approverName,
  approverSite,
  approverSection,
  domainStatus,
}: Props) => {
  const [formRef] = Form.useForm()
  const { openNotification } = useNotification()
  const [approvePurchaseLog, { isLoading: isApproving }] = useApprovePurchaseLogMutation()

  const { cancelData, isLoading: isFetchingData } = useGetCancelPOData({
    poId,
    domainStatus,
  })
  const isDisabledAllForm = domainStatus === PO_STATUS.PO_CANCELED

  useEffect(() => {
    if (cancelData) {
      formRef.setFieldsValue({
        approveStatus: cancelData.approveStatus,
        approveDate: getDateFromString(cancelData.approveDate),
        reasonApprove: cancelData.reasonApprove,
      })
    }
  }, [cancelData, formRef])

  const validateForm = async (): Promise<boolean> => {
    try {
      await formRef.validateFields()
      return true
    } catch (error) {
      console.error('Validation failed:', error)
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return false
    }
  }

  const onSaveApproveCancel = async () => {
    const isValid = await validateForm()
    if (!isValid) return

    if (!cancelData) {
      openNotification({
        title: 'Error',
        type: 'error',
        description: 'Cannot find cancel data to approve, please try again.',
      })
      return
    }

    const formValues = formRef.getFieldsValue()

    const data = {
      approverName,
      approverSite,
      approverSection,
      approveStatus: formValues?.approveStatus,
      approveDate: formatToLocalDateTime(formValues?.approveDate),
      reasonApprove: formValues?.reasonApprove,
      id: cancelData.id,
    }

    try {
      await approvePurchaseLog({
        domain: { domainName: DOMAINS.PURCHASE_ORDER, domainId: poId },
        data,
      }).unwrap()
      openNotification({
        title: 'Success',
        type: 'success',
        description: 'Purchase order cancellation approved successfully.',
      })
      modalHook.handleCancel()
    } catch (error) {
      console.error('Error approving cancellation:', error)
      openNotification({
        title: 'Error',
        type: 'error',
        description: 'Failed to approve cancellation. Please try again.',
      })
    }
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle
            title="Approve Purchase Order (PO.) Cancellation/อนุมัติยกเลิกใบสั่งซื้อสินค้า"
            titlePreIcon={<FileExclamationOutlined />}
          />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={modalHook.handleCancel}
      width={1000}
      footer={null}
      afterClose={modalHook.afterClose}
    >
      <Spin spinning={isApproving || isFetchingData}>
        <Row gutter={[16, 16]}>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Space>
              <Text strong>{`Purchaser Order/เจ้าหน้าที่จัดซื้อ:`}</Text>
              <Text>{approverName}</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text strong>Site/สาขา:</Text>
              <Text>{approverSite}</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text strong>Section/แผนก:</Text>
              <Text>{approverSection}</Text>
            </Space>
          </Col>
        </Row>
        <Form
          colon
          labelWrap
          form={formRef}
          layout="vertical"
          style={{ marginTop: '16px' }}
          disabled={isDisabledAllForm}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Status/สถานะ"
                name="approveStatus"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group style={style}>
                  <Radio value="APPROVE"> Approve </Radio>
                  <Radio value="REJECT"> Reject </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date./วันที่"
                name="approveDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <CustomDatePicker />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="reasonApprove"
                label="เหตุผลในการอนุมัติ"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {!isDisabledAllForm && (
          <Row gutter={[16, 16]} justify="end" style={{ marginTop: '16px' }}>
            <Col>
              <Button
                size="large"
                icon={<CloseOutlined />}
                onClick={() => modalHook.handleCancel()}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                size="large"
                icon={<SaveOutlined />}
                type="primary"
                onClick={onSaveApproveCancel}
              >
                Save
              </Button>
            </Col>
          </Row>
        )}
      </Spin>
    </Modal>
  )
}

export default ApproveCancelPOModal
