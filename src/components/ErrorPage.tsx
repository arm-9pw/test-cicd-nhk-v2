import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom'

import { Button, Col, Result, Row } from 'antd'
import { ResultStatusType } from 'antd/es/result'

type TErrorPageProps = {
  status?: ResultStatusType
  title?: string
  errorMsg?: string
}

export default function ErrorPage({
  status = '404' as ResultStatusType,
  title = '404',
  errorMsg = '',
}: TErrorPageProps) {
  const navigate = useNavigate()
  const error = useRouteError()

  let errorMessage: string

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.data || error.statusText
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    console.error(error)
    errorMessage = 'Unknown error'
  }

  return (
    <Row justify="center" align="middle">
      <Col>
        <Result
          status={status}
          title={title}
          subTitle={errorMsg || errorMessage}
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Back Home
            </Button>
          }
        />
      </Col>
    </Row>
  )
}
