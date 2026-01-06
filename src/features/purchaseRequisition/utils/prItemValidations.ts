import { FormInstance } from 'antd'

import { BudgetItemType } from 'api/prApi.types'

import { PrItemType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

// Types for the validation function
export interface ValidationOptions {
  form: FormInstance
  prItemsList: PrItemType[]
  selectedBudget: BudgetItemType | null
  openNotification: (params: { title: string; description: string }) => void
  editingKey?: string
}

/**
 * Validates PR item form with common validation rules
 * @param options Validation options including form, items list, and selected budget
 * @returns Boolean indicating if validation passed
 */
export const validatePrItemForm = async ({
  form,
  prItemsList,
  selectedBudget,
  openNotification,
  editingKey,
}: ValidationOptions): Promise<boolean> => {
  /*
  STEP 1: Validate form fields
  STEP 2: Validate duplicate item in the same budget
  STEP 3: Validate unique budget must not exceed 3
  STEP 4: Validate the budget is selected
  */

  // Validate form fields
  try {
    await form.validateFields()
  } catch (validationError) {
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
    const isDuplicate = prItemsList.some(
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

  // Validate unique budget must not exceed 3
  const budgetIds = editingKey
    ? prItemsList.filter((item) => item.key !== editingKey).map((item) => item.budgetId)
    : prItemsList.map((item) => item.budgetId)

  if (selectedBudget?.budgetId) {
    budgetIds.push(selectedBudget.budgetId)
  }

  const uniqueBudgetIds = new Set(budgetIds)
  if (uniqueBudgetIds.size > 3) {
    openNotification({
      title: 'Budget Limit Exceeded',
      description: 'คุณสามารถเพิ่ม budget ได้สูงสุดแค่ 3 budgets เท่านั้น',
    })
    return false
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
