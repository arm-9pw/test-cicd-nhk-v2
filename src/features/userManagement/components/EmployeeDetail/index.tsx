import { CloseOutlined, PlusOutlined, UserOutlined, EditOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Divider, Empty, Result, Row, Space, Spin, Typography } from 'antd'

import { EmployeeUserType, PositionType } from 'api/employeeApi.types'
import useCustomModal from 'hooks/useCustomModal'

import PositionCard from '../PositionCard'
import CreateEmployeeModal from '../CreateEmployee/components/CreateEmployeeModal'
import useEmployeeDetail from './hooks/useEmployeeDetail'

const { Title, Text } = Typography

type Props = {
  hideDetail: () => void
  selectedEmployee: EmployeeUserType
  onEditPosition: (position: PositionType) => void
  onAddPosition: () => void
}

const EmployeeDetail = ({ hideDetail, selectedEmployee, onEditPosition, onAddPosition }: Props) => {
  const { localEmployeeDetail, isLoading, error } = useEmployeeDetail({
    selectedEmployee
  })

  // Edit User Modal state
  const editUserModal = useCustomModal()
  const openEditUserModal = () => editUserModal.showModal()
  const closeEditUserModal = () => editUserModal.handleCancel()

  if (isLoading || !localEmployeeDetail) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <Result
        style={{ marginTop: '30vh' }}
        status="error"
        title="Failed to load employee details"
        subTitle="Please try again later."
        extra={
          <Button type="primary" onClick={hideDetail}>
            Close
          </Button>
        }
      />
    )
  }

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="large"
            icon={<CloseOutlined />}
            color="default"
            variant="text"
            onClick={hideDetail}
          />
        </div>
        {/* ------------ BEGIN: Content ------------ */}
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1000px',
            padding: '16px',
          }}
        >
          {/* ------------ BEGIN: Avatar ------------ */}
          <Space size="large">
            <Avatar
              size={{ xs: 40, sm: 50, md: 80, lg: 80, xl: 100, xxl: 120 }}
              icon={<UserOutlined />}
            />
            <Space direction="vertical" size="small">
              <Title level={5} style={{ marginTop: 0 }}>
                {localEmployeeDetail.userName}
              </Title>
              <Text type="secondary">{localEmployeeDetail.email}</Text>
            </Space>
          </Space>
          <Divider />
          {/* ------------ END: Avatar ------------ */}

          {/* ------------ BEGIN: User Profile Section ------------ */}
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                User Profile / ข้อมูลผู้ใช้
              </Title>
            </Col>
            <Col>
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={openEditUserModal}
              >
                Edit Profile
              </Button>
            </Col>
          </Row>

          <div style={{ marginBottom: 16, overflow: 'auto' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ minWidth: '250px', marginRight: 16 }}>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <Text strong style={{ marginRight: 8 }}>Prefix EN:</Text>
                  <Text>{localEmployeeDetail.prefixEn}</Text>
                </div>
              </div>
              <div style={{ minWidth: 300, marginLeft: 32 }}>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <Text strong style={{ marginRight: 8 }}>Name EN:</Text>
                  <Text>{`${localEmployeeDetail.firstNameEn} ${localEmployeeDetail.lastNameEn}`}</Text>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ minWidth: '250px', marginRight: 16 }}>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <Text strong style={{ marginRight: 8 }}>Prefix TH:</Text>
                  <Text>{localEmployeeDetail.prefixTh}</Text>
                </div>
              </div>
              <div style={{ minWidth: 300, marginLeft: 32 }}>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <Text strong style={{ marginRight: 8 }}>Name TH:</Text>
                  <Text>{`${localEmployeeDetail.firstNameTh} ${localEmployeeDetail.lastNameTh}`}</Text>
                </div>
              </div>
            </div>
            {localEmployeeDetail.telephone && (
              <div style={{ display: 'flex' }}>
                <div style={{ minWidth: '250px', marginRight: 16 }}>
                  <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                    <Text strong style={{ marginRight: 8 }}>Telephone:</Text>
                    <Text>{localEmployeeDetail.telephone}</Text>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Divider />
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                Positions / ตำแหน่งงาน
              </Title>
            </Col>
            <Col>
              <Button icon={<PlusOutlined />} type="primary" onClick={onAddPosition}>
                Add Position
              </Button>
            </Col>
          </Row>
          <div style={{ maxHeight: '450px', overflow: 'auto' }}>
            {localEmployeeDetail && localEmployeeDetail?.positions.length === 0 ? (
              <>
                <Empty description="No position found" />
              </>
            ) : (
              localEmployeeDetail.positions.map((position) => (
                <PositionCard
                  key={position.positionId}
                  position={position}
                  onEditPosition={onEditPosition}
                />
              ))
            )}
          </div>
        </div>
        {/* ------------ END: Content ------------ */}
      </div>

      {/* Edit User Modal */}
      {editUserModal.isModalMounted && (
        <CreateEmployeeModal
          createUserModal={editUserModal}
          closeCreateUserModal={closeEditUserModal}
          mode="edit"
          selectedEmployee={selectedEmployee}
        />
      )}
    </>
  )
}

export default EmployeeDetail
