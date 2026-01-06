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
  Table,
} from 'antd'
import { useState, useEffect } from 'react'

import { BudgetSiteResponseType, BudgetsResponseType } from 'api/budgetManagementApi.types'
import { useDeleteBudgetSiteMutation } from 'api/budgetManagementApi'
import { useNotification } from 'hooks/useNotification'
import useCustomModal from 'hooks/useCustomModal'

import BudgetDropdown, { BudgetDropdownType } from 'components/BudgetDropdown'
import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import HeaderTitle from 'components/HeaderTitle'

import { gutter } from 'constants/index'
import { formatNumber } from 'utils/generalHelpers'

import { budgetSiteColumns, columns } from './columns'
import useEditBudgetModal from './hooks/useEditBudgetModal'
import EditBudgetSiteModal from './EditBudgetSiteModal'

type Props = {
  editBudgetModal: ReturnType<typeof useCustomModal>
  closeEditBudgetModal: () => void
  selectedBudget: BudgetsResponseType | null
  onBudgetUpdated: (updatedBudget: BudgetsResponseType) => void
}

const SPAN = { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }

const EditBudgetModal = ({ selectedBudget, editBudgetModal, closeEditBudgetModal, onBudgetUpdated }: Props) => {
  const {
    formRef,
    isSubBudget,
    budgetAmount,
    onFormValuesChange,
    onSave,
    onDelete,
    setIsSubBudget,
    isCreating,
    isUpdating,
    isDeleting,
  } = useEditBudgetModal({ selectedBudget, closeEditBudgetModal })

  const [deleteBudgetSite] = useDeleteBudgetSiteMutation()
  const { openNotification } = useNotification()

  const budgetSiteModal = useCustomModal()

  // Local state to track updated budget data
  const [localBudgetData, setLocalBudgetData] = useState<BudgetsResponseType | null>(selectedBudget)

  // Update local data when selectedBudget changes
  useEffect(() => {
    setLocalBudgetData(selectedBudget)
  }, [selectedBudget])

  const getModalTitle = () => {
    if (selectedBudget) {
      return <HeaderTitle title="Edit Budget/แก้ไขงบประมาณ" titlePreIcon={<EditOutlined />} />
    }
    return <HeaderTitle title="Add Budget/เพิ่มงบประมาณ" titlePreIcon={<PlusOutlined />} />
  }

  const { RangePicker } = DatePicker

  // Use local budget data instead of selectedBudget for budget sites
  const budgetSitesData = localBudgetData?.budgetSites || []

  // Budget Site Modal handlers
  const onAddBudgetSite = () => {
    budgetSiteModal.showModal()
  }

  const onDeleteBudgetSite = async (budgetSite: BudgetSiteResponseType) => {
    if (!localBudgetData) return

    try {
      // Call API to delete budget site
      await deleteBudgetSite({
        budgetSiteId: budgetSite.id,
        budgetId: localBudgetData.id
      }).unwrap()

      // Update local state by removing the deleted budget site
      const updatedBudget = {
        ...localBudgetData,
        budgetSites: localBudgetData.budgetSites?.filter(site => site.id !== budgetSite.id) || []
      }

      setLocalBudgetData(updatedBudget)
      onBudgetUpdated(updatedBudget)

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Budget site deleted successfully.',
      })
    } catch (error) {
      console.error('Error deleting budget site:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete budget site.',
      })
    }
  }

  const closeBudgetSiteModal = () => {
    budgetSiteModal.handleCancel()
  }

  const onBudgetSiteUpdated = (updatedBudget: BudgetsResponseType) => {
    // Update local state ใน EditBudgetModal
    setLocalBudgetData(updatedBudget)
    // Update parent component's state
    onBudgetUpdated(updatedBudget)
  }


  return (
    <>
      <Modal
        destroyOnClose
        title={
          <>
            {getModalTitle()}
            <Divider style={{ margin: '16px 0' }} />
          </>
        }
        open={editBudgetModal.isModalVisible}
        onCancel={closeEditBudgetModal}
        width={1000}
        footer={null}
        afterClose={editBudgetModal.afterClose}
      >
        <Spin spinning={isCreating || isUpdating || isDeleting}>
          <Form labelWrap layout="vertical" form={formRef} onValuesChange={onFormValuesChange}>
            <Row gutter={gutter} align="bottom">
              <Col {...SPAN}>
                <Form.Item label="Budget Type" name="budgetType" rules={[{ required: true }]}>
                  <BudgetTypeDropdown />
                </Form.Item>
              </Col>
              <Col {...SPAN}>
                <Form.Item label="Budget Code" name="budgetCode" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col {...SPAN}>
                <Form.Item label="Budget Year" name="budgetYear" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col {...SPAN}>
                <Form.Item label="Budget Description" name="budgetDescription" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col {...SPAN}>
                <Form.Item label="Asset Type" name="budgetName" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col {...SPAN}>
                <Form.Item label="Date" name="dateRange" rules={[{ required: true }]}>
                  <RangePicker style={{ width: '100%' }} allowClear={false} />
                </Form.Item>
              </Col>
              <Col {...SPAN}>
                <Form.Item label="Cost Center" name="costCenter" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col {...SPAN}>
                <Row gutter={[8, 8]} align="bottom" justify="space-evenly">
                  <Col>
                    <Form.Item name="isActiveBudget" valuePropName="checked">
                      <Checkbox>Active</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="isSubBudget" valuePropName="checked">
                      <Checkbox onChange={(e) => setIsSubBudget(e.target.checked)}>
                        Sub Budget Code
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {isSubBudget && (
                <Col {...SPAN}>
                  <Form.Item label="Main Budget Code" name="mainBudget" rules={[{ required: true }]}>
                    <BudgetDropdown
                      onChange={(_value, option) => {
                        const _option = option as BudgetDropdownType
                        formRef.setFieldsValue({ mainBudgetName: _option.budgetName })
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="mainBudgetName" hidden>
                    <Input disabled />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Col span={24}>
                <Form.Item label="Budget Amount" name="budgetAmount">
                  <div>
                    <div style={{ marginTop: -8 }}>{formatNumber(budgetAmount)}</div>
                    <Input disabled style={{ display: 'none' }} />
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Budget Amount Per Month">
                  <Table
                    bordered
                    size="small"
                    pagination={false}
                    scroll={{ x: 'auto' }}
                    columns={columns}
                    rowKey="key"
                    dataSource={[{ key: '1' }]}
                  />
                </Form.Item>
              </Col>
              <Divider />
              {selectedBudget && (
                <Col span={24}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                    <Col>
                      <div className="ant-form-item-label">
                        <label style={{ color: '#1d336c' }}>Budget Site</label>
                      </div>
                    </Col>
                    <Col>
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        size="small"
                        onClick={onAddBudgetSite}
                      >
                        Add Budget Site
                      </Button>
                    </Col>
                  </Row>
                  {budgetSitesData.length > 0 && (
                    <Form.Item name="budgetSites">
                      <Table
                        bordered
                        size="middle"
                        tableLayout="auto"
                        columns={budgetSiteColumns(onDeleteBudgetSite)}
                        dataSource={budgetSitesData}
                        scroll={{ x: 'auto', y: 300 }}
                        rowKey="id"
                        pagination={false}
                        locale={{
                          emptyText: 'No budget sites added'
                        }}
                      />
                    </Form.Item>
                  )}
                </Col>
              )}
            </Row>
            <Row gutter={[8, 8]} style={{ marginTop: 16 }} align="bottom" justify="end">
              {selectedBudget && (
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

      {/* Budget Site Modal */}
      {budgetSiteModal.isModalMounted && (
        <EditBudgetSiteModal
          editBudgetSiteModal={budgetSiteModal}
          closeEditBudgetSiteModal={closeBudgetSiteModal}
          selectedBudgetSite={null}
          budgetId={selectedBudget?.id || ''}
          selectedBudget={localBudgetData}
          onBudgetSiteUpdated={onBudgetSiteUpdated}
        />
      )}
    </>
  )
}

export default EditBudgetModal