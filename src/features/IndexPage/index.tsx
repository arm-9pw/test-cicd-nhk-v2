import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Col, Layout, Row, Typography } from 'antd'

import { useGetUserInfoQuery } from 'api/authApi'
import useAuth from 'hooks/useAuth'

import { getLandingPagePath } from 'utils/getLandingPagePath'

const IndexPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isInitialized, user } = useAuth()
  const { isLoading } = useGetUserInfoQuery(undefined, {
    skip: !isAuthenticated || !isInitialized,
  })
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && user?.currentLandingPageCode) {
      setIsRedirecting(true)
      const landingPagePath = getLandingPagePath(user.currentLandingPageCode)

      const redirectTimer = setTimeout(() => {
        navigate(landingPagePath)
      }, 1500)

      return () => clearTimeout(redirectTimer)
    }
  }, [isLoading, user, navigate])

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'var(--clr-neutral-light)',
        fontFamily: 'var(--ff-serif)',
      }}
    >
      <Row justify="center" style={{ minHeight: '100vh' }}>
        <Col>
          <Typography.Title
            level={2}
            style={{
              color: 'var(--clr-primary)',
              fontFamily: 'var(--ff-serif)',
              textAlign: 'center',
              marginBottom: 0,
            }}
          >
            Welcome to NHK Purchase System
          </Typography.Title>
          {isLoading ? (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <LoadingOutlined
                spin
                style={{ color: 'var(--clr-blue)', fontSize: 20, marginRight: 8 }}
              />
              <Typography.Text
                style={{
                  color: 'var(--fc-caption)',
                  fontSize: 18,
                  fontFamily: 'var(--ff-serif)',
                }}
              >
                Loading user information, please wait...
              </Typography.Text>
            </div>
          ) : isRedirecting ? (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <LoadingOutlined
                spin
                style={{ color: 'var(--clr-blue)', fontSize: 20, marginRight: 8 }}
              />
              <Typography.Text
                style={{
                  color: 'var(--fc-caption)',
                  fontSize: 18,
                  fontFamily: 'var(--ff-serif)',
                }}
              >
                Redirecting to your page...
              </Typography.Text>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <InfoCircleOutlined
                style={{ color: 'var(--clr-blue)', fontSize: 20, marginRight: 8 }}
              />
              <Typography.Text
                style={{
                  color: 'var(--fc-caption)',
                  fontSize: 18,
                  fontFamily: 'var(--ff-serif)',
                }}
              >
                Please select a menu
              </Typography.Text>
            </div>
          )}
        </Col>
      </Row>
    </Layout>
  )
}

export default IndexPage
