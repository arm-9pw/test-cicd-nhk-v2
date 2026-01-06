import { RetweetOutlined, SwapOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Modal, Row, Spin } from 'antd'

import { useTransferPRMutation } from 'api/prApi'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'
import PurchaseSectionDropdown from 'components/PurchaseSectionDropdown'

import { gutter } from 'constants/index'

type Props = {
  modalHook: ReturnType<typeof useCustomModal>
  hideModal: () => void
  mainGroupId?: string
  prId?: string | null
}

const TransferPRModal = ({ modalHook, hideModal, prId }: Props) => {
  const [formRef] = Form.useForm()
  const { openNotification } = useNotification()
  const [transferPR, { isLoading }] = useTransferPRMutation()

  const onTransfer = async () => {
    if (!prId) {
      openNotification({
        title: 'Error',
        type: 'error',
        description: 'Cannot find PR. id, please try again.',
      })
      return
    }

    try {
      await formRef.validateFields()
    } catch (error) {
      console.error('Validation Failed:', error)
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    const formValues = formRef.getFieldsValue()
    const data = {
      purchaseInChargeSectionId: formValues?.purchaseInchargeSection?.value,
      purchaseInChargeSectionName: formValues?.purchaseInchargeSection?.label,
    }

    try {
      await transferPR({ id: prId, data }).unwrap()
      openNotification({
        title: 'Success',
        type: 'success',
        description: 'PR. transferred successfully',
      })
      hideModal()
    } catch (error) {
      console.error('Transfer Failed:', error)
      openNotification({
        title: 'Error',
        description: 'Failed to transfer PR. Please try again.',
      })
    }
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle title="Transfer PR." titlePreIcon={<RetweetOutlined />} />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={hideModal}
      width={1000}
      footer={
        <>
          <Button type="primary" icon={<SwapOutlined />} onClick={onTransfer} loading={isLoading}>
            Transfer
          </Button>
        </>
      }
      afterClose={modalHook.afterClose}
    >
      <Spin spinning={isLoading}>
        <Form form={formRef} layout="vertical">
          <Row gutter={gutter}>
            <Col span={24}>
              <Form.Item
                label="Purchase Section/ส่วนการสั่งซื้อ"
                name="purchaseInchargeSection"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <PurchaseSectionDropdown />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default TransferPRModal
