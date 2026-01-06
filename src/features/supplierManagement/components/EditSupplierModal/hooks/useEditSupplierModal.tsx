import { useEffect } from 'react'

import { Form } from 'antd'

import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierMutation,
} from 'api/supplier'
import { SupplierType } from 'api/supplierApi.types'
import { useNotification } from 'hooks/useNotification'

type Props = {
  selectedSupplier: SupplierType | null
  closeEditSupplierModal: () => void
}

const useEditSupplierModal = ({ selectedSupplier, closeEditSupplierModal }: Props) => {
  const [supplierFormRef] = Form.useForm()
  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation()
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation()
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation()
  const { openNotification } = useNotification()

  useEffect(() => {
    if (selectedSupplier) {
      supplierFormRef.setFieldsValue({
        ...selectedSupplier,
        attention: selectedSupplier.supplierAttention,
        position: selectedSupplier.supplierPosition,
        address: selectedSupplier.supplierAddress,
        telephone: selectedSupplier.supplierTelephone,
        email: selectedSupplier.supplierEmail,
        taxId: selectedSupplier.taxId,
        supplierProvince: selectedSupplier.supplierProvince,
        supplierCountry: selectedSupplier.supplierCountry,
        supplierPostcode: selectedSupplier.supplierPostcode,
        supplierFax: selectedSupplier.supplierFax,
        paymentTerm: {
          value: selectedSupplier.paymentTermId,
          label: selectedSupplier.paymentTermName,
        },
      })
    }
  }, [selectedSupplier, supplierFormRef])

  const onSaveSupplier = async () => {
    try {
      await supplierFormRef.validateFields()
    } catch (error) {
      console.error('Validation Failed:', error)
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    try {
      const values = await supplierFormRef.getFieldsValue()

      const supplierData: SupplierType = {
        id: values.id,
        supplierName: values.supplierName,
        supplierCode: values.supplierCode,
        supplierAddress: values.address,
        supplierTelephone: values.telephone,
        supplierEmail: values.email,
        supplierAttention: values.attention,
        supplierPosition: values.position,
        taxId: values.taxId,
        supplierProvince: values.supplierProvince,
        supplierCountry: values.supplierCountry,
        supplierPostcode: values.supplierPostcode,
        supplierFax: values.supplierFax,
        paymentTermId: values.paymentTerm.value,
        paymentTermName: values.paymentTerm.label,
        paymentTermDescription: values.paymentTermDescription,
        isShowDescription: values.isShowDescription || null,
      }

      if (selectedSupplier) {
        await updateSupplier({ ...supplierData, id: selectedSupplier.id }).unwrap()
        openNotification({
          type: 'success',
          title: 'Supplier Updated',
          description: 'Supplier updated successfully.',
        })
      } else {
        await createSupplier(supplierData).unwrap()
        openNotification({
          type: 'success',
          title: 'Supplier Created',
          description: 'Supplier created successfully.',
        })
      }

      supplierFormRef.resetFields()
      closeEditSupplierModal()
    } catch (error) {
      console.error('Validation Failed:', error)
      openNotification({
        type: 'error',
        title: 'Error Saving Supplier',
        description: 'An error occurred while saving the supplier. Please try again.',
      })
    }
  }

  const onDeleteSupplier = async () => {
    if (!selectedSupplier) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'No supplier selected.',
      })
      return
    }
    try {
      await deleteSupplier(selectedSupplier.id).unwrap()
      openNotification({
        type: 'success',
        title: 'Supplier Deleted',
        description: 'Supplier has been deleted successfully.',
      })
      closeEditSupplierModal()
    } catch (error) {
      console.error('Failed to delete supplier:', error)
      openNotification({
        type: 'error',
        title: 'Error Deleting Supplier',
        description: 'An error occurred while deleting the supplier. Please try again.',
      })
    }
  }

  return {
    supplierFormRef,
    onSaveSupplier,
    onDeleteSupplier,
    isCreating,
    isUpdating,
    isDeleting,
  }
}

export default useEditSupplierModal
