import { useEffect, useState } from 'react'

import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Popconfirm, Row, Select } from 'antd'

// import styles from './WorkflowModal.module.css'
import {
  useCreateWorkflowMutation,
  useDeleteApproveStepMutation,
  useDeleteWorkFlowMutation,
} from 'api/workflowManagementApi'
import {
  CreateWorkflowRequest,
  WorkflowManagemantType,
  WorkflowStepType,
} from 'api/workflowManangement.types'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'
import SiteCodeDropdown from 'components/SiteCodeDropdown'
import WorkflowDepartmentDropdown from 'features/workflowManagement/components/Dropdown/WorkflowDepartmentDropdown'

// ✅ ใช้ ApproveModal เดิม แต่เราส่ง onSave เข้าไป
import { gutter } from 'constants/index'
import { formatNumber } from 'utils/generalHelpers'

import ApproveModal from '../AppoverModal'
import WorkflowStepsFlow from '../WorkflowStepsFlow'

const { Option } = Select

type Props = {
  modalHook: ReturnType<typeof useCustomModal>
  approveModalHook: ReturnType<typeof useCustomModal> // ✅ รับ hook ของ ApproveModal
  selectedWorkflow: WorkflowManagemantType | null
  setSelectedWorkflow: (workflow: WorkflowManagemantType | null) => void
}

const SPAN = { xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }

