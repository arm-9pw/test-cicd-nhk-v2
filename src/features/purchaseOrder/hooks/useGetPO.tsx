import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { FormInstance } from 'antd'

import { MainGroupType, SupplierType } from 'api/masterApi.types'
import { useGetPoByIdQuery } from 'api/poApi'
import { POItemType, PRListDTORespType, PurchaseOrderRespType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import { useNotification } from 'hooks/useNotification'

import {
  DropdownValueType,
  ExchangeRateType,
  PRAttachmentDataType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { getDateFromString } from 'utils/dateHelpers'

import { PRListDropdownType } from '../components/PRListDropdown'

type Props = {
  poId?: string
  poDetailsFormRef: FormInstance
  supplierDetailsFormRef: FormInstance
  poItemsFormRef: FormInstance
  poBCSFormRef: FormInstance
  setPrList: React.Dispatch<React.SetStateAction<PRListDropdownType[]>>
  setSelectedCurrency: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setSelectedBudgetType: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setIsNotRefPR: React.Dispatch<React.SetStateAction<boolean>>
  setExchangeRates: React.Dispatch<React.SetStateAction<ExchangeRateType>>
  setSelectedBudget: React.Dispatch<React.SetStateAction<BudgetItemType | null | undefined>>
  setIsShowPaymentDesc: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedSupplier: React.Dispatch<React.SetStateAction<SupplierType | undefined>>
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setVatPercentage: React.Dispatch<React.SetStateAction<number>>
  setPoItemsGrandTotal: React.Dispatch<React.SetStateAction<number>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  setPoData: React.Dispatch<React.SetStateAction<PurchaseOrderRespType | null>>
  setPoAttachmentsList: React.Dispatch<React.SetStateAction<PRAttachmentDataType[]>>
  setSelectedMainGroup: React.Dispatch<React.SetStateAction<MainGroupType | null>>
}

const useGetPO = ({
  poId: propPoId,
  poDetailsFormRef,
  supplierDetailsFormRef,
  poItemsFormRef,
  poBCSFormRef,
  setPrList,
  setSelectedCurrency,
  setSelectedBudgetType,
  setIsNotRefPR,
  setExchangeRates,
  setSelectedBudget,
  setIsShowPaymentDesc,
  setSelectedSupplier,
  setPoItemsList,
  setVatPercentage,
  setPoItemsGrandTotal,
  setBudgetControlSheetData,
  setPoData,
  setPoAttachmentsList,
  setSelectedMainGroup,
}: Props) => {
  const dispatch = useAppDispatch()
  const { id: paramId } = useParams()
  const poId = propPoId || paramId

  const { openNotification } = useNotification()
  const {
    data: poData,
    error,
    isLoading,
    isFetching,
  } = useGetPoByIdQuery(poId ?? '', {
    skip: !poId,
  })

  const populatePODetailsForm = useCallback(
    (data: PurchaseOrderRespType) => {
      // PO Detail State
      setPrList(
        data.purchaseRequisitions?.map((pr: PRListDTORespType) => ({
          ...pr,
          value: pr.id,
          label: pr.prNo,
          key: pr.id,
        })),
      )
      setSelectedBudgetType({ value: data.budgetTypeId ?? '', label: data.budgetTypeName ?? '' })
      setIsNotRefPR(!data.isReferPr)
      setSelectedCurrency({ value: data.currencyId, label: data.currencyName })
      setExchangeRates({
        source: data.exchangeRateSource,
        destination: data.exchangeRateDestination,
      })
      setSelectedBudget({
        budgetDescription: data.budgetDescription,
        budgetCode: data.budgetCode,
        budgetId: data.budgetId,
        budgetSiteId: '', // NOTE: There is no budget site id return with API
        assetType: data.assetType || '',
      })
      setSelectedMainGroup({
        id: data.mainGroupId,
        mainGroupCode: data.mainGroupCode,
        mainGroupName: data.mainGroupName,
        mainGroupDetail: '',
      })

      // PO Detail Form
      poDetailsFormRef.setFieldsValue({
        jobName: data.jobName,
        mainGroup: {
          value: data.mainGroupId,
          label: data.mainGroupName,
        },
        budgetType: {
          value: data.budgetTypeId,
          label: data.budgetTypeName,
        },
        siteInvoice: {
          value: data.siteInvoiceTaxId,
          label: data.siteInvoiceTaxName,
        },
        deliveryDate: getDateFromString(data.deliveryDate),
        siteDelivery: {
          value: data.siteDeliveryId,
          label: data.siteDeliveryName,
        },
        budgetCode: data.budgetCode,
        budgetId: data.budgetId,
        budgetDescription: data.budgetDescription,
        isImport: data.isImport,
        incoterm: data.incoterm,
        currency: {
          value: data.currencyId,
          label: data.currencyName,
        },
        exchangeRateSource: data.exchangeRateSource,
        exchangeRateDestination: data.exchangeRateDestination,
      })
    },
    [
      setPrList,
      setSelectedCurrency,
      setSelectedBudgetType,
      setExchangeRates,
      poDetailsFormRef,
      setIsNotRefPR,
      setSelectedBudget,
      setSelectedMainGroup,
    ],
  )

  const populateSupplierDetailsForm = useCallback(
    (data: PurchaseOrderRespType) => {
      // Supplier Detail Form
      setIsShowPaymentDesc(data.isShowDescription)
      setSelectedSupplier({
        id: data.supplierId,
        supplierName: data.supplierName,
        supplierCode: data.supplierCode,
        supplierAddress: data.supplierAddress,
        supplierTelephone: data.supplierTelephone,
        supplierEmail: data.supplierEmail ?? '',
        supplierAttention: data.supplierAttention,
        supplierPosition: data.supplierAttentionPosition,
        supplierCondition: data.supplierCondition,
        paymentTermId: data.paymentTermId ?? '',
        paymentTermName: data.paymentTermName ?? '',
        paymentTermDescription: data.paymentTermDescription,
        isShowDescription: data.isShowDescription,
        taxId: data.supplierTaxId ?? null,
      })
      supplierDetailsFormRef.setFieldsValue({
        supplierId: data.supplierId,
        supplierName: data.supplierName,
        supplierCode: data.supplierCode,
        supplierAttention: data.supplierAttention,
        supplierAttentionPosition: data.supplierAttentionPosition,
        supplierAddress: data.supplierAddress,
        supplierTelephone: data.supplierTelephone,
        supplierEmail: data.supplierEmail,
        supplierCondition: data.supplierCondition,
        paymentTerm: { value: data.paymentTermId, label: data.paymentTermName || '' },
        paymentTermDescription: data.paymentTermDescription,
        firstSupplier: {
          value: data.firstSupplierId,
          label:
            data.firstSupplierCode + (data.firstSupplierName ? ' - ' + data.firstSupplierName : ''),
          id: data.firstSupplierId,
          firstSupplierName: data.firstSupplierName,
          firstSupplierCode: data.firstSupplierCode,
        },
        firstSupplierId: data.firstSupplierId,
        firstSupplierName: data.firstSupplierName,
        firstSupplierCode: data.firstSupplierCode,
        firstSupplierPrice: data.firstSupplierPrice,
        negoType: {
          value: data.negoTypeId,
          label: data.negoTypeName,
        },
        definition: data.definition,
        costSaving: data.costSaving,
      })

      if (!data.paymentTermId) {
        supplierDetailsFormRef.resetFields(['paymentTerm', 'paymentTermDescription'])
      }
    },
    [supplierDetailsFormRef, setSelectedSupplier, setIsShowPaymentDesc],
  )

  const populatePOItems = useCallback(
    (data: PurchaseOrderRespType) => {
      // PO Items State
      setVatPercentage(data.vatPercentage)
      setPoItemsGrandTotal(data.itemGrandTotal)

      // Remark Form
      poItemsFormRef.setFieldsValue({
        remarkItem: data.remarkItem,
      })

      // PO Items
      const poItems = data.purchaseOrderItems?.map((item) => {
        return {
          ...item,
          key: item.id,
        }
      })
      setPoItemsList(poItems)
    },
    [poItemsFormRef, setPoItemsList, setVatPercentage, setPoItemsGrandTotal],
  )

  const populatePOAttachments = useCallback(
    (data: PurchaseOrderRespType) => {
      const dataWithKey = data.documentAttachFiles?.map((file) => ({
        ...file,
        key: file.id,
      }))
      setPoAttachmentsList(dataWithKey ?? [])
      // PO Attachments
    },
    [setPoAttachmentsList],
  )

  const populateBCSData = useCallback(
    (data: PurchaseOrderRespType) => {
      poBCSFormRef.setFieldsValue({
        remarkBudgetControlSheet: data.remarkBudgetControlSheet,
      })
      // Budget Control Sheet
      setBudgetControlSheetData(data.purchaseOrderBudgetControlSheets)
    },
    [setBudgetControlSheetData, poBCSFormRef],
  )

  const populateDataToForm = useCallback(
    (data: PurchaseOrderRespType) => {
      setPoData(data)

      // Populate form fields with data
      populatePODetailsForm(data)
      populateSupplierDetailsForm(data)
      populatePOItems(data)
      populateBCSData(data)
      populatePOAttachments(data)
    },
    [
      populatePODetailsForm,
      populateSupplierDetailsForm,
      populatePOItems,
      populateBCSData,
      populatePOAttachments,
      setPoData,
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
      console.error('Failed to load PO:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to load purchase order details.',
      })
    }
  }, [error, openNotification])

  useEffect(() => {
    if (poData) {
      populateDataToForm(poData)
    }
  }, [poData, populateDataToForm])

  return {
    isFetchingPO: isFetching,
  }
}

export default useGetPO
