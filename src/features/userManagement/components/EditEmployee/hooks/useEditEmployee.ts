import { Form } from 'antd'

import { useUpdateEmployeeMutation } from 'api/employeeApi'
import { EmployeeUserType } from 'api/employeeApi.types'
import { useNotification } from 'hooks/useNotification'

type Props = {
    closeModal: () => void
    selectedEmployee: EmployeeUserType
}

const useEditEmpolyee = ({ closeModal, selectedEmployee }: Props) => {
    const [userFormRef] = Form.useForm()
    const { openNotification } = useNotification()
    const [updateEmployeeMutation, { isLoading: isUpdating }] = useUpdateEmployeeMutation()

    // Pre-populate form with existing user data
    const populateForm = () => {
        userFormRef.setFieldsValue({
            prefixEn: selectedEmployee.prefixEn,
            firstNameEn: selectedEmployee.firstNameEn,
            lastNameEn: selectedEmployee.lastNameEn,
            prefixTh: selectedEmployee.prefixTh,
            firstNameTh: selectedEmployee.firstNameTh,
            lastNameTh: selectedEmployee.lastNameTh,
            userName: selectedEmployee.userName,
            email: selectedEmployee.email,
            telephone: selectedEmployee.telephone,
        })
    }

    const onUpdateEmployee = async () => {
        try {
            await userFormRef.validateFields()
        } catch (error) {
            console.error('Form validation failed:', error)
            openNotification({
                type: 'error',
                title: 'Error Validating Form',
                description: 'Please check the form fields for errors.',
            })
            return
        }

        try {
            const formValues = userFormRef.getFieldsValue()

            const updateData = {
                prefixEn: formValues.prefixEn,
                firstNameEn: formValues.firstNameEn,
                lastNameEn: formValues.lastNameEn,
                prefixTh: formValues.prefixTh,
                firstNameTh: formValues.firstNameTh,
                lastNameTh: formValues.lastNameTh,
                userName: formValues.userName,
                email: formValues.email,
                telephone: formValues.telephone,
            }

            await updateEmployeeMutation({
                employeeId: selectedEmployee.id,
                data: updateData,
            }).unwrap()

            openNotification({
                type: 'success',
                title: 'Success',
                description: 'User profile updated successfully.',
            })

            userFormRef.resetFields()
            closeModal()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error updating user:', error)

            let errorMessage = 'Failed to update user profile.'

            if (error?.data?.message) {
                errorMessage = error.data.message
            } else if (error?.message) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            }

            openNotification({
                type: 'error',
                title: 'Error',
                description: errorMessage,
            })
        }
    }

    return {
        onUpdateUser: onUpdateEmployee,
        userFormRef,
        isUpdating,
        populateForm,
    }
}

export default useEditEmpolyee
