import { Tabs } from 'antd'

import styles from './AuthorizeSettingPage.module.css'

import useCustomModal from 'hooks/useCustomModal'

import CustomPagination from 'components/CustomPagination'
import PageHeader from 'components/PageHeader'

import AuthorizationModal from './components/AuthorizationModal'
import CancelDelegationModal from './components/CancelDelegationModal'
import DelegationTable from './components/DelegationTable'
import ExtendDelegationModal from './components/ExtendDelegationModal'
import SearchAuthorizeForm from './components/SearchAuthorizeForm'
import { TAB_KEYS } from './constants'
import { useDelegationActions } from './hooks/useDelegationActions'
import { useDelegationData } from './hooks/useDelegationData'
import { useDelegationSelection } from './hooks/useDelegationSelection'

const AuthorizeSettingPage = () => {
  const authorizationModalHook = useCustomModal()
  const cancelDelegationModalHook = useCustomModal()
  const extendDelegationModalHook = useCustomModal()

  const {
    delegations,
    isLoading,
    handleSearch,
    handleReset,
    activeTab,
    handleTabChange,
    page,
    handleNextPage,
    handlePrevPage,
    sizePerPage,
  } = useDelegationData()

  const {
    selectedDelegationId,
    selectedDelegation,
    isFetchingDelegation,
    handleRowClickForAuthorizationModal,
    handleAuthorizationModalClose,
  } = useDelegationSelection({
    onAuthorizationModalShow: authorizationModalHook.showModal,
    onAuthorizationModalCancel: authorizationModalHook.handleCancel,
  })

  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading: isDelegationLoading,
  } = useDelegationActions({
    selectedDelegation,
    onSuccess: handleAuthorizationModalClose,
  })

  return (
    <div>
      <PageHeader
        pageTitle="Authorize Setting"
        breadcrumbItems={[
          {
            title: 'Authorize Setting',
          },
        ]}
      />
      <div style={{ marginTop: 16 }}>
        <Tabs
          type="card"
          activeKey={activeTab}
          onChange={handleTabChange}
          className={styles['authorize-tabs']}
          items={[
            {
              key: TAB_KEYS.DELEGATE_TO,
              label: 'Authorize To Other',
              children: (
                <>
                  <SearchAuthorizeForm
                    delegationType={activeTab}
                    loading={isLoading}
                    onSearchDelegations={handleSearch}
                    onResetSearch={handleReset}
                  />

                  <div style={{ marginTop: 16 }}>
                    <DelegationTable
                      data={delegations}
                      loading={isLoading}
                      delegationType={activeTab}
                      onNewAuthorization={authorizationModalHook.showModal}
                      onRowClick={handleRowClickForAuthorizationModal}
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <CustomPagination
                      handleNextPage={handleNextPage}
                      handlePrevPage={handlePrevPage}
                      currentPage={page}
                      disabledPrevious={page === 1}
                      disabledNext={delegations.length < sizePerPage}
                    />
                  </div>
                </>
              ),
            },
            {
              key: TAB_KEYS.DELEGATOR,
              label: 'Authorized From',
              children: (
                <>
                  <SearchAuthorizeForm
                    delegationType={activeTab}
                    loading={isLoading}
                    onSearchDelegations={handleSearch}
                    onResetSearch={handleReset}
                  />
                  <div style={{ marginTop: 16 }}>
                    <DelegationTable
                      data={delegations}
                      loading={isLoading}
                      delegationType={activeTab}
                      onNewAuthorization={authorizationModalHook.showModal}
                      onRowClick={handleRowClickForAuthorizationModal}
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <CustomPagination
                      handleNextPage={handleNextPage}
                      handlePrevPage={handlePrevPage}
                      currentPage={page}
                      disabledPrevious={page === 1}
                      disabledNext={delegations.length < sizePerPage}
                    />
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>

      {/* New Authorization Modal (mount only when needed) */}
      {authorizationModalHook.isModalMounted && (
        <AuthorizationModal
          open={authorizationModalHook.isModalVisible}
          onCancel={handleAuthorizationModalClose}
          afterClose={authorizationModalHook.afterClose}
          selectedAuthorization={selectedDelegationId ? selectedDelegation : undefined}
          isLoading={isFetchingDelegation || isDelegationLoading}
          onCancelDelegation={cancelDelegationModalHook.showModal}
          onExtendDelegation={extendDelegationModalHook.showModal}
          onCreateDelegation={handleCreate}
          onUpdateDelegation={handleUpdate}
          onDeleteDelegation={handleDelete}
        />
      )}

      {/* Cancel Delegation Modal */}
      {cancelDelegationModalHook.isModalMounted && (
        <CancelDelegationModal
          open={cancelDelegationModalHook.isModalVisible}
          onCancel={cancelDelegationModalHook.handleCancel}
          afterClose={cancelDelegationModalHook.afterClose}
          selectedDelegation={selectedDelegationId ? selectedDelegation : undefined}
          isLoading={isFetchingDelegation}
        />
      )}

      {/* Extend Delegation Modal */}
      {extendDelegationModalHook.isModalMounted && (
        <ExtendDelegationModal
          open={extendDelegationModalHook.isModalVisible}
          onCancel={extendDelegationModalHook.handleCancel}
          afterClose={extendDelegationModalHook.afterClose}
          selectedDelegation={selectedDelegationId ? selectedDelegation : undefined}
          isLoading={isFetchingDelegation}
        />
      )}
    </div>
  )
}

export default AuthorizeSettingPage
