import React from 'react'

import { Card } from 'antd'

import styles from './StatusBox.module.css'

import { ProcurementStatus } from 'api/procurementApi.types'

type StatusBoxProps = {
  number: number
  text: string
  color: 'red' | 'blue' | 'green' | 'purple' | 'yellow'
  icon: React.ReactNode
  status: ProcurementStatus
  onClick?: (status: ProcurementStatus) => void
  isActive?: boolean
}

const StatusBox: React.FC<StatusBoxProps> = ({ number, text, icon, color, status, onClick, isActive = false }) => {
  return (
    <Card
      className={`${styles.statusBox} ${styles[color]} ${isActive ? styles.active : ''}`}
      variant="borderless"
      onClick={() => {
        if (onClick) onClick(status)
      }}
      size="small"
    >
      <div className={styles.iconWrapper}>
        {React.cloneElement(icon as React.ReactElement, {
          className: styles.icon,
        })}
      </div>

      <div className={styles.content}>
        <h2 className={styles.number}>{number}</h2>
        <div className={styles.text}>{text}</div>
      </div>
    </Card>
  )
}

export default StatusBox
