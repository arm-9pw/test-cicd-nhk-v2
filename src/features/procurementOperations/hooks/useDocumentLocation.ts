import { useState } from 'react'

import { ProcurementOperation } from 'api/procurementApi.types'
import useCustomModal from 'hooks/useCustomModal'

const useDocumentLocation = () => {
  const documentLocationModalHook = useCustomModal()
  // const [documentNo, setDocumentNo] = useState('')
  // const [operationType, setOperationType] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<ProcurementOperation | null>(null)

  const handleDocumentLocationCellClick = async (record: ProcurementOperation) => {
    if (!record.documentNo) return
    setSelectedRecord(record)
    // setOperationType(record.operationType)
    // setDocumentNo(record.documentNo)
    documentLocationModalHook.showModal()
  }

  return {
    handleDocumentLocationCellClick,
    documentLocationModalHook,
    // documentNo,
    // operationType,
    selectedRecord,
  }
}

export default useDocumentLocation
