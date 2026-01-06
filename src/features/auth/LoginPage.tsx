import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Alert, Button, Col, Row, Spin } from 'antd'

import styles from './LoginPage.module.css'
import nhkLogo from 'assets/images/nhk-logo.png'

import { useGetUserInfoQuery } from 'api/authApi'
import { useAppSelector } from 'app/hook'
import useAuth from 'hooks/useAuth'

import { responsiveLayout } from 'constants/index'

import { selectUser } from './authSlice'

const Login = () => {
  const { login, isAuthenticated, isInitialized } = useAuth()
  const { isLoading } = useGetUserInfoQuery(undefined, {
    skip: !isAuthenticated || !isInitialized,
  })
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const [searchParams] = useSearchParams()

  // Get the return URL from query parameters
  const returnUrl = searchParams.get('returnUrl')

  // Get complete URL information
  // const fullUrl = window.location.href
  // const origin = window.location.origin
  // const pathname = window.location.pathname
  // const search = window.location.search
  // const hash = window.location.hash

  // console.log('Complete URL:', fullUrl)
  // console.log('Origin:', origin)
  // console.log('Pathname:', pathname)
  // console.log('Search params:', search)
  // console.log('Hash:', hash)

  // NOTE: ADMIN LOGIN LINK FOR UAT: https://epurth-uat.nhkspg.co.th/login?q=A7f9K2LmP3bT6Q
  // const isOriginContainUAT = window.location.origin.includes('epurth-uat.nhkspg.co.th')
  // const isSpecialUATLoginPath = window.location.search === '?q=A7f9K2LmP3bT6Q'

  // const isHideLoginButton = isOriginContainUAT && !isSpecialUATLoginPath
  const isHideLoginButton = false

  const onLogin = async () => {
    try {
      // Pass the full URL (including returnUrl) as redirectUri to Keycloak
      // This ensures we come back to the login page with the returnUrl preserved
      const currentUrl = window.location.href
      await login(currentUrl)
    } catch (error) {
      console.error('Failed:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      // If there's a returnUrl, navigate to it; otherwise go to home
      if (returnUrl && returnUrl !== '/login') {
        navigate(returnUrl, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate, returnUrl])

  return (
    <>
      <div className={styles['login-page']}>
        <Row justify="center" align="middle" style={{ height: '95vh' }}>
          <Col {...responsiveLayout} xs={22} className={styles['login-box']}>
            <Spin spinning={!!user || isLoading} tip="กำลังเข้าสู่ระบบ...">
              <Row gutter={[16, 16]} justify="center" align="middle">
                <Col span={24}>
                  <img src={nhkLogo} alt="NHK" height={60} style={{ margin: '0 auto' }} />
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                  {isHideLoginButton ? (
                    <>
                      <Alert
                        message="ระบบทดสอบการใช้งาน"
                        description="This is a User Acceptance Testing environment."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    </>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => onLogin()}
                      style={{ maxWidth: 250, width: '100%' }}
                    >
                      Login
                    </Button>
                  )}
                </Col>
              </Row>
            </Spin>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Login
