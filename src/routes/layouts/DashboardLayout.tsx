import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

// import { BellOutlined } from '@ant-design/icons'
// import { Badge, Col, Divider, Layout, Popover, Row } from 'antd'
import { Col, Layout, Row } from 'antd'

import styles from './DashboardLayout.module.css'
import nhkLogo from 'assets/images/nhk-logo.png'

import { useCertificateStatus } from 'hooks/useCertificateStatus'
import useCustomModal from 'hooks/useCustomModal'

import Account from 'components/Account'
import CertificateExpiredModal from 'components/CertificateExpiredModal'
import CertificateManagementModal, {
  CertificateModalMode,
} from 'components/CertificateManagementModal'
import CertificateWarningBanner from 'components/CertificateWarningBanner'
import ErrorModal from 'components/ErrorModal'
import GlobalLoading from 'components/GlobalLoading'
import SideMenu from 'components/SideMenu'

import { gutter } from 'constants/index'

const { Header, Content } = Layout

const DashboardLayout: React.FC = () => {
  // const content = (
  //   <div>
  //     <p>Notification 1</p>
  //     <p>Notification 2</p>
  //     <p>Notification 3</p>
  //   </div>
  // )
  const isOriginContainUAT = window.location.origin.includes('epurth-uat.nhkspg.co.th')

  // Certificate status and modals
  const { isExpired, isExpiring, hasCertificate, message, status } = useCertificateStatus()
  const [hasShownExpiredModal, setHasShownExpiredModal] = useState(false)

  // Expired modal
  const expiredModal = useCustomModal()

  // Management modal (for regenerate action)
  const managementModal = useCustomModal()
  const [managementModalMode, setManagementModalMode] = useState<CertificateModalMode>('regenerate')

  // Show modal on initial load if certificate is expired OR user has no certificate
  // Only show when status has been loaded (status !== null)
  const shouldShowModal = status !== null && (!hasCertificate || isExpired)

  useEffect(() => {
    if (shouldShowModal && !hasShownExpiredModal) {
      expiredModal.showModal()
      setHasShownExpiredModal(true)
    }
  }, [shouldShowModal, hasShownExpiredModal, expiredModal])

  const handleRenewClick = () => {
    setManagementModalMode('regenerate')
    managementModal.showModal()
  }

  const handleRegenerateFromExpiredModal = () => {
    setManagementModalMode('regenerate')
    managementModal.showModal()
  }

  return (
    <Layout style={{ width: '100vw', minHeight: '100vh' }}>
      <Header className={styles['header']}>
        <img src={nhkLogo} alt="NHK" width={75.6} />

        {isOriginContainUAT && (
          <h1 style={{ color: 'red', marginTop: 0 }}>ระบบทดสอบการให้งาน (UAT)</h1>
        )}

        <Row gutter={gutter} align="middle" justify="space-evenly">
          {/* // ซ่อน Icon Bell */}
          {/* <Col>
            <Popover placement="bottomLeft" title={'Notification/แจ้งเตือน'} content={content} arrow={false}>
              <Badge count={3} style={{ cursor: 'pointer' }}>
                <BellOutlined style={{ fontSize: '1.3rem', padding: 2, cursor: 'pointer' }} />
              </Badge>
            </Popover>
          </Col> */}
          {/* <Col>
            <Divider type="vertical" style={{ height: '1.7em' }} />
          </Col> */}

          <Col>
            <Account />
          </Col>
        </Row>
      </Header>
      <Layout>
        <SideMenu />
        <Layout style={{ padding: '0 32px 32px', maxWidth: '1280px', margin: '0 auto' }}>
          {/* Certificate Warning Banner */}
          {isExpiring && <CertificateWarningBanner onRenewClick={handleRenewClick} />}

          <Row gutter={gutter}>
            <Col span={24}>
              <Content>
                <Outlet />
              </Content>
            </Col>
          </Row>
        </Layout>
      </Layout>

      {/* Certificate Expired Modal */}
      {expiredModal.isModalMounted && (
        <CertificateExpiredModal
          isOpen={expiredModal.isModalVisible}
          onClose={expiredModal.handleCancel}
          afterClose={expiredModal.afterClose}
          onRegenerateClick={handleRegenerateFromExpiredModal}
          hasCertificate={hasCertificate}
          message={message}
        />
      )}

      {/* Certificate Management Modal */}
      {managementModal.isModalMounted && (
        <CertificateManagementModal
          isOpen={managementModal.isModalVisible}
          onClose={managementModal.handleCancel}
          afterClose={managementModal.afterClose}
          mode={managementModalMode}
        />
      )}

      <ErrorModal />
      <GlobalLoading />
    </Layout>
  )
}

export default DashboardLayout
