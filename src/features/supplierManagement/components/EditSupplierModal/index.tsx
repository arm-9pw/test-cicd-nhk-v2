import { EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Popconfirm, Row, Spin } from 'antd'

import { SupplierType } from 'api/supplierApi.types'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'
import PaymentTermDropdown from 'components/PaymentTermDropdown'

import { gutter } from 'constants/index'

import useEditSupplierModal from './hooks/useEditSupplierModal'

type Props = {
  editSupplierModal: ReturnType<typeof useCustomModal>
  closeEditSupplierModal: () => void
  selectedSupplier: SupplierType | null
}

const SPAN = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }

const EditSupplierModal = ({
  editSupplierModal,
  selectedSupplier,
  closeEditSupplierModal,
}: Props) => {
  const { supplierFormRef, onSaveSupplier, onDeleteSupplier, isCreating, isUpdating, isDeleting } =
    useEditSupplierModal({
      selectedSupplier,
      closeEditSupplierModal,
    })

  const getModalTitle = () => {
    if (selectedSupplier) {
      return <HeaderTitle title="Edit Supplier" titlePreIcon={<EditOutlined />} />
    }
    return <HeaderTitle title="Add Supplier" titlePreIcon={<PlusOutlined />} />
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          {getModalTitle()}
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={editSupplierModal.isModalVisible}
      onCancel={closeEditSupplierModal}
      width={800}
      footer={null}
      afterClose={editSupplierModal.afterClose}
    >
      <Spin spinning={isCreating || isUpdating || isDeleting}>
        <Form labelWrap layout="vertical" form={supplierFormRef}>
          <Row gutter={gutter} align={'bottom'}>
            <Col {...SPAN}>
              <Form.Item label="Supplier Name" name="supplierName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Supplier Code" name="supplierCode" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Supplier Tax ID" name="taxId" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Attention" name="attention" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Position" name="position" >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={gutter} align={'bottom'}>
            <Col span={24}>
              <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={gutter} align={'bottom'}>
            <Col {...SPAN}>
              <Form.Item label="Supplier Province" name="supplierProvince" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Supplier Country" name="supplierCountry" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Supplier Postcode" name="supplierPostcode" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Supplier Fax" name="supplierFax">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Telephone" name="telephone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Payment Term" name="paymentTerm" rules={[{ required: true }]}>
                <PaymentTermDropdown />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Payment Term Description"
                name="paymentTermDescription"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} style={{ marginTop: 16 }} align={'bottom'} justify={'end'}>
            {selectedSupplier && (
              <Col>
                <Popconfirm title="Are you sure you want to delete?" onConfirm={onDeleteSupplier}>
                  <Button type="primary" danger icon={<SaveOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Col>
            )}

            <Col>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSaveSupplier}
                loading={isCreating || isUpdating}
                disabled={isCreating || isUpdating || isDeleting}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}
export default EditSupplierModal
