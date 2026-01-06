import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Popconfirm, Row, Spin } from 'antd'

import { SiteManagementResponseType } from 'api/siteManagementApi.types'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'

import { gutter } from 'constants/index'

import OrganizationDropdown, { OrganizationOptionType } from './OrganizationDropdown'
import useEditSiteModal from './hooks/useEditSiteModal'

type Props = {
  editSiteModal: ReturnType<typeof useCustomModal>
  closeEditSiteModal: () => void
  selectedSite: SiteManagementResponseType | null
}

const SPAN = { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }

const EditSiteModal = ({ selectedSite, editSiteModal, closeEditSiteModal }: Props) => {
  const { siteFormRef, onSave, onDelete, isCreating, isUpdating, isDeleting } = useEditSiteModal({
    selectedSite,
    closeEditSiteModal,
  })

  const getModalTitle = () => {
    if (selectedSite) {
      return <HeaderTitle title="Edit Site/แก้ไขหน่วยงาน" titlePreIcon={<EditOutlined />} />
    }
    return <HeaderTitle title="Add Site/เพิ่มหน่วยงาน" titlePreIcon={<PlusOutlined />} />
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          {getModalTitle()}
          <Divider style={{ margin: '16px 0' }} />{' '}
        </>
      }
      open={editSiteModal.isModalVisible}
      onCancel={closeEditSiteModal}
      afterClose={editSiteModal.afterClose}
      width={800}
      footer={null}
    >
      <Spin spinning={isCreating || isUpdating || isDeleting}>
        <Form labelWrap layout="vertical" form={siteFormRef}>
          <Row gutter={gutter} align="bottom">
            <Form.Item name="organizationId" style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Col {...SPAN}>
              <Form.Item
                label="Organization Name/หน่วยงาน"
                name="organizationName"
                rules={[{ required: true }]}
              >
                <OrganizationDropdown
                  onChange={(_value, option) => {
                    const orgOption = option as OrganizationOptionType
                    siteFormRef?.setFieldsValue({
                      organizationCode: orgOption?.code,
                      organizationId: orgOption?.id,
                      organizationName: orgOption?.label,
                    })
                  }}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Organization Code/รหัสหน่วยงาน"
                name="organizationCode"
                // rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Tax ID/เลขประจำตัวผู้เสียภาษี"
                name="taxId"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Site Name/ชื่อสาขา" name="siteName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Site Branch No/รหัสสาขา"
                name="siteBranchNo"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Site Branch Name/ชื่อรหัสสาขา"
                name="siteBranchName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Address/ที่อยู่"
                name="addressTh"
                rules={[{ required: true }]}
                style={{ width: '100%' }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Province TH/จังหวัด" name="provinceTh" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Country TH/ประเทศ" name="countryTH" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Address EN/ที่อยู่ (ภาษาอังกฤษ)"
                name="addressEn"
                style={{ width: '100%' }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Province EN/จังหวัด (ภาษาอังกฤษ)" name="provinceEn">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Country EN/ประเทศ (ภาษาอังกฤษ)" name="countryEN">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Telephone/เบอร์โทรศัพท์"
                name="telephone"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item label="Email/อีเมล" name="email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                label="Site Short Code/รหัสย่อสาขา"
                name="siteShortCode"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} style={{ marginTop: 16 }} align="bottom" justify="end">
            {selectedSite && (
              <Col>
                <Popconfirm title="Are you sure you want to delete?" onConfirm={onDelete}>
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
export default EditSiteModal
