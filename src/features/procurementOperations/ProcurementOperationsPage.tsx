import { ProcurementContext } from 'api/procurementApi.types'

import CustomPagination from 'components/CustomPagination'
import PageHeader from 'components/PageHeader'

import ApprovalRouteModal from './components/ApprovalRouteModal'
import ProcurementOperationsTable from './components/ProcurementOperationsTable'
import SearchBox from './components/SearchBox'
import StatusBoxSection from './components/StatusBoxSection'
import useDocumentLocation from './hooks/useDocumentLocation'
import { useProcurementOperations } from './hooks/useProcurementOperations'

import { AnimatePresence, motion } from 'framer-motion'

interface ProcurementOperationsPageProps {
  defaultContext: ProcurementContext
}

const ProcurementOperationsPage = ({ defaultContext }: ProcurementOperationsPageProps) => {
  const {
    // Procurement Data
    isTableLoading,
    isLoadingCounts,
    tableData,
    selectedStatus,
    statusCounts,
    handleSearchProcurement,
    handleStatusChange,
    handleResetSearch,

    // Pagination
    page,
    // sizePerPage,
    handleNextPage,
    handlePrevPage,
  } = useProcurementOperations(defaultContext)

  const { handleDocumentLocationCellClick, documentLocationModalHook, selectedRecord } =
    useDocumentLocation()

  const pageTitle = defaultContext === 'PURCHASER' ? 'Purchaser Operations' : 'Requester Operations'

  return (
    <>
      <PageHeader
        pageTitle={pageTitle}
        breadcrumbItems={[
          {
            title: pageTitle,
          },
        ]}
      />

      {/* TODO: FilterBox
      - ✅ Deselect status box
      - ✅ Trigger search
      - ✅ Auto expand
      - ✅ Pagination
      - ✅ Purchser Search box
      - ✅ Requester Search box
      - ✅ When click search, collapse search box
      - 🚧 Hide expand button => need to eliminate children property [I try but the style seem weird so I just comment the code out]
      - ✅ Make expand button bigger
      - ✅ Refactor use 'useCustomModal' hook
      - ✅ Edit document modal style
      - Append search params to url ? (optional ?)
      */}
      <div style={{ marginTop: 16 }}>
        <SearchBox
          handleResetSearch={handleResetSearch}
          handleSearchProcurement={handleSearchProcurement}
          defaultContext={defaultContext}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <StatusBoxSection
          context={defaultContext}
          selectedStatus={selectedStatus}
          onChangeStatus={handleStatusChange}
          statusCounts={statusCounts}
          isLoadingCounts={isLoadingCounts}
        />
      </div>

      <div style={{ marginTop: 32, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStatus}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ProcurementOperationsTable
              data={tableData}
              loading={isTableLoading}
              handleDocumentLocationCellClick={handleDocumentLocationCellClick}
            />
            <div style={{ marginTop: 8 }}>
              <CustomPagination
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                currentPage={page}
                disabledPrevious={page === 1}
                disabledNext={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {documentLocationModalHook.isModalMounted && (
        <ApprovalRouteModal modalHook={documentLocationModalHook} selectedRecord={selectedRecord} />
      )}
    </>
  )
}

export default ProcurementOperationsPage
