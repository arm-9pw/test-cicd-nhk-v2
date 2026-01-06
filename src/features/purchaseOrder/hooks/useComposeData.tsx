import { FormInstance } from 'antd'

import { MainGroupType } from 'api/masterApi.types'
import {
  BudgetControlSheetDTOType,
  BudgetControlSheetUpdateDTOType,
  CreatePoDTOType,
  POItemType,
  POItemUpdateDTOType,
  PRUpdateDTOType,
  PurchaseOrderItemDTOType,
  PurchaseOrderRespType,
  PurchaseRequisitionDTOType,
  UpdatePoDTOType,
} from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import { useAppSelector } from 'app/hook'

import { selectUser } from 'features/auth/authSlice'
import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { BCS_STATUS } from 'constants/index'
import { formatToLocalDateTime } from 'utils/dateHelpers'
import {
  calculateGrandTotalWithVat,
  calculateVatBaht,
  convertCurrencyToBaht,
} from 'utils/generalHelpers'
import { toThaiCurrencyWords } from 'utils/toWordsHelper'

import { PRListDropdownType } from '../components/PRListDropdown'

import ThaiBahtText from 'thai-baht-text'

type Props = {
  poDetailsFormRef: FormInstance
  supplierDetailsFormRef: FormInstance
  poItemsFormRef: FormInstance
  poBCSFormRef: FormInstance
  isNotRefPR: boolean
  vatPercentage: number
  poItemsGrandTotal: number
  poItemsList: POItemType[]
  budgetControlSheetData: PrBudgetControlSheetType[]
  prList: PRListDropdownType[]
  poAttachmentsList: PRAttachmentDataType[]
  poData: PurchaseOrderRespType | null
  selectedBudget?: BudgetItemType | null
  selectedMainGroup: MainGroupType | null
}

