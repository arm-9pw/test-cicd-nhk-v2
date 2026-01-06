import { FileSearchOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Space, Spin } from 'antd'
import dayjs from 'dayjs'

import { AdditionBatchParams } from 'api/reportApi.types'
import { useNotification } from 'hooks/useNotification'

import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import BudgetYearDropdown from 'components/BudgetYearDropdown'
import HeaderTitle from 'components/HeaderTitle'
import SiteWithPermissionDropdown from 'components/SiteWithPermissionDropdown'
import BudgetItemDropdown from 'features/purchaseRequisition/components/BudgetItemDropdown'
import { REPORT_NAME } from 'constants/index'

import { formatToLocalDateTime } from 'utils/dateHelpers'

import SectionDepartmentDropdown from './SectionDepartmentDropdown'

const { RangePicker } = DatePicker

// Get first and last day of current month
const currentDate = dayjs()
const startOfMonth = currentDate.startOf('month')
const endOfMonth = currentDate.endOf('month')

// Define interface for form values
export interface CreateFollowUpReportFormValues {
  siteId?: string
  budgetYear?: number
  budgetTypeId?: string | null
  budgetId?: string | null
  siteCode?: string
  sectionId?: string
  dateRange?: [Date, Date]
}

interface CreateFollowUpReportModalProps {
  title: string
  open: boolean
  onCancel: () => void
  afterClose?: () => void
  onCreateReport: (jobName: string, additionBatchParams: AdditionBatchParams) => void
  isCreatingReport: boolean
}

const CreateFollowUpReportModal = ({
  title,
  open,
  onCancel,
  afterClose,
  onCreateReport,
  isCreatingReport,
}: CreateFollowUpReportModalProps) => {
  const [form] = Form.useForm<CreateFollowUpReportFormValues>()
  const { openNotification } = useNotification()
  const siteId = Form.useWatch('siteId', form)
  const siteCode = Form.useWatch('siteCode', form)
  const budgetTypeId = Form.useWatch('budgetTypeId', form)

  // Handle form submission
  const handleCreateReport = async (values: CreateFollowUpReportFormValues) => {
    const startDate = formatToLocalDateTime(values.dateRange?.[0])
    const endDate = formatToLocalDateTime(values.dateRange?.[1])

    try {
      const additionBatchParams = {
        siteCode: values.siteCode,
        siteId: values.siteId,
        budgetYear: values.budgetYear,
        budgetTypeId: values.budgetTypeId === 'ALL' ? null : (values.budgetTypeId ?? null),
        budgetId: values.budgetId === 'ALL' ? null : (values.budgetId ?? null),
        sectionId: values.sectionId === 'ALL' ? null : (values.sectionId ?? null),
        startDate,
        endDate,
      }
      await onCreateReport(REPORT_NAME.FOLLOW_UP, additionBatchParams)

      openNotification({
        type: 'success',
        title: 'Report Created',
        description: 'Report created successfully',
      })

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
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleCreateReport}
          initialValues={{
            dateRange: [startOfMonth, endOfMonth],
          }}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Site/โรงงาน"
                name="siteCode"
                rules={[{ required: true, message: 'Please select a site' }]}
              >
                <SiteWithPermissionDropdown
                  onChange={(_, option) => {
                    const _option = option as {
                      id: string
                    }
                    form.setFieldsValue({
                      siteId: _option?.id,
                    })
                    form.resetFields(['budgetId', 'sectionId'])
                  }}
                />
              </Form.Item>
              <Form.Item name="siteId" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
            <SectionDepartmentDropdown
                siteCode={siteCode}
                formName="sectionId"
                formLabel="Section/แผนก"
                includeAllOption
              />
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Budget Type/ชนิดงบประมาณ" name="budgetTypeId">
                <BudgetTypeDropdown includeAllOption labelInValue={false} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <BudgetItemDropdown
                includeAllOption
                formName="budgetId"
                formLabel="Budget Code/งบประมาณเลขที่"
                budgetTypeId={budgetTypeId === 'ALL' ? undefined : (budgetTypeId ?? undefined)}
                organizationId={siteId}
              />
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Budget Year/ปีงบประมาณ"
                name="budgetYear"
              >
                <BudgetYearDropdown />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Date Range/ช่วงวันที่" 
                name="dateRange"
                rules={[{ required: true, message: 'Please select date range' }]}
              >
                <RangePicker style={{ width: '100%' }} format="DD/MMM/YY" />
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

export default CreateFollowUpReportModal
