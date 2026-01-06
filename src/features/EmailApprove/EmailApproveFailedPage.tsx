import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button, Result } from 'antd'

const EmailApproveFailedPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get query parameters
  const documentId = searchParams.get('documentId')
  const documentType = searchParams.get('documentType')
  const routeId = searchParams.get('routeId')

  const handleGoToLogin = () => {
    // If we have the required query params, redirect to my-approvals with those params
    if (documentId && documentType && routeId) {
      const myApprovalsUrl = `/my-approvals?documentId=${documentId}&documentType=${documentType}&routeId=${routeId}`
      const returnUrl = encodeURIComponent(myApprovalsUrl)
      navigate(`/login?returnUrl=${returnUrl}`)
    } else {
      // Otherwise, just go to login (will redirect to home after login)
      navigate('/login')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Result
        status="error"
        title="Approval Action Failed"
        subTitle="The approval link is invalid, expired, or has already been used. Please try login again or contact support."
        extra={
          <Button type="primary" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        }
      />
    </div>
  )
}

export default EmailApproveFailedPage
