import { useEffect } from 'react'

import { uniqueBudgetItemType, useCalculateMultipleBCSMutation } from 'api/budgetApi'
import { POItemType } from 'api/poApi.types'
import { PrBudgetControlSheetType } from 'api/prApi.types'
import { useNotification } from 'hooks/useNotification'

type Props = {
  poItemsList: POItemType[]
  budgetControlSheetData: PrBudgetControlSheetType[]
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  setIsRequiredUpdateBCS: React.Dispatch<React.SetStateAction<boolean>>
  setIsLoadingBCS: React.Dispatch<React.SetStateAction<boolean>>
  getAmountForBCS: (amount: number) => number
  prId?: string | null
  poId?: string | null
}

const useManageBCS = ({
  poItemsList,
  getAmountForBCS,
  setIsRequiredUpdateBCS,
  setIsLoadingBCS,
  // budgetControlSheetData,
  setBudgetControlSheetData,
  prId,
  poId,
}: Props) => {
  const [updateMultipleBCS, { isLoading, isError }] = useCalculateMultipleBCSMutation()
  const { openNotification } = useNotification()

  useEffect(() => {
    // If there is an error, need to force user to update BCS again
    if (isError) {
      setIsRequiredUpdateBCS(true)
    }
  }, [isError, setIsRequiredUpdateBCS])

  useEffect(() => {
    // from isLoadingBCS, will disable save/submit button
    setIsLoadingBCS(isLoading)
  }, [isLoading, setIsLoadingBCS])

  // useEffect(() => {
  //   if (data) {
  //     setBudgetControlSheetData((prev) => {
  //       // Create a map of existing data for quick lookup
  //       const existingDataMap = new Map(prev.map((item) => [item.budgetId, item]))

  //       // Update or add new data
  //       data.forEach((newItem) => {
  //         existingDataMap.set(newItem.budgetId, newItem)
  //       })

  //       // Convert map back to array
  //       return Array.from(existingDataMap.values())
  //     })
  //   }
  // }, [data, setBudgetControlSheetData])

  const _onSetBudgetControlSheetData = (data: PrBudgetControlSheetType[]) => {
    if (data) {
      setBudgetControlSheetData((prev) => {
        // Create a map of existing data for quick lookup
        const existingDataMap = new Map(prev.map((item) => [item.budgetId, item]))

        // Update or add new data
        data.forEach((newItem) => {
          existingDataMap.set(newItem.budgetId, newItem)
        })

        // Convert map back to array
        return Array.from(existingDataMap.values())
      })
    }
  }

  const _getUniqueBudget = (itemsList: POItemType[], _prId?: string | null) => {
    const budgetMap = new Map<
      string,
      {
        budgetSiteId: string
        budgetId: string
        thisOrderAmount: number // accumulate raw netTotal
      }
    >()

    itemsList.forEach((item) => {
      const key = item.budgetId
      const existing = budgetMap.get(key)

      if (existing) {
        existing.thisOrderAmount += item.netTotal
      } else {
        budgetMap.set(key, {
          budgetSiteId: item.budgetSiteId,
          budgetId: item.budgetId,
          thisOrderAmount: item.netTotal,
        })
      }
    })

    // Convert summed netTotal to Baht after the loop
    return Array.from(budgetMap.values()).map((entry) => ({
      ...entry,
      thisOrderAmount: getAmountForBCS(entry.thisOrderAmount),
      purchaseRequisitionId: _prId || prId,
      purchaseOrderId: poId || null,
    }))
  }

  const updateMultipleBudgetBCS = async (itemsList: POItemType[], prId?: string | null) => {
    const uniqueBudget = _getUniqueBudget(itemsList, prId)

    if (uniqueBudget.length > 0) {
      const data = await _requestCalculateBCS(uniqueBudget)
      setBudgetControlSheetData(data || [])
    } else {
      openNotification({
        type: 'warning',
        title: 'Notice',
        description: 'No budget control sheet to update.',
      })
    }
  }

  const refetchBCS = async () => {
    try {
      const uniqueBudget = _getUniqueBudget(poItemsList)

      if (uniqueBudget.length > 0) {
        const data = await _requestCalculateBCS(uniqueBudget)
        setBudgetControlSheetData(data || [])
      }
      setIsRequiredUpdateBCS(false)
    } catch (error) {
      console.error('Error updating BCS:', error)
      openNotification({
        type: 'error',
        title: 'Error Updating Budget Control Sheet',
        description: 'Please try again.',
      })
    }
  }

  const _requestCalculateBCS = async (uniqueBudget: uniqueBudgetItemType[]) => {
    try {
      return await updateMultipleBCS(uniqueBudget)
        .unwrap()
        .catch((error) => {
          console.error('Error updating BCS:', error)
          return Promise.reject(error) // Propagate the error to the caller
        })
    } catch (error) {
      console.error('Error updating BCS:', error)
      return Promise.reject(error) // Propagate the error to the caller
    }
  }

  const updateBCSWithBudgetId = async ({
    itemsList,
    budgetId,
  }: {
    budgetId: string
    itemsList: POItemType[]
  }) => {
    try {
      const uniqueBudget = _getUniqueBudget(itemsList)
      const filteredBudget = uniqueBudget.filter((item) => item.budgetId === budgetId)
      const data = await _requestCalculateBCS(filteredBudget)
      _onSetBudgetControlSheetData(data)
    } catch (error) {
      console.error('Error updating BCS:', error)
      openNotification({
        type: 'error',
        title: 'Error Updating Budget Control Sheet',
        description: 'Please try again.',
      })
    }
  }

  return {
    updateBCSWithBudgetId,
    updateMultipleBudgetBCS,
    refetchBCS,
  }
}

export default useManageBCS
