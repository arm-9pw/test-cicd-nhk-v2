import { useCallback, useEffect, useMemo, useState } from 'react'

import { Form } from 'antd'

import { MainGroupType } from 'api/masterApi.types'
import { POItemType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import { useNotification } from 'hooks/useNotification'

import { BudgetItemTypeDropdown } from 'features/purchaseRequisition/components/BudgetItemDropdown'
import { calculateNetTotal } from 'features/purchaseRequisition/components/PRItems/utils'

import { roundNumber } from 'utils/generalHelpers'

import { validatePoItemForm } from '../../../utils/poItemValidations'
import { PRListDropdownType } from '../../PRListDropdown'

type Props = {
  prList: PRListDropdownType[]
  isNotRefPR: boolean
  poItemsList: POItemType[]
  selectedBudget: BudgetItemType | null | undefined
  selectedMainGroup: MainGroupType | null
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setPoItemsGrandTotal: React.Dispatch<React.SetStateAction<number>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  updateBCSWithBudgetId: ({
    itemsList,
    budgetId,
  }: {
    budgetId: string
    itemsList: POItemType[]
  }) => Promise<void>
  updateMultipleBudgetBCS: (itemsList: POItemType[]) => Promise<void>
}

const usePOItems = ({
  prList = [],
  poItemsList,
  selectedBudget,
  selectedMainGroup,
  setPoItemsList,
  setPoItemsGrandTotal,
  updateBCSWithBudgetId,
  setBudgetControlSheetData,
  isNotRefPR,
  updateMultipleBudgetBCS,
}: Props) => {
  const [editFormRef] = Form.useForm()
  const [newItemFormRef] = Form.useForm()

  const { openNotification } = useNotification()

  const [editSelectedBudget, setEditSelectedBudget] = useState<BudgetItemType | null>(null)
  const [newSelectedBudget, setNewSelectedBudget] = useState<BudgetItemType | null>(null)
  const [editingKey, setEditingKey] = useState<string>('')

  const budgetListFromPR: BudgetItemTypeDropdown[] = useMemo(() => {
    if (!isNotRefPR) {
      const uniqueBudgetsMap = new Map<string | number, BudgetItemTypeDropdown>()

      const [prData] = prList
      const newList = [prData, ...poItemsList]

      newList.forEach((item) => {
        if (item?.budgetId) {
          uniqueBudgetsMap.set(item.budgetId, {
            value: item?.budgetId,
            label: item?.budgetCode ?? '',
            budgetId: item?.budgetId,
            budgetCode: item?.budgetCode ?? '',
            budgetSiteId: item?.budgetSiteId ?? '',
            budgetSiteName: item?.budgetSiteName ?? '',
          })
        }
      })

      return Array.from(uniqueBudgetsMap.values())
    } else return []
  }, [isNotRefPR, poItemsList, prList])

  const onSetNewSelectedBudget = useCallback(
    (budget: BudgetItemType | null) => {
      if (!budget) {
        newItemFormRef.resetFields(['budgetSiteId', 'budgetCode', 'budgetId', 'budgetSiteName'])
        setNewSelectedBudget(null)
        return
      }

      newItemFormRef.setFieldsValue({
        budgetSiteName: budget.organizationName || budget.budgetSiteName,
        budgetSiteId: budget.budgetSiteId,
        budgetCode: budget.budgetCode,
        budgetId: budget.budgetId,
      })
      setNewSelectedBudget({
        ...budget,
        budgetSiteName: budget.organizationName || budget.budgetSiteName,
      })
    },
    [newItemFormRef],
  )

  const handleAddNewItem = async () => {
    // Use the validation utility for common validations
    const isValid = await validatePoItemForm({
      form: newItemFormRef,
      poItemsList,
      selectedBudget: newSelectedBudget,
      openNotification,
      selectedMainGroup,
    })

    if (!isValid) return

    // If validation passes, proceed to gather values and update state
    const values = newItemFormRef.getFieldsValue()
    const netTotal = roundNumber(
      calculateNetTotal(values.qty, values.unitPrice, values.unitDiscount),
      2,
    )
    const newItem: POItemType = {
      ...values,
      budgetId: newSelectedBudget?.budgetId || '',
      budgetCode: newSelectedBudget?.budgetCode || '',
      budgetSiteId: newSelectedBudget?.budgetSiteId || '',
      budgetSiteName:
        newSelectedBudget?.organizationName || newSelectedBudget?.budgetSiteName || '',
      key: Date.now().toString(),
      netTotal,
    }
    const newItemsList = [...poItemsList, newItem]

    // FIXME: Add Update Budget Control Sheet
    updateBCSWithBudgetId({
      itemsList: newItemsList,
      budgetId: newSelectedBudget?.budgetId || '',
    })

    // Set the new item
    setPoItemsList(newItemsList)

    // Reset values
    newItemFormRef.resetFields([
      'name',
      'model',
      'brand',
      'detail',
      'qty',
      'unit',
      'unitPrice',
      'netTotal',
      'matCode',
    ])
    newItemFormRef.setFieldsValue({ unitDiscount: 0 })
    // setNewSelectedBudget(null)
  }

  const onSetEditSelectedBudget = useCallback(
    (budget: BudgetItemType) => {
      editFormRef.setFieldsValue({
        budgetSiteName: budget.organizationName || budget.budgetSiteName,
        budgetSiteId: budget.budgetSiteId,
        budgetCode: budget.budgetCode,
        budgetId: budget.budgetId,
      })
      setEditSelectedBudget(budget)
    },
    [editFormRef],
  )

  const onEditRecord = (record: POItemType) => {
    editFormRef.setFieldsValue({
      ...record,
    })
    if (record.budgetId) {
      onSetEditSelectedBudget({
        budgetSiteName: record.budgetSiteName,
        budgetSiteId: record.budgetSiteId,
        budgetId: record.budgetId,
        budgetCode: record.budgetCode,
      })
    }
    setEditingKey(record.key)
  }

  const isRecordBeingEdited = (record: POItemType) => record.key === editingKey

  const onCancelEditing = () => {
    setEditingKey('')
    editFormRef.resetFields()
  }

  const handleSaveEditedItem = async (key: string) => {
    // Use the validation utility for common validations
    const isValid = await validatePoItemForm({
      form: editFormRef,
      poItemsList,
      selectedBudget: editSelectedBudget,
      selectedMainGroup,
      openNotification,
      editingKey,
    })

    if (!isValid) return

    // If validation passes, proceed to gather values and update state
    const values = editFormRef.getFieldsValue()
    const newData = [...poItemsList]
    const index = newData.findIndex((item) => key === item.key)

    if (index === -1) {
      openNotification({
        title: 'Update Failed',
        description: 'Could not find the item to update.',
      })
      return
    }

    if (index > -1) {
      const netTotal = roundNumber(
        calculateNetTotal(values.qty, values.unitPrice, values.unitDiscount),
        2,
      )
      newData[index] = {
        ...newData[index],
        ...values,
        budgetId: editSelectedBudget?.budgetId || '',
        budgetCode: editSelectedBudget?.budgetCode || '',
        budgetSiteId: editSelectedBudget?.budgetSiteId || '',
        budgetSiteName:
          editSelectedBudget?.organizationName || editSelectedBudget?.budgetSiteName || '',
        netTotal,
      }

      // Update Budget Control Sheet
      const prevBudgetId = poItemsList[index].budgetId
      const newBudgetId = editSelectedBudget?.budgetId || ''
      if (prevBudgetId === newBudgetId) {
        updateBCSWithBudgetId({
          itemsList: newData,
          budgetId: newBudgetId,
        })
      } else {
        updateMultipleBudgetBCS(newData)
      }

      // Set the new item
      setPoItemsList(newData)

      // Reset values
      setEditingKey('')
      editFormRef.resetFields()

      // Reset the selected budget
      setEditSelectedBudget(null)
    }
  }

  const handleDeleteItem = (key: string) => {
    const selectedItem = poItemsList.find((item) => item.key === key)
    if (!selectedItem) {
      openNotification({
        title: 'Delete Failed',
        description: 'Could not find the item to delete.',
      })
      return
    }

    const newData = poItemsList.filter((item) => item.key !== key)
    setPoItemsList(newData)
    // Update Budget Control Sheet
    if (newData.length > 0) {
      updateMultipleBudgetBCS(newData)
    } else {
      // NOTE: Clear BCS
      setBudgetControlSheetData([])
    }
  }

  const updateGrandTotal = useCallback(
    (items: POItemType[]) => {
      const total = items.reduce((sum, item) => sum + (item.netTotal || 0), 0)
      setPoItemsGrandTotal(total)
    },
    [setPoItemsGrandTotal],
  )

  useEffect(() => {
    updateGrandTotal(poItemsList)
  }, [poItemsList, updateGrandTotal])

  useEffect(() => {
    if (isNotRefPR && selectedBudget) {
      onSetNewSelectedBudget(selectedBudget)
    } else {
      onSetNewSelectedBudget(null)
    }
  }, [selectedBudget, onSetNewSelectedBudget, isNotRefPR])

  return {
    editFormRef,
    newItemFormRef,
    editSelectedBudget,
    newSelectedBudget,
    onSetNewSelectedBudget,
    onSetEditSelectedBudget,
    handleAddNewItem,
    onEditRecord,
    isRecordBeingEdited,
    editingKey,
    onCancelEditing,
    handleSaveEditedItem,
    handleDeleteItem,
    budgetListFromPR,
  }
}

export default usePOItems
