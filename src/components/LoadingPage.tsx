import { SyncOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

type LoadingPageProps = {
  message?: string
}

const LoadingPage = ({ message = 'Loading...' }: LoadingPageProps) => {
  return (
    <Spin
      fullscreen
      tip={message}
      spinning={true}
      percent="auto"
      size="large"
      indicator={<SyncOutlined spin />}
    />
  )
}

export default LoadingPage
