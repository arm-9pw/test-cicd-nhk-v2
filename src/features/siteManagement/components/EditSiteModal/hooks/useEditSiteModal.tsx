import { useEffect } from 'react'

import { Form } from 'antd'

import {
  useCreateSiteManagementMutation,
  useDeleteSiteManagementMutation,
  useUpdateSiteManagementMutation,
} from 'api/siteManagementApi'
import { SiteManagementResponseType } from 'api/siteManagementApi.types'
import { useNotification } from 'hooks/useNotification'

type Props = {
  selectedSite: SiteManagementResponseType | null
  closeEditSiteModal: () => void
}

const useEditSiteModal = ({ selectedSite, closeEditSiteModal }: Props) => {
  const [siteFormRef] = Form.useForm()
  const [createSite, { isLoading: isCreating }] = useCreateSiteManagementMutation()
  const [updateSite, { isLoading: isUpdating }] = useUpdateSiteManagementMutation()
  const [deleteSite, { isLoading: isDeleting }] = useDeleteSiteManagementMutation()
  const { openNotification } = useNotification()

  useEffect(() => {
    if (selectedSite) {
      siteFormRef.setFieldsValue({
        ...selectedSite,
        telephone: selectedSite.tel,
        organizationId: selectedSite.organizationId,
        organizationCode: selectedSite.organizationCode,
        organizationName: selectedSite.organizationName,
      })
    }
  }, [selectedSite, siteFormRef])

  const onSave = async () => {
    try {
      await siteFormRef.validateFields()
    } catch (error) {
      console.error('Validation Failed:', error)
      openNotification({
        title: 'Error',
        description: 'Please check the form fields for errors.',
      })
    }

    try {
      const values = await siteFormRef.validateFields()

      const data: Partial<SiteManagementResponseType> = {
        organizationId: values.organizationId,
        organizationCode: values.organizationCode,
        organizationName: values.organizationName,
        siteName: values.siteName,
        siteBranchName: values.siteBranchName,
        siteBranchNo: values.siteBranchNo,
        addressTh: values.addressTh,
        addressEn: values.addressEn,
        provinceTh: values.provinceTh,
        provinceEn: values.provinceEn,
        countryTH: values.countryTH,
        countryEN: values.countryEN,
        tel: values.telephone,
        email: values.email,
        siteShortCode: values.siteShortCode,
        taxId: values.taxId,
      }
      if (selectedSite) {
        await updateSite({ ...data, id: selectedSite.id }).unwrap()
        openNotification({
          type: 'success',
          title: 'Site updated',
          description: 'Site updated successfully',
        })
      } else {
        await createSite(data).unwrap()
        openNotification({
          type: 'success',
          title: 'Site created',
          description: 'Site created successfully',
        })
      }
      siteFormRef.resetFields()
      closeEditSiteModal()
    } catch (error) {
      console.error('Failed to save site:', error)
      openNotification({
        type: 'error',
        title: 'Error saving site',
        description: 'Failed to save site. Please try again.',
      })
    }
  }

  const onDelete = async () => {
    if (!selectedSite) {
      openNotification({
        type: 'error',
        title: 'Error no site selected',
        description: 'Please try again.',
      })
      return
    }
    try {
      await deleteSite(selectedSite.id).unwrap()
      openNotification({
        type: 'success',
        title: 'Site deleted',
        description: 'Site deleted successfully',
      })
      closeEditSiteModal()
    } catch (error) {
      console.error('Failed to delete site:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete site. Please try again.',
      })
    }
  }

  return {
    siteFormRef,
    onSave,
    onDelete,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
export default useEditSiteModal
