import { useCallback, useEffect } from 'react'

import { FormInstance } from 'antd'
import dayjs from 'dayjs'

import { useGetPrByIdQuery } from 'api/prApi'
import {
  BudgetItemType,
  PrBudgetControlSheetType,
  PurchaseRequisitionRespType,
} from 'api/prApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import { useNotification } from 'hooks/useNotification'

import {
  PRAttachmentDataType,
  PrItemType,
  mainGroupDropdownType,
} from '../PurchaseRequisitionPage.types'

interface UseGetPRProps {
  id?: string
  prDetailsFormRef: FormInstance
  prPurchasingInchargeFormRef: FormInstance
  prBCSFormRef: FormInstance
  onBudgetTypeChange: (value: { value: string; label: string }) => void
  onSetSelectedCurrency: (value: { value: string; label: string }) => void
  onSetPrSelectedBudget: (budget: BudgetItemType | null) => void
  onSetIsMultipleBudget: (value: boolean) => void
  onSetPrItemsList: (value: PrItemType[]) => void
  onSetPrItemsGrandTotal: (value: number) => void
  onSetDocumentList: (value: PRAttachmentDataType[]) => void
  onSetBudgetControlSheetData: (value: PrBudgetControlSheetType[]) => void
  onSetMainGroup: (value: mainGroupDropdownType) => void
  setPrData: (value: PurchaseRequisitionRespType) => void
}

const useGetPR = ({
  id,
  prDetailsFormRef,
  prPurchasingInchargeFormRef,
  prBCSFormRef,
  onBudgetTypeChange,
  onSetSelectedCurrency,
  onSetPrSelectedBudget,
  onSetIsMultipleBudget,
  onSetPrItemsList,
  onSetPrItemsGrandTotal,
  onSetDocumentList,
  onSetBudgetControlSheetData,
  onSetMainGroup,
  setPrData,
}: UseGetPRProps) => {
  const dispatch = useAppDispatch()
  const { openNotification } = useNotification()
  const { data: prData, error, isLoading, isFetching } = useGetPrByIdQuery(id || '', { skip: !id })

  const populatePRData = useCallback(
    (response: PurchaseRequisitionRespType) => {
      if (response) {
        // PR Data
        setPrData(response)
        // PR Detail Form
        prDetailsFormRef.setFieldsValue({
          mainGroup: {
            value: response.mainGroupId,
            label: response.mainGroupName,
          },
          requiredDate: dayjs(response.requireDate),
          budgetType: {
            value: response.budgetTypeId,
            label: response.budgetTypeName,
          },
          line: response.line,
          purpose: response.purpose,
          exchangeRateSource: response.exchangeRateSource,
          exchangeRateDestination: response.exchangeRateDestination,
          currency: {
            value: response.currencyId,
            label: response.currencyName,
          },
          isImport: response.isImport,
          jobName: response.jobName,
          budgetDescription: response.budgetDescription,
          remarkItem: response.remarkItem,
          budgetId: response.budgetId,
        })

        onBudgetTypeChange({
          value: response.budgetTypeId,
          label: response.budgetTypeName,
        })
        onSetSelectedCurrency({
          value: response.currencyId,
          label: response.currencyName,
        })
        onSetPrSelectedBudget({
          budgetId: response.budgetId,
          budgetCode: response.budgetCode,
          budgetSiteId: response.budgetSiteId,
          budgetSiteName: response.budgetSiteName,
          subBudgetCode: response.subBudgetCode,
          budgetDescription: response.budgetDescription,
          assetType: response.assetType || undefined,
          budgetYear: response.budgetYear || undefined,
        })

        // PR Items Table
        onSetIsMultipleBudget(response.isMultipleBudget)
        onSetPrItemsList(
          response.purchaseRequisitionItems
            ? response.purchaseRequisitionItems.map((item) => {
                return { ...item, key: item.id?.toString() || Date.now().toString() }
              })
            : [],
        )
        onSetPrItemsGrandTotal(response.itemGrandTotal)
        // PR Attachment
        onSetDocumentList(
          response.documentAttachFiles
            ? response.documentAttachFiles.map((item) => {
                return {
                  ...item,
                  key: item.id?.toString() || Date.now().toString(),
                }
              })
            : [],
        )
        // Purchase Incharge
        onSetMainGroup({
          id: response.mainGroupId,
          mainGroupCode: response.mainGroupCode,
          mainGroupName: response.mainGroupName,
          value: response.mainGroupId,
          label: response.mainGroupName,
        })
        prPurchasingInchargeFormRef.setFieldsValue({
          documentRoute: response.documentRoute,
          purchaseInchargeSection: {
            value: response.purchaseInChargeSectionId,
            label: response.purchaseInChargeSectionName,
          },
        })

        // PR Budget Control Sheet
        prBCSFormRef.setFieldsValue({
          budgetControlSheetRemark: response.budgetControlSheetRemark,
        })
        onSetBudgetControlSheetData(response.purchaseRequisitionBudgetControlSheets)
      }
    },
    [
      onBudgetTypeChange,
      onSetDocumentList,
      onSetPrItemsGrandTotal,
      onSetPrItemsList,
      onSetSelectedCurrency,
      onSetPrSelectedBudget,
      onSetBudgetControlSheetData,
      onSetIsMultipleBudget,
      onSetMainGroup,
      prDetailsFormRef,
      prPurchasingInchargeFormRef,
      prBCSFormRef,
      setPrData,
    ],
  )

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoading())
    } else {
      dispatch(hideLoading())
    }
  }, [isLoading, dispatch])

  useEffect(() => {
    if (error) {
      console.error('Failed to get PR:', error)
      openNotification({
        title: 'Failed to Get PR.',
        description: 'Please try again later.',
      })
    }
  }, [error, openNotification])

  useEffect(() => {
    if (prData) {
      populatePRData(prData)
    }
  }, [prData, populatePRData])

  return {
    isFetchingPR: isFetching,
  }
}

export default useGetPR
