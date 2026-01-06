import { Col, Row, Skeleton } from 'antd'

const size = 'large'
const block = true

type BcsSkeletonLoadingProps = {
  active?: boolean
}

const BcsSkeletonLoading = ({ active = true }: BcsSkeletonLoadingProps) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Skeleton.Input
          active={active}
          size={size}
          block={block}
          style={{ height: '80px' }}
        />
      </Col>
      <Col span={24}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={8}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
      <Col span={16}>
        <Skeleton.Input active={active} size={size} block={block} />
      </Col>
    </Row>
  )
}

export default BcsSkeletonLoading