const useComposeData = ({
  isNotRefPR,
  poDetailsFormRef,
  supplierDetailsFormRef,
  poItemsFormRef,
  poBCSFormRef,
  vatPercentage,
  poItemsGrandTotal,
  poItemsList,
  budgetControlSheetData,
  prList,
  poAttachmentsList,
  poData,
  selectedBudget,
  selectedMainGroup,
}: Props) => {
  const user = useAppSelector(selectUser)

  const itemsNetCalculation = () => {
    const poDetailsFormValues = poDetailsFormRef.getFieldsValue()
    const exchangeRateSource = poDetailsFormValues?.exchangeRateSource || 1 // NOTE: 1 is default
    const exchangeRateDestination = poDetailsFormValues?.exchangeRateDestination || 1 // NOTE: 1 is default

    const monetaryBaht = convertCurrencyToBaht({
      amount: poItemsGrandTotal,
      exchangeRateSource,
      exchangeRateDestination,
    })
    const vatBaht = calculateVatBaht(monetaryBaht, vatPercentage)
    const grandMonetaryBaht = calculateGrandTotalWithVat(monetaryBaht, vatBaht)
    const totalEN = toThaiCurrencyWords(grandMonetaryBaht)
    const totalTH = ThaiBahtText(grandMonetaryBaht)

    return {
      grandMonetaryBaht,
      monetaryBaht,
      vatBaht,
      totalEN,
      totalTH,
    }
  }

  const getPOItems = <T extends 'create' | 'update'>(
    type?: T,
  ): T extends 'update' ? POItemUpdateDTOType[] : PurchaseOrderItemDTOType[] => {
    const mappedItems = poItemsList.map((item, index) => ({
      order: index + 1,
      budgetId: item.budgetId,
      budgetCode: item.budgetCode,
      budgetSiteId: item.budgetSiteId,
      budgetSiteName: item.budgetSiteName ?? '',
      name: item.name ?? '',
      brand: item.brand ?? '',
      model: item.model ?? '',
      detail: item.detail ?? '',
      qty: item.qty,
      unit: item.unit ?? '',
      unitPrice: item.unitPrice,
      unitDiscount: item.unitDiscount,
      netTotal: item.netTotal,
      matCode: item.matCode || null,
      ...(type === 'update' ? { id: item.id ?? '' } : {}),
    }))

    return mappedItems as T extends 'update' ? POItemUpdateDTOType[] : PurchaseOrderItemDTOType[]
  }

  const getPoBcs = <T extends 'create' | 'update'>(
    type?: T,
  ): T extends 'update' ? BudgetControlSheetUpdateDTOType[] : BudgetControlSheetDTOType[] => {
    const mappedItems = budgetControlSheetData.map((item) => {
      return {
        ...item,
        budgetStatus: item.isOverBudget ? BCS_STATUS.OVER_BUDGET : BCS_STATUS.NOT_OVER_BUDGET,
        ...(type === 'update' ? { id: item.id } : {}),
      }
    })
    return mappedItems as T extends 'update'
      ? BudgetControlSheetUpdateDTOType[]
      : BudgetControlSheetDTOType[]
  }

  const getPoAttachments = () => {
    return poAttachmentsList
      .filter((item) => item.domain === 'PURCHASE_ORDER')
      .map((item) => {
        return {
          domain: item.domain,
          documentType: item.documentType,
          documentNo: item.documentNo,
          documentDate: formatToLocalDateTime(item.documentDate),
          fileName: item.fileName,
        }
      })
  }

  const getPrList = <T extends 'create' | 'update'>(
    type?: T,
  ): T extends 'update' ? PRUpdateDTOType[] : PurchaseRequisitionDTOType[] => {
    if (isNotRefPR) {
      return []
    }

    const mappedItems = prList.map((item) => ({
      prDate: item.prDate ?? '',
      purchaseRequisitionId: item.purchaseRequisitionId ?? '',
      prNo: item.prNo ?? '',

      requesterName: item.requesterName ?? '',
      requesterPosition: item.requesterPosition ?? '',
      requesterSite: item.requesterSite ?? '',
      requesterSection: item.requesterSection ?? '',
      requesterSectionId: item.requesterSectionId ?? '',
      requesterEmail: item.requesterEmail ?? '',
      requesterTel: item.requesterTel ?? '',
      mainGroupId: item.mainGroupId ?? '',
      mainGroupName: item.mainGroupName ?? '',
      monetaryBaht: item.monetaryBaht ?? 0,
      ...(type === 'update' ? { id: item.id ?? '' } : {}),
    }))

    return mappedItems as T extends 'update' ? PRUpdateDTOType[] : PurchaseRequisitionDTOType[]
  }

  const composeCreatePoData = (): CreatePoDTOType | null => {
    const poDetailsFormValues = poDetailsFormRef.getFieldsValue()
    const supplierDetailsFormValues = supplierDetailsFormRef.getFieldsValue()
    const poItemsFormValues = poItemsFormRef.getFieldsValue()
    const poBCSFormValues = poBCSFormRef.getFieldsValue()

    const { grandMonetaryBaht, monetaryBaht, vatBaht, totalEN, totalTH } = itemsNetCalculation()

    if (!poDetailsFormValues || !supplierDetailsFormValues) {
      return null
    }

    return {
      // NOTE: Data from User API
      purchaserName: user?.fullNameEn || '',
      purchaserSite: user?.currentSiteCode || '',
      purchaserSection: user?.currentDepartmentName || '',
      purchaserSectionId: user?.currentDepartmentId || '',
      purchaserId: user?.employeeId || '',
      purchaserEmail: user?.email || '',
      purchaserTel: user?.telephone || '',
      // PO Details
      jobName: poDetailsFormValues.jobName,
      deliveryDate: formatToLocalDateTime(poDetailsFormValues.deliveryDate),
      mainGroupId: poDetailsFormValues.mainGroup.value,
      mainGroupName: poDetailsFormValues.mainGroup.label,
      mainGroupCode: selectedMainGroup?.mainGroupCode || '',
      siteDeliveryId: poDetailsFormValues.siteDelivery.value,
      siteDeliveryName: poDetailsFormValues.siteDelivery.label,
      siteInvoiceTaxId: poDetailsFormValues.siteInvoice.value,
      siteInvoiceTaxName: poDetailsFormValues.siteInvoice.label,

      isImport: poDetailsFormValues.isImport ?? false,
      incoterm: poDetailsFormValues.incoterm ?? null,

      currencyId: poDetailsFormValues.currency.value,
      currencyName: poDetailsFormValues.currency.label,
      exchangeRateSource: poDetailsFormValues.exchangeRateSource,
      exchangeRateDestination: poDetailsFormValues.exchangeRateDestination,
      budgetId: poDetailsFormValues.budgetId ? poDetailsFormValues.budgetId : null,
      // budgetCode: poDetailsFormValues.budgetCode ? poDetailsFormValues.budgetCode : null,
      // budgetCode: selectedBudget?.isSubBudget
      //   ? (selectedBudget?.mainBudgetCode ?? null)
      //   : (selectedBudget?.budgetCode ?? null),
      budgetCode: selectedBudget?.budgetCode ?? null, // NOTE: Update จากพี่ชาย ไม่ต้องเอา subBudgetCode ส่งไป แค่ส่ง budgetCode ที่ match กับ budgetId พอ
      subBudgetCode: selectedBudget?.isSubBudget ? selectedBudget?.budgetCode : null,
      assetType: selectedBudget?.budgetName ?? null,
      budgetYear: selectedBudget?.budgetYear ?? null,
      budgetDescription: poDetailsFormValues.budgetDescription ?? '',
      budgetTypeId: poDetailsFormValues.budgetType?.value,
      budgetTypeName: poDetailsFormValues.budgetType?.label,
      isReferPr: !isNotRefPR,
      // Supplier Details
      supplierId: supplierDetailsFormValues.supplierId,
      supplierName: supplierDetailsFormValues.supplierName,
      supplierCode: supplierDetailsFormValues.supplierCode,
      supplierAddress: supplierDetailsFormValues.supplierAddress ?? '',
      supplierAttention: supplierDetailsFormValues.supplierAttention ?? '',
      supplierAttentionPosition: supplierDetailsFormValues.supplierAttentionPosition ?? '',
      supplierTelephone: supplierDetailsFormValues.supplierTelephone ?? '',
      supplierEmail: supplierDetailsFormValues.supplierEmail ?? '',
      supplierTaxId: supplierDetailsFormValues.supplierTaxId ?? '',
      supplierCondition: supplierDetailsFormValues.supplierCondition ?? '',
      paymentTermId: supplierDetailsFormValues.paymentTerm.value,
      paymentTermName: supplierDetailsFormValues.paymentTerm.label ?? '',
      paymentTermDescription: supplierDetailsFormValues.paymentTermDescription ?? '',
      firstSupplierId: supplierDetailsFormValues.firstSupplierId ?? null,
      firstSupplierName: supplierDetailsFormValues.firstSupplierName ?? null,
      firstSupplierCode: supplierDetailsFormValues.firstSupplierCode ?? null,
      firstSupplierPrice: supplierDetailsFormValues.firstSupplierPrice ?? null,
      negoTypeId: supplierDetailsFormValues.negoType?.value ?? null,
      negoTypeName: supplierDetailsFormValues.negoType?.label ?? null,
      definition: supplierDetailsFormValues.definition ?? null,
      costSaving: supplierDetailsFormValues.costSaving ?? null,
      // PO Items
      vatPercentage,
      vatBaht,
      grandMonetaryBaht,
      monetaryBaht,
      itemGrandTotal: poItemsGrandTotal,
      monetaryWordEn: totalEN,
      monetaryWordTh: totalTH,
      remarkItem: poItemsFormValues.remarkItem ?? '',
      // PO BCS
      remarkBudgetControlSheet: poBCSFormValues.remarkBudgetControlSheet ?? '',
      // Other
      documentRoute: 'document Route', // FIXME: Implement later
      purchaseOrderItems: getPOItems('create'),
      purchaseOrderBudgetControlSheets: getPoBcs('create'),
      purchaseRequisitions: getPrList('create'),
      documentAttachFiles: getPoAttachments(),
    }
  }

  const composeUpdatePoData = (): UpdatePoDTOType | null => {
    const poDetailsFormValues = poDetailsFormRef.getFieldsValue()
    const supplierDetailsFormValues = supplierDetailsFormRef.getFieldsValue()
    const poItemsFormValues = poItemsFormRef.getFieldsValue()
    const poBCSFormValues = poBCSFormRef.getFieldsValue()

    const { grandMonetaryBaht, monetaryBaht, vatBaht, totalEN, totalTH } = itemsNetCalculation()

    if (!poData) {
      // TODO:PO: Show error
      return null
    }
    const data: UpdatePoDTOType = {
      // NOTE: Data from GET PO API
      id: poData?.id,
      poNo: poData?.poNo,
      poDate: poData?.poDate,
      purchaseStatus: poData?.purchaseStatus,

      // NOTE: Data from User API
      purchaserName: user?.fullNameEn || '',
      purchaserSite: user?.currentSiteCode || '',
      purchaserSection: user?.currentDepartmentName || '',
      purchaserSectionId: user?.currentDepartmentId || '',
      purchaserId: user?.employeeId || '',
      purchaserEmail: user?.email || '',
      purchaserTel: user?.telephone || '',

      // PO Details
      jobName: poDetailsFormValues.jobName,
      deliveryDate: formatToLocalDateTime(poDetailsFormValues.deliveryDate),
      mainGroupId: poDetailsFormValues.mainGroup.value,
      mainGroupName: poDetailsFormValues.mainGroup.label,
      mainGroupCode: selectedMainGroup?.mainGroupCode || '',
      siteDeliveryId: poDetailsFormValues.siteDelivery.value,
      siteDeliveryName: poDetailsFormValues.siteDelivery.label,
      siteInvoiceTaxId: poDetailsFormValues.siteInvoice.value,
      siteInvoiceTaxName: poDetailsFormValues.siteInvoice.label,

      isImport: poDetailsFormValues.isImport ?? false,
      incoterm: poDetailsFormValues.incoterm ?? null,

      currencyId: poDetailsFormValues.currency.value,
      currencyName: poDetailsFormValues.currency.label,
      exchangeRateSource: poDetailsFormValues.exchangeRateSource,
      exchangeRateDestination: poDetailsFormValues.exchangeRateDestination,
      budgetId: poDetailsFormValues.budgetId ? poDetailsFormValues.budgetId : null,
      // budgetCode: poDetailsFormValues.budgetCode ? poDetailsFormValues.budgetCode : null,
      // budgetCode: selectedBudget?.isSubBudget
      //   ? (selectedBudget?.mainBudgetCode ?? null)
      //   : (selectedBudget?.budgetCode ?? null),
      budgetCode: selectedBudget?.budgetCode ?? null, // NOTE: [9 June 2025] Update จากพี่ชาย ไม่ต้องเอา subBudgetCode ส่งไป แค่ส่ง budgetCode ที่ match กับ budgetId พอ
      subBudgetCode: selectedBudget?.isSubBudget ? selectedBudget?.budgetCode : null,
      assetType: selectedBudget?.assetType ?? null,
      budgetYear: selectedBudget?.budgetYear ?? null,
      budgetDescription: poDetailsFormValues.budgetDescription ?? '',
      budgetTypeId: poDetailsFormValues.budgetType?.value,
      budgetTypeName: poDetailsFormValues.budgetType?.label,
      isReferPr: !isNotRefPR,
      // Supplier Details
      supplierId: supplierDetailsFormValues.supplierId,
      supplierName: supplierDetailsFormValues.supplierName,
      supplierCode: supplierDetailsFormValues.supplierCode,
      supplierAddress: supplierDetailsFormValues.supplierAddress ?? '',
      supplierAttention: supplierDetailsFormValues.supplierAttention ?? '',
      supplierAttentionPosition: supplierDetailsFormValues.supplierAttentionPosition ?? '',
      supplierTelephone: supplierDetailsFormValues.supplierTelephone ?? '',
      supplierEmail: supplierDetailsFormValues.supplierEmail ?? '',
      supplierTaxId: supplierDetailsFormValues.supplierTaxId ?? '',
      supplierCondition: supplierDetailsFormValues.supplierCondition ?? '',
      paymentTermId: supplierDetailsFormValues.paymentTerm.value,
      paymentTermName: supplierDetailsFormValues.paymentTerm.label ?? '',
      paymentTermDescription: supplierDetailsFormValues.paymentTermDescription ?? '',
      firstSupplierId: supplierDetailsFormValues.firstSupplierId ?? null,
      firstSupplierName: supplierDetailsFormValues.firstSupplierName ?? null,
      firstSupplierCode: supplierDetailsFormValues.firstSupplierCode ?? null,
      firstSupplierPrice: supplierDetailsFormValues.firstSupplierPrice ?? null,
      negoTypeId: supplierDetailsFormValues.negoType?.value ?? null,
      negoTypeName: supplierDetailsFormValues.negoType?.label ?? null,
      definition: supplierDetailsFormValues.definition ?? null,
      costSaving: supplierDetailsFormValues.costSaving ?? null,
      // PO Items
      vatPercentage,
      vatBaht,
      grandMonetaryBaht,
      monetaryBaht,
      itemGrandTotal: poItemsGrandTotal,
      monetaryWordEn: totalEN,
      monetaryWordTh: totalTH,
      remarkItem: poItemsFormValues.remarkItem ?? '',
      // PO BCS
      remarkBudgetControlSheet: poBCSFormValues.remarkBudgetControlSheet ?? '',
      // Other
      documentRoute: 'document Route', // FIXME: Implement later
      purchaseOrderItems: getPOItems('update'),
      purchaseOrderBudgetControlSheets: getPoBcs('update'),
      purchaseRequisitions: getPrList('update'),
    }

    return data
  }
  return { composeCreatePoData, composeUpdatePoData }
}

export default useComposeData
