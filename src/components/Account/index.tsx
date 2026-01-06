import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Typography } from 'antd'

import MockAvatar from 'assets/images/mock-avatar.jpg'

import { useAppSelector } from 'app/hook'

import CertificateManagementModal from 'components/CertificateManagementModal'

import { selectUser } from 'features/auth/authSlice'

import useAccount from './hooks/useAccount'

const { Text } = Typography

const Account = () => {
  const { items, handleMenuClick, certificateModal, certificateModalMode } = useAccount()
  const user = useAppSelector(selectUser)

  return (
    <>
      <Dropdown
        menu={{
          items,
          onClick: ({ key }) => handleMenuClick(key),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 40,
            cursor: 'pointer',
          }}
        >
          <div style={{ marginRight: 8, marginBottom: 4 }}>
            <Avatar icon={<UserOutlined />} src={MockAvatar} />
          </div>
          <div style={{ lineHeight: 1, marginRight: 8 }}>
            <Text style={{ display: 'block' }}>{user?.fullNameEn}</Text>
            <Text style={{ fontSize: 12 }} type="secondary">
              {user?.currentSiteCode + ' - '}
            </Text>
            <Text style={{ fontSize: 12 }} type="secondary">
              {user?.currentOrganizationName}
            </Text>
          </div>
          <DownOutlined />
        </div>
      </Dropdown>

      {/* Certificate Management Modal */}
      {certificateModal.isModalMounted && (
        <CertificateManagementModal
          isOpen={certificateModal.isModalVisible}
          onClose={certificateModal.handleCancel}
          afterClose={certificateModal.afterClose}
          mode={certificateModalMode}
        />
      )}
    </>
  )
}

export default Account