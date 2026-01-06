import { useEffect, useState } from 'react'

import { EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Divider, Form, InputNumber, Modal } from 'antd'

import {
  useCreateApproveStepMutation,
  useUpdateWorkflowStepMutation,
} from 'api/workflowManagementApi'
import {
  ApproverPositionType,
  CreateStepRequest,
  EmployeeApproverType,
  WorkflowStepType,
} from 'api/workflowManangement.types'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import HeaderTitle from 'components/HeaderTitle'

import ApproverNameDropdown from '../Dropdown/ApproverNameDropdown'
import PositionDropdown from '../Dropdown/PositionDropdown'

type Props = {
  modalHook: ReturnType<typeof useCustomModal>
  onSave: (step: WorkflowStepType) => void
  editingStep?: WorkflowStepType | null
  isEditMode?: boolean
  organizationId?: string | null
  templateId?: string | null
  nextStepOrder?: number
  totalSteps: number | null
}

const ApproveModal = ({
  modalHook,
  onSave,
  editingStep,
  isEditMode,
  organizationId,
  templateId,
  nextStepOrder = 1,
}: Props) => {
  const [createApproveStep, { isLoading: isCreatingStep }] = useCreateApproveStepMutation()
  const [updateWorkflowStep, { isLoading: isUpdatingStep }] = useUpdateWorkflowStepMutation()
  const { openNotification } = useNotification()

  const isLoading = isCreatingStep || isUpdatingStep

  const [formAddStep] = Form.useForm()
  const positionId = Form.useWatch('positionId', formAddStep)

  const [selectedPosition, setSelectedPosition] = useState<ApproverPositionType | null>(null)
  const [selectedApprover, setSelectedApprover] = useState<EmployeeApproverType | null>(null)

  // Number formatter functions
  const numberFormatter = (value: string | number | undefined): string => {
    if (!value) return ''
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handlePositionChange = (position: ApproverPositionType | null) => {
    setSelectedPosition(position)

    if (position) {
      formAddStep.setFieldsValue({
        positionId: position.id, // เก็บ position id
        minAmount: position.approvalLimitStart,
        maxAmount: position.approvalLimit,
      })

      // Reset selected approver
      setSelectedApprover(null)
    } else {
      formAddStep.setFieldsValue({
        positionId: undefined,
        minAmount: undefined,
        maxAmount: undefined,
        approverId: undefined,
      })
      setSelectedApprover(null)
    }
  }

  const handleApproverChange = (approverData: EmployeeApproverType | null) => {
    setSelectedApprover(approverData)
    formAddStep.setFieldsValue({
      approverId: approverData?.employeeId ?? undefined,
    })
  }

  useEffect(() => {
    if (isEditMode && editingStep) {
      formAddStep.setFieldsValue({
        positionId: editingStep.positionId,
        approverId: editingStep.approverId,
        minAmount: editingStep.minAmount,
        maxAmount: editingStep.maxAmount,
      })
      setSelectedPosition({
        id: editingStep.positionId,
        posCode: editingStep.positionCode,
        posName: editingStep.positionName,
      })
      setSelectedApprover({
        employeeName: editingStep.approverName ?? '',
        sectionId: editingStep.approverSectionId ?? '',
        sectionName: editingStep.approverSectionName ?? '',
        email: editingStep.approverEmail ?? '',
        siteCode: editingStep.approverSiteCode ?? '',
      })
    } else {
      formAddStep.resetFields()
      setSelectedPosition(null)
      setSelectedApprover(null)
    }
  }, [isEditMode, editingStep, formAddStep])

  const handleCancel = () => {
    formAddStep.resetFields()
    setSelectedPosition(null)
    setSelectedApprover(null)
    modalHook.handleCancel()
  }

  const handleSave = async () => {
    if (!templateId) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Please create workflow template first',
      })
      return
    }

    if (!selectedPosition) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Please select position',
      })
      return
    }

    try {
      const values = await formAddStep.validateFields()
      // const noApprover = !values.approverId

      const stepData: CreateStepRequest = {
        templateId: templateId,
        stepOrder: isEditMode ? editingStep!.stepOrder : nextStepOrder,
        positionId: values.positionId,
        positionCode: selectedPosition.posCode,
        positionName: selectedPosition.posName,
        minAmount: values.minAmount,
        maxAmount: values.maxAmount,
        approverId: values.approverId,
        approverName: selectedApprover?.employeeName || null,
        approverSectionId: selectedApprover?.sectionId || null,
        approverSectionName: selectedApprover?.sectionName || null,
        approverEmail: selectedApprover?.email || null,
        approverSiteCode: selectedApprover?.siteCode || null,
        isFinalApprover: false,
        // slaHours: 24,
        // escalationHours: 48,
        // isOptional: false,
      }

      let result: WorkflowStepType

      if (isEditMode && editingStep) {
        result = await updateWorkflowStep({
          stepId: editingStep.id,
          ...stepData,
        }).unwrap()

        openNotification({
          type: 'success',
          title: 'Step Updated',
          description: 'Workflow step updated successfully',
        })
      } else {
        result = await createApproveStep(stepData).unwrap()

        openNotification({
          type: 'success',
          title: 'Step Created',
          description: 'Workflow step created successfully',
        })
      }

      onSave(result)

      formAddStep.resetFields()
      setSelectedPosition(null)
      setSelectedApprover(null)
      modalHook.handleCancel()
    } catch (error) {
      console.error('❌ Error saving step:', error)

      openNotification({
        type: 'error',
        title: isEditMode ? 'Error Updating Step' : 'Error Creating Step',
        description: 'An error occurred while saving the workflow step. Please try again.',
      })
    }
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          {isEditMode ? (
            <HeaderTitle title="Edit Approver Step" titlePreIcon={<EditOutlined />} />
          ) : (
            <HeaderTitle title="Add Approver Step" titlePreIcon={<PlusOutlined />} />
          )}
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      afterClose={modalHook.afterClose}
    >
      <Form form={formAddStep} layout="vertical">
        <Form.Item
          name="positionId"
          label="Position Name"
          rules={[{ required: true, message: 'Please select position' }]}
        >
          <PositionDropdown placeholder="Select Position" onPositionChange={handlePositionChange} />
        </Form.Item>

        <Form.Item name="approverId" label="Approver Name">
          <ApproverNameDropdown
            organizationId={organizationId}
            positionId={positionId || editingStep?.positionId} // ✅ fallback
            value={selectedApprover?.employeeId || editingStep?.approverId || null} // ✅ fallback
            placeholder="Select Approver Name"
            onChange={handleApproverChange}
          />
        </Form.Item>

        <Form.Item
          name="minAmount"
          label="Min Approve Amount"
          rules={[{ required: true, message: 'Please enter min amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={2}
            formatter={numberFormatter}
            placeholder="0"
          />
        </Form.Item>

        <Form.Item
          name="maxAmount"
          label="Max Approve Amount"
          rules={[{ required: true, message: 'Please enter max amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={2}
            formatter={numberFormatter}
            placeholder="0"
          />
        </Form.Item>
      </Form>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 16 }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button icon={<SaveOutlined />} type="primary" onClick={handleSave} loading={isLoading}>
          {isEditMode ? 'Update Step' : 'Add Step'}
        </Button>
      </div>
    </Modal>
  )
}

export default ApproveModal
