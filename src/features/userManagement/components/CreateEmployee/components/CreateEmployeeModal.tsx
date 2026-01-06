import { PlusOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Row, Spin } from 'antd'
import { useEffect } from 'react'

import useCustomModal from 'hooks/useCustomModal'
import { EmployeeUserType } from 'api/employeeApi.types'

import HeaderTitle from 'components/HeaderTitle'

import useCreateEmployee from '../hooks/useCreateEmployee'
import useEditEmpolyee from '../../EditEmployee/hooks/useEditEmployee'

type Props = {
    createUserModal: ReturnType<typeof useCustomModal>
    closeCreateUserModal: () => void
    mode?: 'create' | 'edit'
    selectedEmployee?: EmployeeUserType
}

const SPAN = { xs: 24, sm: 12, md: 12, lg: 8, xl: 8 }

const CreateEmployeeModal = ({
    createUserModal,
    closeCreateUserModal,
    mode = 'create',
    selectedEmployee
}: Props) => {
    const createUserHook = useCreateEmployee({
        closeCreateUserModal,
    })

    const editUserHook = useEditEmpolyee({
        closeModal: closeCreateUserModal,
        selectedEmployee: selectedEmployee!,
    })

    // Choose the appropriate hook based on mode
    const isEditMode = mode === 'edit'
    const {
        onCreateUser,
        userFormRef: createFormRef,
        isCreating
    } = createUserHook

    const {
        onUpdateUser,
        userFormRef: editFormRef,
        isUpdating,
        populateForm
    } = editUserHook

    // Use the appropriate form and handlers based on mode
    const userFormRef = isEditMode ? editFormRef : createFormRef
    const onSubmit = isEditMode ? onUpdateUser : onCreateUser
    const isLoading = isEditMode ? isUpdating : isCreating

    // Populate form when modal opens in edit mode
    useEffect(() => {
        if (isEditMode && createUserModal.isModalVisible && selectedEmployee) {
            populateForm()
        }
    }, [isEditMode, createUserModal.isModalVisible, selectedEmployee, populateForm])

    const modalTitle = isEditMode ? "Edit User Profile/แก้ไขข้อมูลผู้ใช้" : "Create New User/สร้างผู้ใช้ใหม่"
    const modalIcon = isEditMode ? <EditOutlined /> : <PlusOutlined />
    const submitButtonText = isEditMode ? "Update Profile" : "Create User"

    return (
        <Modal
            destroyOnClose
            title={
                <>
                    <HeaderTitle title={modalTitle} titlePreIcon={modalIcon} />
                    <Divider style={{ margin: '16px 0' }} />
                </>
            }
            open={createUserModal.isModalVisible}
            onCancel={closeCreateUserModal}
            width={1000}
            footer={null}
            afterClose={createUserModal.afterClose}
        >
            <Spin spinning={isLoading}>
                <Form labelWrap layout="vertical" form={userFormRef}>
                    <Row gutter={[16, 16]}>
                        <Col {...SPAN}>
                            <Form.Item
                                name="userName"
                                label="Username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input username!',
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9._-]+$/,
                                        message:
                                            'Username can only contain letters, numbers, dots, underscores, and hyphens!',
                                    },
                                ]}
                            >
                                <Input placeholder="Username" />
                            </Form.Item>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Please enter a valid email!',
                                    },
                                ]}
                            >
                                <Input placeholder="example@company.com" />
                            </Form.Item>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="telephone"
                                label="Telephone"
                                rules={[
                                    {
                                        pattern: /^\d{10}$/,
                                        message: 'Telephone must be 10 digits!',
                                    },
                                ]}
                            >
                                <Input placeholder="เบอร์โทรศัพท์" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="prefixEn"
                                label="Prefix EN"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input prefix!',
                                    },
                                ]}
                            >
                                <Input placeholder="Mr., Ms., Dr., etc." />
                            </Form.Item>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="firstNameEn"
                                label="First Name EN"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input first name!',
                                    },
                                ]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="lastNameEn"
                                label="Last Name EN"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input last name!',
                                    },
                                ]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="prefixTh"
                                label="Prefix TH"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input prefix!',
                                    },
                                ]}
                            >
                                <Input placeholder="นาย, นาง, นางสาว, ดร., etc." />
                            </Form.Item>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="firstNameTh"
                                label="First Name TH"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input first name!',
                                    },
                                ]}
                            >
                                <Input placeholder="ชื่อ" />
                            </Form.Item>
                        </Col>
                        <Col {...SPAN}>
                            <Form.Item
                                name="lastNameTh"
                                label="Last Name TH"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input last name!',
                                    },
                                ]}
                            >
                                <Input placeholder="นามสกุล" />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={[8, 8]} style={{ marginTop: '24px' }} justify="end">
                        <Col>
                            <Button onClick={closeCreateUserModal} disabled={isLoading}>
                                Cancel
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={onSubmit}
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {submitButtonText}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    )
}

export default CreateEmployeeModal
