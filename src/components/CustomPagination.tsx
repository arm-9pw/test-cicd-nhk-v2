import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'

type Props = {
  currentPage: number
  disabledPrevious: boolean
  disabledNext: boolean
  handleNextPage: () => void
  handlePrevPage: () => void
}

const CustomPagination = ({
  handleNextPage,
  handlePrevPage,
  currentPage,
  disabledPrevious,
  disabledNext,
}: Props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        size="small"
        icon={<LeftOutlined />}
        onClick={handlePrevPage}
        disabled={disabledPrevious}
      />
      <div style={{ margin: '0 8px' }}>{currentPage}</div>
      <Button
        size="small"
        icon={<RightOutlined />}
        onClick={handleNextPage}
        disabled={disabledNext}
      />
    </div>
  )
}

export default CustomPagination
