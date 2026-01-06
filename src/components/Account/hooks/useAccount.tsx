import { useCallback, useState } from 'react'

import { CheckOutlined, LogoutOutlined, MailOutlined } from '@ant-design/icons'
import { MenuProps, Modal } from 'antd'

import { clrGreen400 } from 'styles/theme'

import { useUpdateUserCurrentPositionMutation } from 'api/authApi'
import useAuth from 'hooks/useAuth'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import { getLandingPagePath } from 'utils/getLandingPagePath'

import { CertificateModalMode } from 'components/CertificateManagementModal'

type UseAccountReturnType = {
  items: MenuProps['items']
  handleMenuClick: (key: string) => void
  certificateModal: ReturnType<typeof useCustomModal>
  certificateModalMode: CertificateModalMode
}

const useAccount = (): UseAccountReturnType => {
  const { logout, user } = useAuth()
  const { openNotification } = useNotification()
  const [updateUserCurrentPosition] = useUpdateUserCurrentPositionMutation()

  // Certificate modal state for Forgot Passcode
  const certificateModal = useCustomModal()
  const [certificateModalMode, setCertificateModalMode] = useState<CertificateModalMode>('forgot')

  const handleForgotPasscode = useCallback(() => {
    setCertificateModalMode('forgot')
    certificateModal.showModal()
  }, [certificateModal])

  const getItems = () => {
    // Position items (if user has positions)
    const positionItems: MenuProps['items'] = user?.positions?.length
      ? user.positions.map((position) => {
          const isCurrentPosition =
            position.positionId === user.currentPositionId &&
            position.organizationId === user.currentOrganizationId

          return {
            label: (
              <>
                <div style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {position.organizationName}
                  {isCurrentPosition && (
                    <CheckOutlined style={{ color: clrGreen400, fontSize: '1.1rem' }} />
                  )}
                </div>
                <div style={{ fontSize: '0.8rem' }}>[{position.posName}]</div>
              </>
            ),
            key: position.organizationId + '-' + position.positionId,
          }
        })
      : []

    // Forgot Passcode item (above logout)
    const forgotPasscodeItem: MenuProps['items'] = [
      {
        type: 'divider',
      },
      {
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MailOutlined />
            <span>Forgot Passcode</span>
          </div>
        ),
        key: 'forgot-passcode',
      },
    ]

    // Logout item (always at bottom)
    const logoutItem: MenuProps['items'] = [
      {
        type: 'divider',
      },
      {
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoutOutlined />
            <span>Log Out</span>
          </div>
        ),
        key: 'logout',
      },
    ]

    return [...positionItems, ...forgotPasscodeItem, ...logoutItem]
  }

  const onLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      okText: 'Log Out',
      cancelText: 'Cancel',
      onOk: async () => {
        await logout()
      },
    })
  }

  const handleChangeUserPosition = async (positionKey: string) => {
    try {
      const [organizationId, positionId] = positionKey.split('-')

      const data = await updateUserCurrentPosition({
        positionId,
        organizationId,
      }).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Position changed successfully. Redirecting...',
      })

      const landingPagePath = getLandingPagePath(data.currentLandingPageCode) || '/'

      // Full page refresh after a short delay to show the success message
      setTimeout(() => {
        window.location.href = landingPagePath
      }, 1000)
    } catch (error) {
      console.error('Error updating user position:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to change position. Please try again.',
      })
    }
  }

  const handleMenuClick = (key: string) => {
    if (key === 'logout') onLogout()
    else if (key === 'forgot-passcode') handleForgotPasscode()
    else handleChangeUserPosition(key)
  }

  return {
    items: getItems(),
    handleMenuClick,
    certificateModal,
    certificateModalMode,
  }
}

export default useAccount