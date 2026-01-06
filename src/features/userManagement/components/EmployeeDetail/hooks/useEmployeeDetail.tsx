import { useEffect, useState } from 'react'

import { useGetEmployeeByIdQuery, useUpdateEmployeeMutation } from 'api/employeeApi'
import { EmployeeDetailType, EmployeeUserType } from 'api/employeeApi.types'
import { useNotification } from 'hooks/useNotification'

const useEmployeeDetail = ({ selectedEmployee }: { selectedEmployee: EmployeeUserType }) => {
  const { data: employeeDetail, isLoading, error } = useGetEmployeeByIdQuery(selectedEmployee.id)
  const [updateEmployee] = useUpdateEmployeeMutation()
  const [localEmployeeDetail, setLocalEmployeeDetail] = useState<EmployeeDetailType | undefined>(
    undefined,
  )

  useEffect(() => {
    if (employeeDetail) {
      setLocalEmployeeDetail(employeeDetail)
    }
  }, [employeeDetail])

  const { openNotification } = useNotification()

  const handleSaveField = async (field: string, value: string, oldValue: string) => {
    if (value === oldValue) return // NOTE: No need to save
    if (!localEmployeeDetail) {
      openNotification({
        type: 'error',
        title: 'Cannot Save',
        description: 'Employee data not found. Please try again later.',
      })
      return
    }

    try {
      await updateEmployee({
        employeeId: localEmployeeDetail.employeeId,
        data: { [field]: value },
      }).unwrap()

      setLocalEmployeeDetail({
        ...localEmployeeDetail,
        [field]: value,
      })
      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Updated successfully',
      })
    } catch (error) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update',
      })
      return false
    }
  }

  const handleSaveName = async (language: 'En' | 'Th', value: string, oldValue: string) => {
    if (value === oldValue) return
    if (!localEmployeeDetail) {
      openNotification({
        type: 'error',
        title: 'Cannot Save',
        description: 'Employee data not found. Please try again later.',
      })
      return
    }

    const [firstName, lastName] = value.split(' ')
    if (!firstName || !lastName) {
      openNotification({
        type: 'error',
        title: 'Invalid Name Format',
        description: 'Please enter both first name and last name separated by space',
      })
      return false
    }

    try {
      const updatedEmployee = await updateEmployee({
        employeeId: localEmployeeDetail.employeeId,
        data: {
          [`firstName${language}`]: firstName,
          [`lastName${language}`]: lastName,
        },
      }).unwrap()

      setLocalEmployeeDetail({
        ...localEmployeeDetail,
        firstNameEn: updatedEmployee.firstNameEn,
        firstNameTh: updatedEmployee.firstNameTh,
        lastNameEn: updatedEmployee.lastNameEn,
        lastNameTh: updatedEmployee.lastNameTh,
      })
      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Updated successfully',
      })
    } catch (error) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update',
      })
      return false
    }
  }

  return {
    localEmployeeDetail,
    handleSaveField,
    handleSaveName,
    isLoading,
    error,
  }
}

export default useEmployeeDetail
