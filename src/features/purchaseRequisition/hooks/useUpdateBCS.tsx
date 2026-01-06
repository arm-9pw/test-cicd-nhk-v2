import { useCallback, useEffect } from 'react'

import { uniqueBudgetItemType, useCalculateMultipleBCSMutation } from 'api/budgetApi'
import { useLazyGetCalculatedBCSQuery } from 'api/prApi'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import { useNotification } from 'hooks/useNotification'

import { PrItemType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { convertCurrencyToBaht } from 'utils/generalHelpers'

export type updateBCSParams = {
  selectedBudget: BudgetItemType
  prItemsList: PrItemType[]
}

type useUpdateBCSProps = {
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  exchangeRateSource: number | null
  exchangeRateDestination: number | null
  prItemsList: PrItemType[]
  onSetIsBCSDataOutdated: (value: boolean) => void
  prId?: string
}

const useUpdateBCS = ({
  setBudgetControlSheetData,
  exchangeRateSource,
  exchangeRateDestination,
  prItemsList,
  onSetIsBCSDataOutdated,
  prId,
}: useUpdateBCSProps) => {
  const { openNotification } = useNotification()
  const [
    triggerCalculateBCS,
    { isError: isErrorCalculatedBCS, isLoading: isLoadingCalculatedBCS },
  ] = useLazyGetCalculatedBCSQuery()
  const [updateMultipleBCS, { isError: isErrorMultipleBCS, isLoading: isLoadingMultipleBCS }] =
    useCalculateMultipleBCSMutation()

  const onSetNewBSCData = useCallback(
    (data: PrBudgetControlSheetType[] | undefined) => {
      if (!data || data.length === 0) {
        return
      }
      setBudgetControlSheetData((prevData) => {
        const updatedData = [...prevData]
        data.forEach((newData) => {
          const existingIndex = updatedData.findIndex((item) => item.budgetId === newData.budgetId)

          if (existingIndex !== -1) {
            // Replace existing item
            updatedData[existingIndex] = newData
          } else {
            // Add new item
            updatedData.push(newData)
          }
        })
        return updatedData
      })
    },
    [setBudgetControlSheetData],
  )

  useEffect(() => {
    const hasError = isErrorCalculatedBCS || isErrorMultipleBCS
    if (hasError) {
      onSetIsBCSDataOutdated(true)
    }
  }, [isErrorCalculatedBCS, isErrorMultipleBCS, onSetIsBCSDataOutdated])

  const calculateTotalNetAmount = ({
    items,
    budgetId,
  }: {
    items: PrItemType[]
    budgetId: string
  }): number => {
    return items
      .filter((item) => item.budgetId === budgetId)
      .reduce((sum, item) => sum + item.netTotal, 0)
  }

  const getAmountForBCS = (amount: number): number => {
    return exchangeRateSource && exchangeRateDestination
      ? convertCurrencyToBaht({
          amount,
          exchangeRateSource,
          exchangeRateDestination,
        })
      : 0
  }

  const updateBCS = async ({ selectedBudget, prItemsList }: updateBCSParams) => {
    if (prItemsList.length <= 0) {
      setBudgetControlSheetData([])
      return
    }

    const totalNetAmount = calculateTotalNetAmount({
      items: prItemsList,
      budgetId: selectedBudget.budgetId,
    })
    const monetaryBaht = getAmountForBCS(totalNetAmount)

    if (!selectedBudget.budgetSiteId) {
      throw new Error('Selected budget does not have budgetSiteId')
    }

    const params = {
      budgetSiteId: selectedBudget.budgetSiteId,
      budgetId: selectedBudget.budgetId,
      thisOrderAmount: monetaryBaht,
    }

    const data = await triggerCalculateBCS({ ...params, purchaseRequisitionId: prId })
      .unwrap()
      .catch((error) => {
        console.error('Error triggering BCS calculation:', error)
        return Promise.reject(error) // Propagate the error to the caller
      })
    onSetNewBSCData(data)
  }

  const getUniqueBudget = (itemsList: PrItemType[]) => {
    const budgetMap = new Map<
      string,
      {
        budgetSiteId: string
        budgetId: string
        thisOrderAmount: number
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

    return Array.from(budgetMap.values()).map((entry) => ({
      ...entry,
      thisOrderAmount: getAmountForBCS(entry.thisOrderAmount),
      purchaseRequisitionId: prId,
    }))
  }

  const requestCalculateBCS = async (uniqueBudget: uniqueBudgetItemType[]) => {
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

  const refetchBCS = async (itemsList?: PrItemType[]) => {
    try {
      const uniqueBudget = getUniqueBudget(itemsList ? itemsList : prItemsList)
      if (uniqueBudget.length > 0) {
        const data = await requestCalculateBCS(uniqueBudget)
        setBudgetControlSheetData(data)
      } else {
        openNotification({
          type: 'warning',
          title: 'Notice',
          description: 'No budget control sheet to update.',
        })
      }

      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Budget control sheet updated successfully.',
      })
      onSetIsBCSDataOutdated(false)
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
    updateBCS,
    refetchBCS,
    isLoadingBCS: isLoadingCalculatedBCS || isLoadingMultipleBCS,
  }
}

export default useUpdateBCS
