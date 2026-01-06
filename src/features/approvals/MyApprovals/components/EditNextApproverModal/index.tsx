import React from 'react'

import { EditOutlined } from '@ant-design/icons'
import { Divider, Modal } from 'antd'

import styles from './styles.module.css'

import { ApprovalRouteResponse } from 'api/approvalApi.types'
import useCustomModal from 'hooks/useCustomModal'

import ApproverSteps from 'components/ApproverSteps'
import HeaderTitle from 'components/HeaderTitle'

interface EditNextApproverModalProps {
  modalHook: ReturnType<typeof useCustomModal>
  approvalRoute?: ApprovalRouteResponse
}

const EditNextApproverModal: React.FC<EditNextApproverModalProps> = ({
  modalHook,
  approvalRoute,
}) => {
  return (
    <Modal
      title={
        <>
          <HeaderTitle
            title="แก้ไขผู้อนุมัติคนถัดไป / Edit Next Approver"
            titlePreIcon={<EditOutlined />}
          />
          <Divider style={{ margin: 16 }} />
        </>
      }
      open={modalHook.isModalVisible}
      onCancel={modalHook.handleCancel}
      footer={null}
      width="80%"
      destroyOnClose
      className={styles['edit-approver-modal']}
    >
      <div className={styles['modal-content']}>
        <ApproverSteps canEditNextApprover approvalRoute={approvalRoute} />
      </div>
    </Modal>
  )
}

export default EditNextApproverModal
