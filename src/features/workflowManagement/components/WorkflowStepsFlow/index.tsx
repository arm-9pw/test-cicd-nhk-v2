import React from 'react'

import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Divider, Popconfirm, Space, Tooltip } from 'antd'

import styles from './workflowModal.module.css'

import { WorkflowStepType } from 'api/workflowManangement.types'

interface WorkflowStepsFlowProps {
  isShowStepFlow: boolean
  workflowType: string | undefined
  workflowSteps: WorkflowStepType[]
  lastIndex: number
  handleEditStep: (step: WorkflowStepType) => void
  handleDeleteLast: () => void
  isDeletingStep: boolean
  formatAmountRange: (minAmount: number, maxAmount: number | null) => string
  setIsEditMode: (isEditMode: boolean) => void
  setEditingStep: (editingStep: WorkflowStepType | null) => void
  approveModalHook: {
    showModal: () => void
  }
}

const WorkflowStepsFlow: React.FC<WorkflowStepsFlowProps> = ({
  isShowStepFlow,
  workflowType,
  workflowSteps,
  lastIndex,
  handleEditStep,
  handleDeleteLast,
  isDeletingStep,
  formatAmountRange,
  setIsEditMode,
  setEditingStep,
  approveModalHook,
}) => {
  return (
    <>
      {isShowStepFlow && (
        <>
          <Divider>{workflowType || 'Unknown'}. Flow</Divider>
          <div className={styles.stepsMainContainer}>
            {workflowSteps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={styles.stepCardContainer}>
                  <div className={styles.stepAvatarWrapper}>
                    <Avatar className={styles.stepAvatar} size={90} icon={<UserOutlined />} />
                  </div>

                  <div className={styles.stepPositionName}>{step.positionName}</div>

                  <div className={styles.stepApproverName}>
                    {step.approverName && (
                      <>
                        <UserOutlined style={{ marginRight: 4 }} />
                        {step.approverName}
                      </>
                    )}
                  </div>
                  <div className={styles.stepAmountText}>
                    Limit: {formatAmountRange(step.minAmount, step.maxAmount)}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <Space>
                      <Tooltip title="Edit">
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditStep(step)}
                        />
                      </Tooltip>

                      {/* ลบได้เฉพาะสเต็ปสุดท้าย */}
                      {index === lastIndex && workflowSteps.length > 0 && (
                        <Tooltip title="Delete (last step only)">
                          <Popconfirm
                            title="Are you sure you want to delete this approver step?"
                            onConfirm={handleDeleteLast}
                          >
                            <Button
                              size="small"
                              icon={<DeleteOutlined />}
                              danger
                              loading={isDeletingStep}
                            />
                          </Popconfirm>
                        </Tooltip>
                      )}
                    </Space>
                  </div>
                </div>

                {index < workflowSteps.length - 1 && (
                  <ArrowRightOutlined className={styles.stepArrowIcon} />
                )}
              </div>
            ))}

            {/* ปุ่ม Add วงกลมใหญ่ */}
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              type="dashed"
              style={{ width: 100, height: 100 }}
              onClick={() => {
                setIsEditMode(false)
                setEditingStep(null)
                approveModalHook.showModal()
              }}
            />
          </div>
        </>
      )}
    </>
  )
}

export default WorkflowStepsFlow
