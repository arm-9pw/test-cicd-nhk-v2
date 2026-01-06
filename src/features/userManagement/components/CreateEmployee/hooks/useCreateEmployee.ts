import { Form } from 'antd'
import dayjs from 'dayjs'

import { useCreateUserMutation } from 'api/employeeApi'
import { useNotification } from 'hooks/useNotification'

type Props = {
  closeCreateUserModal: () => void
}

const useCreateEmployee = ({ closeCreateUserModal }: Props) => {
  const [userFormRef] = Form.useForm()
  const { openNotification } = useNotification()
  const [createUserMutation, { isLoading: isCreating }] = useCreateUserMutation()

  const onCreateUser = async () => {
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

      const createData = {
        prefixEn: formValues.prefixEn,
        firstNameEn: formValues.firstNameEn,
        lastNameEn: formValues.lastNameEn,
        prefixTh: formValues.prefixTh,
        firstNameTh: formValues.firstNameTh,
        lastNameTh: formValues.lastNameTh,
        userName: formValues.userName,
        email: formValues.email,
        telephone: formValues.telephone,
        gender: formValues.gender,
        birthDate: dayjs(formValues.birthDate).format('YYYY-MM-DDTHH:mm:ss'),
        isActive: true,
        isDeleted: false,
      }

      await createUserMutation(createData).unwrap()

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'User created successfully.',
      })

      userFormRef.resetFields()
      closeCreateUserModal()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating user:', error)

      let errorMessage = 'Failed to create user.'

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
    onCreateUser,
    userFormRef,
    isCreating,
  }
}

export default useCreateEmployee
