import React from 'react'

import { FormInstance } from 'antd'

import { BudgetItemType } from 'api/prApi.types'
import { PrBudgetControlSheetType } from 'api/prApi.types'
import useCustomModal from 'hooks/useCustomModal'

import {
  DropdownValueType,
  PrItemType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

/**
 * Custom hook for budget selection validation with confirmation
 * Handles the logic for confirming budget and budget type changes
 */
const useBudgetChangeConfirmation = ({
  budgetModalHook,
  prItemsList,
  onSetPrSelectedBudget,
  onSetPrItemsList,
  setBudgetControlSheetData,
  onBudgetTypeChange,
  prDetailsFormRef,
  selectedBudgetType,
  prSelectedBudget,
}: {
  prSelectedBudget: BudgetItemType | null | undefined
  budgetModalHook: ReturnType<typeof useCustomModal>
  prItemsList: PrItemType[]
  onSetPrSelectedBudget: (budget: BudgetItemType | null) => void
  onSetPrItemsList: (items: PrItemType[]) => void
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  onBudgetTypeChange: (value: DropdownValueType) => void
  prDetailsFormRef: FormInstance
  selectedBudgetType?: DropdownValueType
}) => {
  const [pendingBudget, setPendingBudget] = React.useState<BudgetItemType | null>(null)
  const [pendingBudgetType, setPendingBudgetType] = React.useState<DropdownValueType | null>(null)
  const [modalTitle, setModalTitle] = React.useState<string>('')
  const [modalMessage, setModalMessage] = React.useState<string>('')

  // Budget code change message
  const budgetCodeMessage =
    'หากคุณเปลี่ยน Budget Code, Items Budget Control Sheet ที่มีอยู่จะถูกลบ คุณต้องการเปลี่ยน Budget Code หรือไม่?'

  // Budget type change message
  const budgetTypeMessage =
    'หากคุณเปลี่ยนชนิดงบประมาณ Budget Code, Items และ Budget Control Sheet ที่มีอยู่จะถูกลบ คุณต้องการเปลี่ยนชนิดงบประมาณหรือไม่?'

  // Function to validate budget before setting it
  const handleBudgetSelection = (budget: BudgetItemType) => {
    if (prItemsList.length > 0) {
      // Store the budget for later use if confirmed
      setPendingBudget(budget)

      // Set custom messages for budget code change
      setModalTitle('คุณต้องการเปลี่ยน Budget Code หรือไม่?')
      setModalMessage(budgetCodeMessage)

      // Show confirmation modal
      budgetModalHook.showModal()
      return
    }

    // If validation passes, call the original function
    onSetPrSelectedBudget(budget)
  }

  const handleConfirmBudget = () => {
    if (pendingBudget) {
      // If user confirms, proceed with the budget selection
      onSetPrSelectedBudget(pendingBudget)

      // Reset pending budget
      setPendingBudget(null)
      // Reset prItemsList
      onSetPrItemsList([])
      // Reset BCS
      setBudgetControlSheetData([])
    } else if (pendingBudgetType) {
      // If user confirms, proceed with the budget type selection
      _resetBudgetCode(pendingBudgetType)
    }
    budgetModalHook.handleOk()
  }

  const handleCancelBudget = () => {
    // NOTE: Handle cancel budget type
    // If there was a pending budget type, reset the form field
    if (pendingBudgetType) {
      // Reset to previous budget type
      prDetailsFormRef.setFieldsValue({ budgetType: selectedBudgetType })
    } else {
      // NOTE: Handle cancel budget
      if (prSelectedBudget) {
        prDetailsFormRef.setFieldsValue({
          budgetCode: prSelectedBudget,
        })
      } else {
        prDetailsFormRef.resetFields(['budgetCode'])
      }
    }
    setPendingBudget(null)
    setPendingBudgetType(null)
    budgetModalHook.handleCancel()
  }

  const handleBudgetTypeChange = (value: DropdownValueType) => {
    if (prItemsList.length > 0) {
      // Show confirmation modal
      setPendingBudgetType(value)

      // Set custom messages for budget type change
      setModalTitle('คุณต้องการเปลี่ยนชนิดงบประมาณหรือไม่?')
      setModalMessage(budgetTypeMessage)

      budgetModalHook.showModal()
      return
    }

    // If validation passes, call the original function
    _resetBudgetCode(value)
  }

  const _resetBudgetCode = (budgetType: DropdownValueType) => {
    // Set selected budget type
    onBudgetTypeChange(budgetType)
    // Reset pending budget type
    setPendingBudgetType(null)
    // Reset budget code
    onSetPrSelectedBudget(null)
    // Reset Items
    onSetPrItemsList([])
    // Reset budget control sheet
    setBudgetControlSheetData([])
  }

  return {
    pendingBudget,
    pendingBudgetType,
    modalTitle,
    modalMessage,
    handleBudgetSelection,
    handleConfirmBudget,
    handleCancelBudget,
    handleBudgetTypeChange,
  }
}

export default useBudgetChangeConfirmation