const WorkflowModal = ({
  modalHook,
  approveModalHook,
  selectedWorkflow,
  setSelectedWorkflow,
}: Props) => {
  const [form] = Form.useForm()

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepType[]>([])
  const [isShowStepFlow, setIsShowStepFlow] = useState(false)

  const [editingStep, setEditingStep] = useState<WorkflowStepType | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null)

  const workflowType = Form.useWatch('workflowType', form)
  const siteCode = Form.useWatch('siteCode', form)

  const [deleteApproveStep, { isLoading: isDeletingStep }] = useDeleteApproveStepMutation()
  const [deleteWorkFlow, { isLoading: isDeletingWorkflow }] = useDeleteWorkFlowMutation()
  const [createWorkflow, { isLoading: isCreateWorkflow }] = useCreateWorkflowMutation()
  const { openNotification } = useNotification()

  const formatAmountRange = (minAmount: number, maxAmount: number | null): string => {
    const min = formatNumber(minAmount)

    // ถ้าไม่มี maxAmount หรือเป็น 0
    if (!maxAmount || maxAmount === 0) {
      return `No specified limit`
    }

    const max = formatNumber(maxAmount)
    return `${min} - ${max}`
  }

  useEffect(() => {
    if (selectedWorkflow) {
      form.setFieldsValue({
        siteCode: selectedWorkflow.siteCode,
        workflowType: selectedWorkflow.workflowType,
        departmentName: selectedWorkflow.organizationId,
        organizationId: selectedWorkflow.organizationId,
        organizationName: selectedWorkflow.organizationName, // ✅ เพิ่ม
      })

      setWorkflowSteps(selectedWorkflow.steps ?? [])
      setCurrentTemplateId(String(selectedWorkflow.id))
      setIsShowStepFlow(true)
    } else {
      form.resetFields()
      setWorkflowSteps([])
      setCurrentTemplateId(null)
      setIsShowStepFlow(false)
    }
  }, [selectedWorkflow, form])

  const handleSaveWorkflow = async () => {
    try {
      const values = await form.validateFields()

      if (!selectedWorkflow) {
        const workflowData: CreateWorkflowRequest = {
          workflowType: values.workflowType,
          siteCode: values.siteCode,
          organizationId: values.organizationId,
          organizationName: values.organizationName,
        }

        const result = await createWorkflow(workflowData).unwrap()

        openNotification({
          type: 'success',
          title: 'Department Created',
          description: 'Department created successfully',
        })
        setSelectedWorkflow(result)
        setCurrentTemplateId(result.id)
      }
      setIsShowStepFlow(true)
    } catch (error) {
      console.error(error, 'error save Department')
      openNotification({
        type: 'error',
        title: 'Error Department',
        description: 'An error occurred while saving the Department. Please try again.',
      })
    }
  }

  const lastIndex = workflowSteps.length - 1

  const handleStepSaved = (savedStep: WorkflowStepType) => {
    if (isEditMode && editingStep) {
      // Edit Mode - อัปเดต step ที่มีอยู่
      setWorkflowSteps((prev) =>
        prev.map((step) => (step.id === editingStep.id ? savedStep : step)),
      )

      // Reset edit state
      setEditingStep(null)
      setIsEditMode(false)
    } else {
      //เพิ่ม step ใหม่ (ใช้ข้อมูลจาก API response)
      setWorkflowSteps((prev) => [...prev, savedStep])
    }
  }

  const getNextStepOrder = () => {
    if (workflowSteps.length === 0) return 1
    return Math.max(...workflowSteps.map((s) => s.stepOrder)) + 1
  }

  const handleDeleteLast = async () => {
    if (!workflowSteps.length) return

    const lastStep = workflowSteps[workflowSteps.length - 1]

    if (lastStep.id) {
      try {
        await deleteApproveStep(lastStep.id.toString()).unwrap()

        setWorkflowSteps((prev) => prev.slice(0, prev.length - 1))

        openNotification({
          type: 'success',
          title: 'Approve Step Deleted',
          description: 'Approve Step has been deleted successfully.',
        })
      } catch (error) {
        console.error('Failed to delete Approve Step:', error)
        openNotification({
          type: 'error',
          title: 'Error Delete Approve Step',
          description: 'An error occurred while deleting the Approve Step. Please try again.',
        })
      }
    }
  }

  const handleEditStep = (step: WorkflowStepType) => {
    setEditingStep(step)
    setIsEditMode(true)
    approveModalHook.showModal()
  }

  const handleDeleteWorkflow = async () => {
    if (!selectedWorkflow) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'No Workflow selected.',
      })
      return
    }
    try {
      await deleteWorkFlow(selectedWorkflow.id).unwrap()
      openNotification({
        type: 'success',
        title: 'Workflow Deleted',
        description: 'Workflow has been deleted successfully.',
      })
      modalHook.afterClose()
    } catch (error) {
      console.error('Failed to delete Workflow:', error)
      openNotification({
        type: 'error',
        title: 'Error Deleting Workflow',
        description: 'An error occurred while deleting the Workflow. Please try again.',
      })
    }
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          {selectedWorkflow ? (
            <HeaderTitle title="Edit Workflow" titlePreIcon={<EditOutlined />} />
          ) : (
            <HeaderTitle title="Create New Workflow" titlePreIcon={<PlusOutlined />} />
          )}
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={modalHook.handleCancel}
      width={'90%'}
      footer={null}
      afterClose={modalHook.afterClose}
    >
      <Form form={form} labelWrap layout="vertical">
        <Row gutter={gutter} align="bottom">
          <Col {...SPAN}>
            <Form.Item label="Site Code" name="siteCode" rules={[{ required: true }]}>
              <SiteCodeDropdown
                disabled={isShowStepFlow}
                onChange={() => {
                  form.resetFields(['organizationId', 'organizationName', 'departmentName'])
                }}
              />
            </Form.Item>
          </Col>

          <Col {...SPAN}>
            <WorkflowDepartmentDropdown
              disabled={isShowStepFlow}
              siteCode={siteCode}
              formName="departmentName"
              formLabel="Department Name"
              rules={[{ required: true }]}
              onChange={(value) => {
                if (value) {
                  form.setFieldsValue({
                    organizationId: value.id,
                    organizationName: value.name,
                  })
                } else {
                  form.resetFields(['organizationId', 'organizationName'])
                }
              }}
            />

            {/* ใต้ WorkflowDepartmentDropdown */}
            <Form.Item name="organizationId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="organizationName" hidden>
              <Input />
            </Form.Item>
          </Col>

          <Col {...SPAN}>
            <Form.Item label="Workflow type" name="workflowType" rules={[{ required: true }]}>
              <Select placeholder="Select Workflow Type" disabled={isShowStepFlow}>
                <Option value="PR">PR.</Option>
                <Option value="PO">PO.</Option>
                <Option value="SHARED">Share PR. & PO. Flow</Option>
                <Option value="RECEIVE_PR">Receive PR.</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {isShowStepFlow && (
        <WorkflowStepsFlow
          isShowStepFlow={isShowStepFlow}
          workflowType={workflowType}
          workflowSteps={workflowSteps}
          lastIndex={lastIndex}
          handleEditStep={handleEditStep}
          handleDeleteLast={handleDeleteLast}
          isDeletingStep={isDeletingStep}
          formatAmountRange={formatAmountRange}
          setIsEditMode={setIsEditMode}
          setEditingStep={setEditingStep}
          approveModalHook={approveModalHook}
        />
      )}

      <Row gutter={[8, 8]} style={{ marginTop: 12 }} justify="end">
        {!isShowStepFlow ? (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveWorkflow}
            loading={isCreateWorkflow}
          >
            Save Workflow
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Popconfirm
              title="Are you sure you want to delete this workflow?"
              onConfirm={handleDeleteWorkflow}
            >
              <Button danger icon={<DeleteOutlined />} loading={isDeletingWorkflow}>
                Delete WorkFlow
              </Button>
            </Popconfirm>

            <Button onClick={modalHook.afterClose}>Close</Button>
          </div>
        )}
      </Row>

      {/* ✅ Render ApproveModal ภายใน เพื่อรับค่าแล้ว add step */}
      {approveModalHook.isModalMounted && (
        <ApproveModal
          organizationId={form.getFieldValue('organizationId')}
          modalHook={approveModalHook}
          onSave={handleStepSaved}
          nextStepOrder={getNextStepOrder()}
          totalSteps={workflowSteps.length}
          templateId={currentTemplateId}
          editingStep={editingStep}
          isEditMode={isEditMode}
        />
      )}
    </Modal>
  )
}

export default WorkflowModal
