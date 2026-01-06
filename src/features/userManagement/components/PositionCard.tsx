import { EditOutlined } from '@ant-design/icons'
import { Button, Checkbox, Divider, Space, Typography } from 'antd'

import { PositionType } from 'api/employeeApi.types'

import ContentCard from 'components/ContentCard'

const { Text } = Typography

type PositionCardProps = {
  position: PositionType
  onEditPosition: (position: PositionType) => void
}

const PositionCard = ({ position, onEditPosition }: PositionCardProps) => {
  return (
    <div style={{ marginTop: 16 }}>
      <ContentCard
        title={position.posName}
        extra={
          <Space>
            <Button
              color="primary"
              variant="outlined"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEditPosition(position)}
            />
            {/* <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => console.log('FIXME:UM - delete position')}
            >
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm> */}
          </Space>
        }
      >
        <>
          <div style={{ display: 'flex' }}>
            <Space direction="vertical" size="small" style={{ width: '33.33%' }}>
              <Text strong>Site Code</Text>
              <Text>{position.siteCode}</Text>
            </Space>
            <Space direction="vertical" size="small" style={{ width: '33.33%' }}>
              <Text strong>Position</Text>
              <Text>{position.posName}</Text>
            </Space>
            <Space direction="vertical" size="small" style={{ width: '33.33%' }}>
              <Checkbox checked={position.permissionApprove}>Permission Approve</Checkbox>
            </Space>
          </div>

          <Divider />

          <div>
            <Text strong style={{ fontSize: '20px' }}>Organization</Text>
            <div style={{ display: 'flex', marginTop: 8 }}>
              <Space direction="vertical" size="small" style={{ width: '50%' }}>
                <Text strong>Organization Name</Text>
                <Text>{position.alternativeName}</Text>
              </Space>
              <Space direction="vertical" size="small" style={{ width: '50%' }}>
                <Text strong>Organization Code</Text>
                <Text>{position.organizationCode}</Text>
              </Space>
            </div>
          </div>

          {position.subDepartmentName && (
            <>
              <Divider />
              <div>
                <Text strong style={{ fontSize: '20px' }}>Sub Department</Text>
                <div style={{ display: 'flex', marginTop: 8 }}>
                  <Space direction="vertical" size="small" style={{ width: '50%' }}>
                    <Text strong>Sub Department Name</Text>
                    <Text>{position.subDepartmentName}</Text>
                  </Space>
                  <Space direction="vertical" size="small" style={{ width: '50%' }}>
                    <Text strong>Sub Department Code</Text>
                    <Text>{position.subDepartmentCode}</Text>
                  </Space>
                </div>
              </div>
            </>
          )}


          <Divider />

          <div>
            <Text strong style={{ fontSize: '20px' }}>Department</Text>
            <div style={{ display: 'flex', marginTop: 8 }}>
              <Space direction="vertical" size="small" style={{ width: '50%' }}>
                <Text strong>Department Name</Text>
                <Text>{position.mainDepartmentName}</Text>
              </Space>
              <Space direction="vertical" size="small" style={{ width: '50%' }}>
                <Text strong>Department Code</Text>
                <Text>{position.mainDepartmentCode}</Text>
              </Space>
            </div>
          </div>
        </>
      </ContentCard>
    </div>
  )
}

export default PositionCard
