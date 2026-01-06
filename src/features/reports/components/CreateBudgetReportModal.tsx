import { FileSearchOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Row, Space, Spin } from 'antd'

import { AdditionBatchParams } from 'api/reportApi.types'
import { useNotification } from 'hooks/useNotification'

import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import BudgetYearDropdown from 'components/BudgetYearDropdown'
import HeaderTitle from 'components/HeaderTitle'
import SiteWithPermissionDropdown from 'components/SiteWithPermissionDropdown'

import { REPORT_NAME } from 'constants/index'

import SectionDropdown from './SectionDropdown'

// Define interface for form values
export interface CreateBudgetReportFormValues {
  siteCode?: string
  siteId?: string
  budgetYear?: number
  budgetTypeId?: string | null
  sectionId?: string | null
}

interface CreateBudgetReportModalProps {
  title: string
  open: boolean
  onCancel: () => void
  afterClose?: () => void
  onCreateReport: (jobName: string, additionBatchParams: AdditionBatchParams) => void
  isCreatingReport: boolean
}

const CreateBudgetReportModal = ({
  title,
  open,
  onCancel,
  afterClose,
  onCreateReport,
  isCreatingReport,
}: CreateBudgetReportModalProps) => {
  const [form] = Form.useForm<CreateBudgetReportFormValues>()
  const { openNotification } = useNotification()
  const siteCode = Form.useWatch('siteCode', form)

  // Handle form submission
  const handleCreateReport = async (values: CreateBudgetReportFormValues) => {
    try {
      const additionBatchParams: AdditionBatchParams = {
        siteCode: values.siteCode,
        siteId: values.siteId,
        budgetYear: values.budgetYear,
        budgetTypeId: values.budgetTypeId === 'ALL' ? null : (values.budgetTypeId ?? null),
        sectionId: values.sectionId === 'ALL' ? null : (values.sectionId ?? null),
      }

      await onCreateReport(REPORT_NAME.BUDGET_REPORT, additionBatchParams)

      openNotification({
        type: 'success',
        title: 'Report Created',
        description: 'Report created successfully',
      })

      // Close modal after successful submission
      form.resetFields()
      onCancel()
    } catch (error) {
      console.error('Error creating report:', error)
      openNotification({
        type: 'error',
        title: 'Error Creating Report',
        description: 'Please try again',
      })
    }
  }

  // Handle cancel
  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={
        <>
          <HeaderTitle title={title} titlePreIcon={<FileSearchOutlined />} />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={open}
      onCancel={handleCancel}
      afterClose={afterClose}
      footer={null}
      width={800}
    >
      <Spin spinning={isCreatingReport}>
        <Form form={form} layout="vertical" onFinish={handleCreateReport}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item label="Site/โรงงาน" name="siteCode" rules={[{ required: true }]}>
                <SiteWithPermissionDropdown
                  onChange={(_, option) => {
                    const _option = option as {
                      id: string
                    }
                    form.setFieldsValue({
                      siteId: _option?.id,
                    })
                    form.resetFields(['sectionId'])
                  }}
                />
              </Form.Item>
              <Form.Item name="siteId" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <SectionDropdown
                siteCode={siteCode}
                formName="sectionId"
                formLabel="Section/แผนก"
                includeAllOption
              />
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item label="Budget Type" name="budgetTypeId">
                <BudgetTypeDropdown includeAllOption labelInValue={false} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Budget Year/ปีงบประมาณ"
                name="budgetYear"
                rules={[{ required: true, message: 'Please select a budget year' }]}
              >
                <BudgetYearDropdown />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" style={{ marginTop: 24 }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreatingReport}
                icon={<PlusOutlined />}
              >
                Create Report
              </Button>
            </Space>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default CreateBudgetReportModal
