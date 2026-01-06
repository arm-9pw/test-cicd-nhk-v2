import { FileSearchOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Space, Spin } from 'antd'
import dayjs from 'dayjs'

import { AdditionBatchParams } from 'api/reportApi.types'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'
import SiteWithPermissionDropdown from 'components/SiteWithPermissionDropdown'

import { REPORT_NAME } from 'constants/index'
import { formatToLocalDateTime } from 'utils/dateHelpers'

import SectionDepartmentDropdown from './SectionDepartmentDropdown'

const { RangePicker } = DatePicker

// Get first and last day of current month
const currentDate = dayjs()
const startOfMonth = currentDate.startOf('month')
const endOfMonth = currentDate.endOf('month')

// Define interface for form values
export interface CreateInvoiceSummaryReportFormValues {
  siteCode?: string
  siteId?: string
  sectionId?: string
  invoiceDate?: [Date, Date]
}

interface CreateInvoiceSummaryReportModalProps {
  title: string
  open: boolean
  onCancel: () => void
  afterClose?: () => void
  onCreateReport: (jobName: string, additionBatchParams: AdditionBatchParams) => void
  isCreatingReport: boolean
}

const CreateInvoiceSummaryReportModal = ({
  title,
  open,
  onCancel,
  afterClose,
  onCreateReport,
  isCreatingReport,
}: CreateInvoiceSummaryReportModalProps) => {
  const [form] = Form.useForm<CreateInvoiceSummaryReportFormValues>()
  const { openNotification } = useNotification()
  const siteCode = Form.useWatch('siteCode', form)

  // Handle form submission
  const handleCreateReport = async (values: CreateInvoiceSummaryReportFormValues) => {
    const startDate = formatToLocalDateTime(values.invoiceDate?.[0])
    const endDate = formatToLocalDateTime(values.invoiceDate?.[1])

    try {
      const additionBatchParams = {
        siteCode: values.siteCode,
        siteId: values.siteId,
        sectionId: values.sectionId === 'ALL' ? null : (values.sectionId ?? null),
        startDate,
        endDate,
      }

      await onCreateReport(REPORT_NAME.INVOICE_SUMMARY, additionBatchParams)

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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateReport}
          initialValues={{
            invoiceDate: [startOfMonth, endOfMonth],
          }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span>Site/โรงงาน</span>}
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
                    form.resetFields(['sectionId'])
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
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Invoice Date/วันที่ใบ Invoice" name="invoiceDate">
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

export default CreateInvoiceSummaryReportModal
