import React from 'react'

import { InboxOutlined } from '@ant-design/icons'
import { List, Tag, Typography } from 'antd'

import style from './styles.module.css'

import { ApprovalQueueItem } from 'api/approvalApi.types'

import { BCS_STATUS } from 'constants/index'
import { formatUTCToBangkokDisplayDateTime } from 'utils/dateHelpers'
import { formatNumber } from 'utils/generalHelpers'

const { Text } = Typography

interface ApprovalListCardProps {
  dataSource: ApprovalQueueItem[]
  emptyText?: string
  onItemClick?: (item: ApprovalQueueItem) => void
}

// Helper function for status display
const getStatusDisplay = (
  stepStatus: ApprovalQueueItem['stepStatus'],
  isRead?: boolean,
): { text: string; color: string } => {
  // Check for read status if ASSIGNED
  if (stepStatus === 'ASSIGNED' && isRead) {
    return { text: 'Read', color: 'default' }
  }

  switch (stepStatus) {
    // NOTE: No need for pending status, it won't show up.
    // case 'PENDING':
    //   return { text: 'Pending', color: 'default' }
    case 'ASSIGNED':
      return { text: 'New', color: 'orange' }
    case 'APPROVED':
      return { text: 'Approved', color: 'green' }
    case 'REJECTED':
      return { text: 'Rejected', color: 'red' }
    case 'CANCELLED':
      return { text: 'Cancelled', color: 'default' }
    default:
      return { text: 'New', color: 'orange' }
  }
}

const ApprovalListCard: React.FC<ApprovalListCardProps> = ({
  dataSource,
  emptyText = 'No pending approvals found',
  onItemClick,
}) => {
  return (
    <List
      itemLayout="vertical"
      className={style['approval-list']}
      dataSource={dataSource}
      locale={{
        emptyText,
      }}
      renderItem={(item) => {
        // Determine status class: if ASSIGNED and isRead, use 'read' class, otherwise use stepStatus
        const statusClass =
          item.stepStatus === 'ASSIGNED' && item.isRead ? 'read' : item.stepStatus.toLowerCase()
        const statusDisplay = getStatusDisplay(item.stepStatus, item.isRead)

        return (
          <List.Item
            onClick={() => onItemClick?.(item)}
            className={`${style['item-card']} ${style[statusClass]}`}
          >
            <List.Item.Meta
              avatar={
                <div className={style['avatar-container']}>
                  <InboxOutlined className={`${style['icon']} ${style[statusClass]}`} />
                </div>
              }
              title={
                <div className={style['title-container']}>
                  <div>
                    <Text strong className={style['document-number']}>
                      {item.documentNumber}
                    </Text>
                    {' - '}
                    <Text className={style['requester-info']}>
                      {[item.requesterName, item.requesterDepartment, item.requesterSite]
                        .filter(Boolean)
                        .join('/')}
                    </Text>
                  </div>
                  <div className={style['right-section']}>
                    <Tag color={statusDisplay.color} className={style['status-tag']}>
                      {statusDisplay.text}
                    </Tag>
                    <Text type="secondary" className={style['date-text']}>
                      {formatUTCToBangkokDisplayDateTime(item.assignedAt, 'DD/MMM/YYYY HH:mm')}
                    </Text>
                  </div>
                </div>
              }
              description={
                <div className={style['description-box']}>
                  <Text className={style['description-text']}>Job Name: {item.title}</Text>
                  <Text className={style['description-text']}>Budget Code: {item.budgetCode}</Text>

                  <div className={style['amount-container']}>
                    <Text strong className={style['amount-text']}>
                      Grand Total: {formatNumber(item.totalAmount)} {item.currency}
                    </Text>
                    {item.isOverBudget ? (
                      <Text
                        className={`${style['budget-status-container']} ${style['over-budget']}`}
                      >
                        {BCS_STATUS.OVER_BUDGET}
                      </Text>
                    ) : (
                      <Text className={style['budget-status-container']}>
                        {BCS_STATUS.NOT_OVER_BUDGET}
                      </Text>
                    )}
                    {/* {item.reminder && (
                    <div className={style['reminder-container']}>
                      <Text className={style['reminder-text']}>
                        {item.reminder}
                      </Text>
                    </div>
                  )} */}
                  </div>
                </div>
              }
            />
          </List.Item>
        )
      }}
    />
  )
}

export default ApprovalListCard
