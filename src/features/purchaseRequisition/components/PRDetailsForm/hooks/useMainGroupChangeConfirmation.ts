import { useState } from 'react'
import { FormInstance } from 'antd'

import { PrBudgetControlSheetType } from 'api/prApi.types'
import useCustomModal from 'hooks/useCustomModal'

import {
  PRDetailsFormValuesType,
  PrItemType,
  mainGroupDropdownType,
} from '../../../PurchaseRequisitionPage.types'

interface UseMainGroupChangeConfirmationProps {
  prDetailsFormRef: FormInstance<PRDetailsFormValuesType>
  prItemsList: PrItemType[]
  selectedMainGroup: mainGroupDropdownType | null | undefined
  onSetMainGroup: (value: mainGroupDropdownType) => void
  onSetPrItemsList: (items: PrItemType[]) => void
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  setIsMultipleBudget: (value: boolean) => void
}

const useMainGroupChangeConfirmation = ({
  prDetailsFormRef,
  prItemsList,
  selectedMainGroup,
  onSetMainGroup,
  onSetPrItemsList,
  setBudgetControlSheetData,
  setIsMultipleBudget,
}: UseMainGroupChangeConfirmationProps) => {
  const mainGroupConfirmModal = useCustomModal()
  const [pendingMainGroup, setPendingMainGroup] = useState<mainGroupDropdownType | null>(null)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalMessage, setModalMessage] = useState<string>('')

  const isRestrictedMainGroup = (code: string) => ['8', '9'].includes(code)

  const needsConfirmation = (oldCode: string | undefined, newCode: string) => {
    if (prItemsList.length > 0) {
      if (!oldCode) return true

      return (
        (isRestrictedMainGroup(oldCode) && !isRestrictedMainGroup(newCode)) ||
        (!isRestrictedMainGroup(oldCode) && isRestrictedMainGroup(newCode))
      )
    }
    return false
  }

  const handleMainGroupChange = (value: mainGroupDropdownType) => {
    if (needsConfirmation(selectedMainGroup?.mainGroupCode, value.mainGroupCode)) {
      setPendingMainGroup(value)
      setModalTitle('คุณต้องการเปลี่ยน Main Group หรือไม่?')
      setModalMessage(
        'หากคุณเปลี่ยน Main Group, Items และ Budget Control Sheet ที่มีอยู่จะถูกลบ คุณต้องการเปลี่ยน Main Group หรือไม่?',
      )
      mainGroupConfirmModal.showModal()
      return
    }
    onSetMainGroup(value)
  }

  const handleConfirmMainGroup = () => {
    if (pendingMainGroup) {
      onSetMainGroup(pendingMainGroup)
      setPendingMainGroup(null)
      onSetPrItemsList([])
      setBudgetControlSheetData([])
      setIsMultipleBudget(false)
    }
    mainGroupConfirmModal.handleOk()
  }

  const handleCancelMainGroup = () => {
    if (selectedMainGroup) {
      prDetailsFormRef.setFieldsValue({ mainGroup: selectedMainGroup })
    } else {
      prDetailsFormRef.resetFields(['mainGroup'])
    }
    setPendingMainGroup(null)
    mainGroupConfirmModal.handleCancel()
  }

  return {
    modalMessage,
    modalTitle,
    handleMainGroupChange,
    mainGroupConfirmModal,
    handleConfirmMainGroup,
    handleCancelMainGroup,
  }
}

export default useMainGroupChangeConfirmation 