import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, InputNumber, Modal, Popconfirm, Row, Spin } from 'antd'

import { ItemManagementRespType } from 'api/itemManagementApiType'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'

import { DOMAINS, PAGE_MODE } from 'constants/index'

import ItemAttachment from './ItemAttachment'
import useEditItemModal from './hooks/useEditItemModal'

type Props = {
  editItemModal: ReturnType<typeof useCustomModal>
  selectedItems: ItemManagementRespType | null
  closeEditItemModal: () => void
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
}

const SPAN = { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }

const EditItemModal = ({ editItemModal, selectedItems, closeEditItemModal, mode }: Props) => {
  const {
    itemFormRef,
    onSave,
    onDelete,
    isCreating,
    isUpdating,
    isDeleting,
    documentList,
    onSetDocumentList,
  } = useEditItemModal({
    selectedItems,
    closeEditItemModal,
  })

  const getModalTitle = () => {
    if (selectedItems) {
      return <HeaderTitle title="Edit Item" titlePreIcon={<EditOutlined />} />
    }
    return <HeaderTitle title="Add Item" titlePreIcon={<PlusOutlined />} />
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
      open={editItemModal.isModalVisible}
      onCancel={closeEditItemModal}
      afterClose={editItemModal.afterClose}
      width={1000}
      footer={null}
    >
      <Spin spinning={isCreating || isUpdating || isDeleting}>
        <Form labelWrap layout="vertical" form={itemFormRef}>
          <Row gutter={16} align={'bottom'}>
            <Col {...SPAN}>
              <Form.Item label="Name/ชื่อสินค้า" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Brand/ยี่ห้อสินค้า" name="brand" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Model/รุ่นสินค้า" name="model" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Detail/รายละเอียดสินค้า" name="detail" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Qty/จำนวน"
                name="qty"
                rules={[
                  { required: true },
                  { type: 'number', min: 0.009, message: 'Quantity must be greater than 0' },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Unit/หน่วยสินค้า" name="unit" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="UnitPrice/ราคาต่อหน่วยสินค้า"
                name="unitPrice"
                rules={[
                  { required: true, message: 'Please input qty' },
                  { type: 'number', min: 0.009, message: 'Quantity must be greater than 0' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={999999999.99}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ marginBottom: 16 }} />

          <Form.Item name="documentAttachment" hidden>
            <Input />
          </Form.Item>

          <div hidden>
            <ItemAttachment
              mode={mode}
              domain={DOMAINS.MASTER_ITEM}
              refId={selectedItems?.id ?? ''}
              documentList={documentList}
              onSetDocumentList={onSetDocumentList}
              isDisabledAllForm={false}
            />
          </div>
          <div style={{ marginBottom: 16 }} />

          <Row gutter={[8, 8]} style={{ marginTop: 16 }} align={'bottom'} justify={'end'}>
            {selectedItems && (
              <Col>
                <Popconfirm
                  title="Are you sure you want to delete?"
                  onConfirm={() => onDelete(selectedItems?.id)}
                >
                  <Button danger type="primary" loading={isDeleting} icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Col>
            )}
            <Col>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSave}
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
export default EditItemModal
