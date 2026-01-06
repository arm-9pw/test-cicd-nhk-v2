import React from 'react'
import { Alert } from 'antd'
import { DelegationStatus } from 'api/delegationApi.types'

// Helper function to get alert properties based on delegation status
const getStatusAlert = (status: DelegationStatus) => {
  switch (status) {
    case 'PENDING':
      return {
        type: 'warning' as const,
        message: 'Status: Pending',
      }
    case 'ACTIVE':
      return {
        type: 'success' as const,
        message: 'Status: Active',
      }
    case 'EXPIRED':
      return {
        type: 'warning' as const,
        message: 'Status: Expired',
      }
    case 'INACTIVE':
      return {
        type: 'error' as const,
        message: 'Status: Inactive',
      }
    case 'CANCELLED':
      return {
        type: 'error' as const,
        message: 'Status: Cancelled',
      }
    default:
      return {
        type: 'info' as const,
        message: 'Status: Unknown',
      }
  }
}

interface DelegationStatusAlertProps {
  status: DelegationStatus
}

const DelegationStatusAlert: React.FC<DelegationStatusAlertProps> = ({ status }) => {
  const alertProps = getStatusAlert(status)
  
  return (
    <Alert
      type={alertProps.type}
      message={alertProps.message}
      showIcon
      style={{ marginBottom: 16 }}
    />
  )
}

export default DelegationStatusAlert
