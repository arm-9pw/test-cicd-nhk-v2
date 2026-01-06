import { useState } from 'react'

import { FormInstance } from 'antd'

import { POItemType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import useCustomModal from 'hooks/useCustomModal'

import { DropdownValueType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

type Props = {
  formRef: FormInstance
  isNotRefPR: boolean
  poItemsList: POItemType[]
  selectedBudgetType: DropdownValueType | undefined
  selectedBudget: BudgetItemType | null | undefined
  onSelectBudget: (value: BudgetItemType | null) => void
  setSelectedBudgetType: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  setSelectedBudget: React.Dispatch<React.SetStateAction<BudgetItemType | null | undefined>>
}

const useBudgetChangeConfirmation = ({
  formRef,
  isNotRefPR,
  poItemsList,
  onSelectBudget,
  setSelectedBudgetType,
  setPoItemsList,
  setBudgetControlSheetData,
  setSelectedBudget,
  selectedBudgetType,
  selectedBudget,
}: Props) => {
  const budgetConfirmModal = useCustomModal()
  const [pendingBudget, setPendingBudget] = useState<BudgetItemType | null>(null)
  const [pendingBudgetType, setPendingBudgetType] = useState<DropdownValueType | null>(null)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalMessage, setModalMessage] = useState<string>('')

  const handleBudgetChange = (value: BudgetItemType) => {
    if (isNotRefPR && poItemsList.length > 0) {
      // Store the budget for later use if confirmed
      setPendingBudget(value)

      // Set custom messages for budget code change
      setModalTitle('คุณต้องการเปลี่ยน Budget Code หรือไม่?')
      setModalMessage(
        'หากคุณเปลี่ยน Budget Code, Items Budget Control Sheet ที่มีอยู่จะถูกลบ คุณต้องการเปลี่ยน Budget Code หรือไม่?',
      )
      budgetConfirmModal.showModal()
      return
    }

    onSelectBudget(value)
  }

  const handleBudgetTypeChange = (value: DropdownValueType) => {
    if (!isNotRefPR) {
      // Set selected budget type
      setSelectedBudgetType(value)
      return
    }

    if (isNotRefPR && poItemsList.length > 0) {
      // Store the budget type for later use if confirmed
      setPendingBudgetType(value)

      // Set custom messages for budget type change
      setModalTitle('คุณต้องการเปลี่ยนชนิดงบประมาณหรือไม่?')
      setModalMessage(
        'หากคุณเปลี่ยนชนิดงบประมาณ, Items และ Budget Control Sheet ที่มีอยู่จะถูกลบ คุณต้องการเปลี่ยนชนิดงบประมาณหรือไม่?',
      )
      budgetConfirmModal.showModal()
      return
    }

    resetBudgetCode(value)
  }

  const handleConfirmBudget = () => {
    if (pendingBudget) {
      onSelectBudget(pendingBudget)
      setPendingBudget(null)
      // Reset prItemsList
      setPoItemsList([])
      // Reset BCS
      setBudgetControlSheetData([])
    } else if (pendingBudgetType) {
      // Set selected budget type
      resetBudgetCode(pendingBudgetType)
    }
    budgetConfirmModal.handleOk()
  }

  const handleCancelBudget = () => {
    // NOTE: Handle cancel budget type
    // If there was a pending budget type, reset the form field
    if (pendingBudgetType) {
      // Reset to previous budget type
      formRef.setFieldsValue({ budgetType: selectedBudgetType })
    } else {
      // NOTE: Handle cancel budget
      if (selectedBudget) {
        formRef.setFieldsValue({
          budgetCode: selectedBudget.budgetCode,
          budgetId: selectedBudget.budgetId,
        })
      } else {
        formRef.resetFields(['budgetCode', 'budgetId'])
      }
    }
    setPendingBudgetType(null)
    setPendingBudget(null)
    budgetConfirmModal.handleCancel()
  }

  const resetBudgetCode = (budgetType: DropdownValueType) => {
    // Set selected budget type
    setSelectedBudgetType(budgetType)
    // Reset pending budget type
    setPendingBudgetType(null)
    // Reset budget code
    setSelectedBudget(null)
    // Reset Items
    setPoItemsList([])
    // Reset budget control sheet
    setBudgetControlSheetData([])
  }

  return {
    modalMessage,
    modalTitle,
    handleBudgetChange,
    budgetConfirmModal,
    handleBudgetTypeChange,
    handleCancelBudget,
    handleConfirmBudget,
  }
}

export default useBudgetChangeConfirmation
