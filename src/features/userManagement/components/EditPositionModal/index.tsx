import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Spin,
} from 'antd'
import { useState } from 'react'

import { EmployeeUserType, PositionType } from 'api/employeeApi.types'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'
import SiteCodeDropdown from 'components/SiteCodeDropdown'

import OrganizationDropdown, { OrganizationOptionType } from './components/OrganizationDropdown'
import PositionDropdown from './components/PositionDropdown'
import useEditPositionModal from './hooks/useEditPositionModal'
import PositionTypeDropdown from './components/PositionTypeDropdown'

type Props = {
  positionModal: ReturnType<typeof useCustomModal>
  selectedPosition: PositionType | null
  selectedEmployee: EmployeeUserType | null
  hidePositionModal: () => void
  onRefresh?: () => void
}

const SPAN = { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }

const EditPositionModal = ({
  positionModal,
  selectedPosition,
  hidePositionModal,
  selectedEmployee,
}: Props) => {
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false)

  const {
    onSavePosition,
    positionFormRef,
    selectedSiteCode,
    setSelectedSiteCode,
    onDeletePosition,
    isCreating,
    isDeleting,
    isUpdating,
  } = useEditPositionModal({
    selectedPosition,
    hidePositionModal,
    selectedEmployee,
    setIsCurrentlyWorking,
  })

  const getModalTitle = () => {
    if (selectedPosition) {
      return <HeaderTitle title="Edit Position/แก้ไขตําแหน่ง" titlePreIcon={<EditOutlined />} />
    }
    return <HeaderTitle title="Add Position/เพิ่มตําแหน่ง" titlePreIcon={<PlusOutlined />} />
  }

  const handleCurrentlyWorkingChange = (checked: boolean) => {
    setIsCurrentlyWorking(checked)
    if (checked) {
      positionFormRef.setFieldsValue({ endJobDate: null })
    }
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
      open={positionModal.isModalVisible}
      onCancel={hidePositionModal}
      width={1000}
      footer={null}
      afterClose={positionModal.afterClose}
    >
      <Spin spinning={isCreating || isUpdating || isDeleting}>
        <Form labelWrap layout="vertical" form={positionFormRef}>
          <Row gutter={[16, 16]} align="bottom">
            <Col {...SPAN}>
              <Form.Item
                name="siteCode"
                label="Site Code"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <SiteCodeDropdown
                  onChange={(value) => {
                    setSelectedSiteCode(value)
                    positionFormRef.resetFields(['organizationId', 'organizationCode'])
                  }}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="organizationId"
                label="Organization Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <OrganizationDropdown
                  selectedSiteCode={selectedSiteCode}
                  onChange={(_value, option) => {
                    const orgOption = option as OrganizationOptionType
                    positionFormRef.setFieldsValue({
                      organizationCode: orgOption?.code,
                    })
                  }}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="organizationCode"
                label="Organization Code"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="positionId"
                label="Position"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <PositionDropdown />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="positionType"
                label="Position Type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <PositionTypeDropdown />
              </Form.Item>
            </Col>
            <Col {...SPAN} />
            <Col {...SPAN}>
              <Form.Item
                name="startJobDate"
                label="Start Job Date/วันที่เริ่มงาน"
                rules={[
                  {
                    required: true,
                    message: 'Please select start job date',
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select Start Date"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            {!isCurrentlyWorking && (
              <Col {...SPAN}>
                <Form.Item
                  name="endJobDate"
                  label="End Job Date/วันที่สิ้นสุดงาน"
                  rules={isCurrentlyWorking ? [] : [
                    {
                      required: true,
                      message: 'Please select end job date',
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select End Date"
                    format="DD/MM/YYYY"
                    disabled={isCurrentlyWorking}
                  />
                </Form.Item>
              </Col>
            )}
            <Col {...SPAN}>
              <Form.Item
                name="isCurrentlyWorking"
                valuePropName="checked"
                style={{ marginTop: '30px' }}
              >
                <Checkbox onChange={(e) => handleCurrentlyWorkingChange(e.target.checked)}>
                  Still Working/ยังทำงานอยู่
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} style={{ marginTop: '16px' }} align="bottom" justify="end">
            {selectedPosition && (
              <Col>
                <Popconfirm title="Are you sure you want to delete?" onConfirm={onDeletePosition}>
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
                onClick={onSavePosition}
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

export default EditPositionModal
