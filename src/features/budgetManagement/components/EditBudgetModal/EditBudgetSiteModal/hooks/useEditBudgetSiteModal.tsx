import { useEffect } from 'react'
import { Form } from 'antd'

import { BudgetSiteResponseType, BudgetsResponseType } from 'api/budgetManagementApi.types'
import { OrganizationResponseType } from 'api/siteManagementApi.types'
import { useNotification } from 'hooks/useNotification'
import { useAddBudgetSiteMutation, useDeleteBudgetSiteMutation } from 'api/budgetManagementApi'

type Props = {
    selectedBudgetSite: BudgetSiteResponseType | null
    closeEditBudgetSiteModal: () => void
    budgetId: string
    selectedBudget: BudgetsResponseType | null
    onBudgetSiteUpdated?: (updatedBudget: BudgetsResponseType) => void
    organizations?: OrganizationResponseType[]
}

const useEditBudgetSiteModal = ({
    selectedBudgetSite,
    closeEditBudgetSiteModal,
    budgetId,
    selectedBudget,
    onBudgetSiteUpdated,
    organizations
}: Props) => {
    const [formRef] = Form.useForm()
    const { openNotification } = useNotification()

    const [addBudgetSite, { isLoading: isCreating }] = useAddBudgetSiteMutation()
    const [deleteBudgetSite, { isLoading: isDeleting }] = useDeleteBudgetSiteMutation()

    useEffect(() => {
        return () => {
            formRef.resetFields()
        }
    }, [formRef])

    const onAdd = async () => {
        try {
            await formRef.validateFields()
        } catch (error) {
            console.error(error)
            openNotification({
                type: 'error',
                title: 'Validation Error',
                description: 'Please check the form fields for errors.',
            })
            return
        }

        try {
            const formValues = formRef.getFieldsValue()

            const selectedOrganization = organizations?.find(
                org => org.id === formValues.organizationId
            )

            const body: Partial<BudgetSiteResponseType> = {
                budgetId: budgetId,
                siteCode: formValues.siteCode,
                organizationId: formValues.organizationId,
                organizationCode: formValues.organizationCode,
                organizationName: selectedOrganization?.name || selectedOrganization?.alternativeName || '',
            }

            await addBudgetSite(body).unwrap()
            openNotification({
                type: 'success',
                title: 'Success',
                description: 'Budget site added successfully.',
            })

            // ส่งข้อมูล budget site ที่เพิ่มใหม่กลับไป
            if (onBudgetSiteUpdated && selectedBudget) {
                const newBudgetSite: BudgetSiteResponseType = {
                    id: 'temp-' + Date.now(), // temporary ID
                    budgetId: budgetId,
                    siteCode: formValues.siteCode,
                    organizationId: formValues.organizationId,
                    organizationCode: formValues.organizationCode,
                    organizationName: selectedOrganization?.alternativeName || selectedOrganization?.name || '',
                }
                
                const updatedBudget = {
                    ...selectedBudget,
                    budgetSites: [...(selectedBudget.budgetSites || []), newBudgetSite]
                }
                
                onBudgetSiteUpdated(updatedBudget)
            }

            formRef.resetFields()
            closeEditBudgetSiteModal()
        } catch (error) {
            console.error(error)
            openNotification({
                type: 'error',
                title: 'Error',
                description: 'Failed to add budget site. Please try again.',
            })
        }
    }

    const onDelete = async () => {
        if (!selectedBudgetSite) {
            openNotification({
                type: 'error',
                title: 'Error',
                description: 'No budget site selected for deletion.',
            })
            return
        }

        try {
            // TODO: Replace with actual API call
            // await deleteBudgetSite(selectedBudgetSite.id).unwrap()

            await deleteBudgetSite({ 
                budgetSiteId: selectedBudgetSite.id, 
                budgetId: budgetId 
            }).unwrap()

            openNotification({
                type: 'success',
                title: 'Success',
                description: 'Budget site deleted successfully.',
            })

            // ลบ budget site ออกจาก array
            if (onBudgetSiteUpdated && selectedBudget) {
                const updatedBudget = {
                    ...selectedBudget,
                    budgetSites: selectedBudget.budgetSites?.filter(site => site.id !== selectedBudgetSite.id) || []
                }
                
                onBudgetSiteUpdated(updatedBudget)
            }

            closeEditBudgetSiteModal()
        } catch (error) {
            console.error(error)
            openNotification({
                type: 'error',
                title: 'Error',
                description: 'Failed to delete budget site. Please try again.',
            })
        }
    }

    return {
        formRef,
        onAdd,
        onDelete,
        isCreating,
        isDeleting,
    }
}

export default useEditBudgetSiteModal