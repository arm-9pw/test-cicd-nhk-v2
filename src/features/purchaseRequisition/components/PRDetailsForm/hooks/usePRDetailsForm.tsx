import { useEffect, useMemo, useRef } from 'react'

import { Form, FormInstance } from 'antd'

import { useGetCurrenciesQuery } from 'api/masterApi'
import { BudgetItemType } from 'api/prApi.types'

import { DropdownValueType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { PAGE_MODE } from 'constants/index'

// type BudgetItemTypeDropdown = {
//   budgetId: string
//   budgetCode: string
//   budgetSiteId: string
//   budgetSiteName: string
//   label: string
//   value: string
// }

type UsePRDetailsFormProps = {
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  prDetailsFormRef: FormInstance
  selectedCurrency?: DropdownValueType
  prSelectedBudget: BudgetItemType | null
  onExchangeRateChange: (source: number | null, destination: number | null) => void
  onSetSelectedCurrency: (value: DropdownValueType | undefined) => void
  onSetIsBCSDataOutdated: (value: boolean) => void
}

/**
 * Custom hook for managing PR Details Form logic
 *
 * Features:
 * 1. Handles exchange rate validation and changes
 * 2. Manages budget item options with default values
 * 3. Watches form values for exchange rates
 *
 * @param props Hook configuration options
 * @returns Form-related utilities and computed values
 */
const usePRDetailsForm = ({
  mode,
  prDetailsFormRef,
  selectedCurrency,
  // prSelectedBudget,
  onExchangeRateChange,
  onSetSelectedCurrency,
  onSetIsBCSDataOutdated,
}: UsePRDetailsFormProps) => {
  const { data: currencyList = [] } = useGetCurrenciesQuery()
  const renderCount = useRef(0)

  // Exchange rate requirement flag
  const isRequiredExchangeRate = !!selectedCurrency

  // Watch exchange rate fields
  const exchangeRateSource = Form.useWatch('exchangeRateSource', prDetailsFormRef)
  const exchangeRateDestination = Form.useWatch('exchangeRateDestination', prDetailsFormRef)

  // Update exchange rates when values change
  useEffect(() => {
    onExchangeRateChange(exchangeRateSource, exchangeRateDestination)

    if (renderCount.current <= 1) {
      // FIXME: use `renderCount <= 1`
      /* MAY'S NOTE: use `renderCount <= 1` because in PRODUCTION this effect will run `twice` for
      1. rendering things 
      2. setting default values, 
      and we only want to run setIsRequiredUpdateBCS only when everything is finished rendering and setting default values, 
      
      NOTE: This's not gonna work in DEVELOPMENT because of `strict mode` that runs this effect, by default twice, and the effect itself also runs twice
      that means `renderCount` value  always gonna be 2 or more, so the `setIsRequiredUpdateBCS(true)` will always run in DEVELOPMENT.
      But it's ok because production integrity is more important.
      */

      // Increment render count during the first mount
      renderCount.current += 1
      return // Skip running the effect
    }

    onSetIsBCSDataOutdated(true)
  }, [exchangeRateSource, exchangeRateDestination, onExchangeRateChange, onSetIsBCSDataOutdated])

  // Default budget options when items aren't yet fetched
  // const defaultBudgetItemOptions: BudgetItemTypeDropdown[] = useMemo(() => {
  //   if (prSelectedBudget) {
  //     return [
  //       {
  //         budgetId: prSelectedBudget.budgetId || '',
  //         budgetCode: prSelectedBudget.budgetCode || '',
  //         budgetSiteId: prSelectedBudget.budgetSiteId || '',
  //         budgetSiteName: prSelectedBudget.budgetSiteName || '',
  //         label: prSelectedBudget.budgetCode || '',
  //         value: prSelectedBudget.budgetId || '',
  //       },
  //     ]
  //   }
  //   return []
  // }, [prSelectedBudget])

  // Default Currency to be BAHT
  const defaultValue = useMemo(
    () => currencyList.find((currency) => currency.currencyName === 'THB'),
    [currencyList],
  )
  useEffect(() => {
    if (mode === PAGE_MODE.CREATE && defaultValue) {
      prDetailsFormRef.setFieldsValue({
        exchangeRateSource: 1,
        exchangeRateDestination: 1,
        currency: {
          value: defaultValue?.id,
          label: defaultValue?.currencyName,
        },
      })
      onSetSelectedCurrency({
        value: defaultValue?.id,
        label: defaultValue?.currencyName,
      })
    }
  }, [defaultValue, mode, prDetailsFormRef, onSetSelectedCurrency])

  return {
    isRequiredExchangeRate,
    // defaultBudgetItemOptions,
  }
}

export default usePRDetailsForm
