import { Divider, Form, Modal, Table } from 'antd'

import { NewBudgetSiteInfoType, OrganizationListType } from 'api/allocateManagementApi.types'
import useCustomModal from 'hooks/useCustomModal'

import HeaderTitle from 'components/HeaderTitle'

import { columns } from './columns'
import useEditOrganizationModal from './hooks/useEditOrganizationModal'

const newItemRow: NewBudgetSiteInfoType = {
  key: 'new',
  budgetId: '',
  organizationId: '',
  organizationName: '',
  budgetTypeId: '',
  budgetTypeName: '',
  mainBudgetCode: '',
  isSubBudget: false,
  budgetCode: '',
  budgetAmount: 0,
  budgetName: '',
  budgetYear: 0,
  isBudgetCenter: false,
  budgetAmountMonth1: 0,
  budgetAmountMonth2: 0,
  budgetAmountMonth3: 0,
  budgetAmountMonth4: 0,
  budgetAmountMonth5: 0,
  budgetAmountMonth6: 0,
  budgetAmountMonth7: 0,
  budgetAmountMonth8: 0,
  budgetAmountMonth9: 0,
  budgetAmountMonth10: 0,
  budgetAmountMonth11: 0,
  budgetAmountMonth12: 0,
  costCenter: '',
  isActive: false,
  id: '',
}

type Props = {
  editOrgModal: ReturnType<typeof useCustomModal>
  closeEditOrgModal: () => void
  selectedOrganization: OrganizationListType | null
}

const EditOrganizationModal = ({
  editOrgModal,
  closeEditOrgModal,
  selectedOrganization,
}: Props) => {
  const {
    onSelectBudgetCode,
    formRef,
    onAddBudget,
    onDeleteBudget,
    budgetSites,
    isBudgetSitesLoading,
    isAddingBudgetSite,
    isDeletingBudgetSite,
  } = useEditOrganizationModal({
    selectedOrganization,
  })

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <HeaderTitle
            title={selectedOrganization?.name ? selectedOrganization.name : 'Organization'}
          />
          <Divider style={{ margin: '16px 0' }} />
        </>
      }
      open={editOrgModal.isModalVisible}
      onCancel={closeEditOrgModal}
      width={1000}
      footer={null}
      afterClose={editOrgModal.afterClose}
    >
      <Form labelWrap form={formRef}>
        <Table
          bordered
          size="middle"
          loading={isBudgetSitesLoading || isAddingBudgetSite || isDeletingBudgetSite}
          tableLayout="auto"
          columns={columns({ onSelectBudgetCode, onAddBudget, onDeleteBudget })}
          dataSource={[...(budgetSites || []), newItemRow]}
          scroll={{ x: 'auto' }}
          rowKey="key"
          pagination={false}
        />
      </Form>
    </Modal>
  )
}

export default EditOrganizationModal
