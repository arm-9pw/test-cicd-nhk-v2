import { FormInstance } from 'antd'

import { MainGroupType } from 'api/masterApi.types'
import { POItemType } from 'api/poApi.types'
import { BudgetItemType } from 'api/prApi.types'

import { MAIN_GROUP_CODE } from 'constants/index'

// Types for the validation function
export interface ValidationOptions {
  form: FormInstance
  poItemsList: POItemType[]
  selectedBudget: BudgetItemType | null
  selectedMainGroup: MainGroupType | null
  openNotification: (params: { title: string; description: string }) => void
  editingKey?: string
}

/**
 * Validates the PO item form
 * @param form The form instance to validate
 * @param poItemsList The current list of PO items
 * @param selectedBudget The selected budget item
 * @param openNotification Function to display notifications
 * @returns True if validation passes, false otherwise
 */
export const validatePoItemForm = async ({
  form,
  poItemsList,
  selectedBudget,
  selectedMainGroup,
  openNotification,
  editingKey,
}: ValidationOptions): Promise<boolean> => {
  /*
  STEP 1: Validate form fields
  STEP 2: Validate the unique budget
  2.1 if selectedMainGroup is Information System (mainGroupCode: "9"), General Admin (mainGroupCode: "8") cannot exceed 3
  2.2 if selectedMainGroup is not Information System, General Admin  cannot exceed 1
  STEP 3: Validate duplicate item in the same budget
  STEP 4: Validate the budget is selected
  */

  // Validate form fields
  try {
    await form.validateFields()
  } catch (validationError) {
    // Handle validation errors
    console.error('Validation Failed:', validationError)
    openNotification({
      title: 'Validation Error',
      description: 'Please check the form fields for errors.',
    })
    return false
  }

  // Validate if matCode is not null and matCode does not include "DUMMY", Cannot add duplicate matCode (in the same budget)
  const newMatCode = form.getFieldValue('matCode')
  const newBudgetId = selectedBudget?.budgetId
  if (newMatCode && !newMatCode.includes('DUMMY')) {
    const isDuplicate = poItemsList.some(
      (item) =>
        (editingKey ? item.key !== editingKey : true) &&
        item.matCode === newMatCode &&
        item.budgetId === newBudgetId,
    )
    if (isDuplicate) {
      openNotification({
        title: 'Duplicate Item/รายการซ้ำ',
        description: 'This item already exists in this budget.',
      })
      return false
    }
  }

  let newBudgets
  if (editingKey) {
    // Exclude the item being edited
    newBudgets = [...poItemsList.filter((item) => item.key !== editingKey), selectedBudget]
  } else {
    newBudgets = [...poItemsList, selectedBudget]
  }
  const uniqueBudgetIds = new Set(newBudgets.map((budget) => budget?.budgetId).filter(Boolean))

  if (
    selectedMainGroup?.mainGroupCode === MAIN_GROUP_CODE.INFORMATION_SYSTEM ||
    selectedMainGroup?.mainGroupCode === MAIN_GROUP_CODE.GENERAL_ADM
  ) {
    // Validate the unique budget cannot exceed 3
    if (uniqueBudgetIds.size > 3) {
      openNotification({
        title: 'Budget Limit Exceeded',
        description: 'คุณสามารถเพิ่ม budget ได้สูงสุดแค่ 3 budgets เท่านั้น',
      })
      return false
    }
  } else {
    // Validate the unique budget cannot exceed 1
    if (uniqueBudgetIds.size > 1) {
      openNotification({
        title: 'Budget Limit Exceeded',
        description: 'คุณสามารถเพิ่ม budget ได้สูงสุดแค่ 1 budget เท่านั้น',
      })
      return false
    }
  }

  // Ensure budget is selected
  if (!selectedBudget) {
    console.error('Budget is required')
    openNotification({
      title: 'Budget is required',
      description: 'Please select a budget.',
    })
    return false
  }

  return true
}

/**
 * Validates that unit discount does not exceed unit price
 * @param form The form instance to get values from
 * @returns Validation rule compatible with Ant Design Form
 */
export const validateUnitDiscountCannotExceedUnitPrice = (form: FormInstance) => {
  return {
    validator: (_: unknown, value: number) => {
      const unitPrice = form.getFieldValue('unitPrice')
      if (value > unitPrice) {
        return Promise.reject('Unit Discount cannot more than Unit Price')
      }
      return Promise.resolve()
    },
  }
}
