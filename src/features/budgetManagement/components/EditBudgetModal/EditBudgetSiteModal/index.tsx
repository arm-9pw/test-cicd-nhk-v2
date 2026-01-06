import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, Input, Modal, Row, Spin, Select } from 'antd'
import { useEffect, useState } from 'react'

import { BudgetSiteResponseType, BudgetsResponseType } from 'api/budgetManagementApi.types'
import { useGetSiteCodesQuery } from 'api/employeeApi'
import { useGetBudgetSiteBySiteCodeQuery } from 'api/siteManagementApi'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'

import useEditBudgetSiteModal from './hooks/useEditBudgetSiteModal'

type Props = {
    editBudgetSiteModal: ReturnType<typeof useCustomModal>
    closeEditBudgetSiteModal: () => void
    selectedBudgetSite: BudgetSiteResponseType | null
    budgetId: string
    selectedBudget: BudgetsResponseType | null
    onBudgetSiteUpdated?: (updatedBudget: BudgetsResponseType) => void
}

const SPAN = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 }

const EditBudgetSiteModal = ({
    editBudgetSiteModal,
    closeEditBudgetSiteModal,
    selectedBudgetSite,
    budgetId,
    selectedBudget,
    onBudgetSiteUpdated
}: Props) => {
    // Local states for dropdown dependencies
    const [selectedSiteCode, setSelectedSiteCode] = useState<string | null>(null)
    const [organizationCode, setOrganizationCode] = useState<string>('')

    // Fetch site codes
    const { data: siteCodes, isFetching: isLoadingSiteCodes } = useGetSiteCodesQuery()
    
    // Fetch organizations only when site code is selected
    const { data: organizations, isFetching: isLoadingOrganizations } = useGetBudgetSiteBySiteCodeQuery({
        siteCode: selectedSiteCode || ''
    }, {
        skip: !selectedSiteCode || selectedSiteCode.trim() === '', // Skip query if no site code selected
        refetchOnMountOrArgChange: true
    })

    const {
        formRef,
        onAdd,
        isCreating,
        isDeleting,
    } = useEditBudgetSiteModal({
        selectedBudgetSite,
        closeEditBudgetSiteModal,
        budgetId,
        selectedBudget,
        onBudgetSiteUpdated,
        organizations
    })

    // Initialize form data when editing
    useEffect(() => {
        if (selectedBudgetSite) {
            setSelectedSiteCode(selectedBudgetSite.siteCode)
            setOrganizationCode(selectedBudgetSite.organizationCode || '')

            formRef.setFieldsValue({
                siteCode: selectedBudgetSite.siteCode,
                organizationId: selectedBudgetSite.organizationId,
                organizationCode: selectedBudgetSite.organizationCode || '',
            })
        } else {
            // Reset when adding new
            setSelectedSiteCode(null)
            setOrganizationCode('')
            formRef.resetFields()
        }
    }, [selectedBudgetSite, formRef])

    // Handle site code change
    const handleSiteCodeChange = (value: string) => {
        setSelectedSiteCode(value)
        setOrganizationCode('')

        // Clear organization selection
        formRef.setFieldsValue({
            organizationId: undefined,
            organizationCode: '',
        })
    }

    // Handle organization change
    const handleOrganizationChange = (value: string) => {
        const selectedOrg = organizations?.find(org => org.id === value)
        if (selectedOrg) {
            const orgCode = selectedOrg.code || selectedOrg.alternativeName || ''
            setOrganizationCode(orgCode)

            formRef.setFieldsValue({
                organizationCode: orgCode,
            })
        }
    }

    const getModalTitle = () => {
        return <HeaderTitle title="Add Budget Site/เพิ่มไซต์งบประมาณ" titlePreIcon={<PlusOutlined />} />
    }

    return (
        <Modal
            destroyOnClose
            title={
                <>
                    {getModalTitle()}
                    <Divider style={{ margin: '16px 0' }} />
                </>
            }
            open={editBudgetSiteModal.isModalVisible}
            onCancel={closeEditBudgetSiteModal}
            width={800}
            footer={null}
            afterClose={editBudgetSiteModal.afterClose}
        >
            <Spin spinning={isCreating || isDeleting}>
                <Form labelWrap layout="vertical" form={formRef}>
                    <Row gutter={[16, 16]}>
                        <Col {...SPAN}>
                            <Form.Item
                                name="siteCode"
                                label="Site Code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select site code!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select Site Code"
                                    loading={isLoadingSiteCodes}
                                    onChange={handleSiteCodeChange}
                                    showSearch
                                    filterOption={(input, option) =>
                                        String(option?.children ?? '')
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {siteCodes?.map(site => (
                                        <Select.Option key={site.siteCode} value={site.siteCode}>
                                            {site.siteCode}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col {...SPAN}>
                            <Form.Item
                                name="organizationId"
                                label="Organization Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select organization!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={!selectedSiteCode ? "Please select Site Code first" : "Select Organization"}
                                    disabled={!selectedSiteCode}
                                    loading={isLoadingOrganizations}
                                    onChange={handleOrganizationChange}
                                    showSearch
                                    filterOption={(input, option) =>
                                        String(option?.children ?? '')
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {organizations?.map(org => {
                                        const isExisting = selectedBudget?.budgetSites?.some(site => 
                                            site.siteCode === selectedSiteCode && 
                                            site.organizationId.toString() === org.id
                                        )
                                        
                                        return (
                                            <Select.Option 
                                                key={org.id} 
                                                value={org.id}
                                                disabled={isExisting}
                                                title={isExisting ? "This organization already exists for this site" : undefined}
                                            >
                                                {org.name} {isExisting ? "(Already exists)" : ""}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col {...SPAN}>
                            <Form.Item
                                name="organizationCode"
                                label="Organization Code"
                            >
                                <Input
                                    placeholder="Organization code will appear here"
                                    value={organizationCode}
                                    disabled
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        color: '#666'
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} style={{ marginTop: '24px' }} justify="end">
                        <Col>
                            <Button onClick={closeEditBudgetSiteModal} disabled={isCreating || isDeleting}>
                                Cancel
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={onAdd}
                                loading={isCreating}
                                disabled={isCreating || isDeleting}
                            >
                                Add Budget Site
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    )
}

export default EditBudgetSiteModal