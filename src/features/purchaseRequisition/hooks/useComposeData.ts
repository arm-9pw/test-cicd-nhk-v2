import { FormInstance, UploadFile } from 'antd'

import {
  BudgetItemType,
  CreatePurchaseRequisitionDTO,
  PrBudgetControlSheetType,
  PurchaseRequisitionRespType,
} from 'api/prApi.types'
import { useAppSelector } from 'app/hook'
import { useNotification } from 'hooks/useNotification'

import { selectUser } from 'features/auth/authSlice'

import { formatToLocalDateTime } from 'utils/dateHelpers'
import { convertCurrencyToBaht } from 'utils/generalHelpers'
import { toThaiCurrencyWords } from 'utils/toWordsHelper'

import {
  DropdownValueType,
  PRAttachmentDataType,
  PrItemType,
  mainGroupDropdownType,
} from '../PurchaseRequisitionPage.types'

import ThaiBahtText from 'thai-baht-text'

type UseComposeDataProps = {
  prDetailsFormRef: FormInstance
  prBCSFormRef: FormInstance
  prPurchasingInchargeFormRef: FormInstance
  prSelectedBudget?: BudgetItemType | null
  selectedCurrency?: DropdownValueType
  exchangeRates: {
    source: number | null
    destination: number | null
  }
  isMultipleBudget: boolean
  prItemsGrandTotal: number
  documentList: PRAttachmentDataType[]
  prItemsList: PrItemType[]
  budgetControlSheetData: PrBudgetControlSheetType[]
  prData?: PurchaseRequisitionRespType | null
  selectedMainGroup?: mainGroupDropdownType
}

/**
 * Custom hook for composing PR data
 *
 * Features:
 * 1. Composes create PR data from multiple form values
 * 2. Composes update PR data maintaining existing data
 * 3. Handles currency conversion and monetary text
 * 4. Formats dates and file attachments
 * 5. Processes PR items and budget control sheets
 *
 * @param props Hook configuration and data
 * @returns Functions to compose PR data for create and update operations
 */
const useComposeData = ({
  prDetailsFormRef,
  prBCSFormRef,
  prPurchasingInchargeFormRef,
  prSelectedBudget,
  selectedCurrency,
  exchangeRates,
  isMultipleBudget,
  prItemsGrandTotal,
  documentList,
  prItemsList,
  budgetControlSheetData,
  prData,
  selectedMainGroup,
}: UseComposeDataProps) => {
  const { openNotification } = useNotification()
  const user = useAppSelector(selectUser)

  const composeCreatePrData = (): {
    data: CreatePurchaseRequisitionDTO
    files: UploadFile[]
  } | null => {
    if (!prSelectedBudget) return null

    const prDetailsFormData = prDetailsFormRef.getFieldsValue()
    const prBCSFormData = prBCSFormRef.getFieldsValue()
    const prPurchasingInchargeFormData = prPurchasingInchargeFormRef.getFieldsValue()

    const monetaryBaht = convertCurrencyToBaht({
      amount: prItemsGrandTotal,
      exchangeRateSource: exchangeRates.source ?? 0,
      exchangeRateDestination: exchangeRates.destination ?? 0,
    })

    const data: CreatePurchaseRequisitionDTO = {
      // User Info
      requesterName: user?.fullNameEn || '',
      requesterPosition: user?.currentPositionName || '',
      requesterSite: user?.currentSiteCode || '',
      requesterSection: user?.currentDepartmentName || '',
      requesterSectionId: user?.currentDepartmentId || '',
      requesterId: user?.employeeId || '',
      requesterTel: user?.telephone || '',
      requesterEmail: user?.email || '',

      // PR Details
      jobName: prDetailsFormData?.jobName,
      requireDate: formatToLocalDateTime(prDetailsFormData.requiredDate),
      budgetTypeId: prDetailsFormData?.budgetType?.value,
      budgetTypeName: prDetailsFormData?.budgetType?.label,

      mainGroupId: prDetailsFormData?.mainGroup?.value,
      mainGroupName: prDetailsFormData?.mainGroup?.label,
      mainGroupCode: selectedMainGroup?.mainGroupCode || '',

      // Budget Info
      budgetId: prSelectedBudget.budgetId,
      // budgetCode: prSelectedBudget.isSubBudget
      //   ? prSelectedBudget.mainBudgetCode!
      //   : prSelectedBudget.budgetCode,
      budgetCode: prSelectedBudget.budgetCode ?? null, // NOTE: Update จากพี่ชาย ไม่ต้องเอา subBudgetCode ส่งไป แค่ส่ง budgetCode ที่ match กับ budgetId พอ
      subBudgetCode: prSelectedBudget.isSubBudget ? prSelectedBudget.budgetCode : null,
      assetType: prSelectedBudget.budgetName || null,
      budgetYear: prSelectedBudget.budgetYear ?? null,
      budgetSiteId: prSelectedBudget.budgetSiteId,
      budgetSiteName: prSelectedBudget.organizationName || '',
      budgetDescription: prDetailsFormData?.budgetDescription,
      isMultipleBudget,

      // Additional Details
      line: prDetailsFormData?.line,
      purpose: prDetailsFormData?.purpose,
      // isImport: prDetailsFormData?.isImport,
      isImport: false, // NOTE [14 Mar 2025]: เก๋อัพเดทมาว่าให้เอา checkbox import ที่หน้าบ้านออก แต่ยังไม่แก้ backend เพราะฉะนั้นจะส่งเป็น false เสมอไปแทน
      remarkItem: prDetailsFormData?.remarkItem,

      // Currency Info
      currencyId: selectedCurrency?.value || '',
      currencyName: selectedCurrency?.label || '',
      exchangeRateSource: exchangeRates.source ?? 0,
      exchangeRateDestination: exchangeRates.destination ?? 0,

      // Purchase Incharge Info
      purchaseInChargeSectionId:
        prPurchasingInchargeFormData?.purchaseInchargeSection?.value || null,
      purchaseInChargeSectionName:
        prPurchasingInchargeFormData?.purchaseInchargeSection?.label || '',
      documentRoute: prPurchasingInchargeFormData?.documentRoute,
      purchaseStatus: 'DRAFT',

      // BCS Info
      budgetControlSheetRemark: prBCSFormData?.budgetControlSheetRemark,

      // Monetary Info
      monetaryWordEn: toThaiCurrencyWords(monetaryBaht),
      monetaryWordTh: ThaiBahtText(monetaryBaht),
      itemGrandTotal: prItemsGrandTotal,
      monetaryBaht,

      // Document Attachments
      documentAttachFiles: documentList.map((doc) => ({
        domain: 'PURCHASE_REQUISITION',
        documentType: doc.documentType,
        documentNo: doc.documentNo,
        documentDate: formatToLocalDateTime(doc.documentDate),
        fileName: doc.fileName,
      })),

      // PR Items
      purchaseRequisitionItems: prItemsList.map((item, index) => {
        return {
          order: index + 1,
          budgetId: item.budgetId,
          budgetCode: item.budgetCode,
          budgetSiteId: item.budgetSiteId,
          budgetSiteName: item.budgetSiteName || '',
          name: item.name,
          model: item.model || '',
          brand: item.brand || '',
          detail: item.detail || '',
          qty: item.qty,
          unit: item.unit,
          unitPrice: item.unitPrice,
          unitDiscount: item.unitDiscount,
          netTotal: item.netTotal,
          matCode: item.matCode,
        }
      }),

      // Budget Control Sheets
      purchaseRequisitionBudgetControlSheets: budgetControlSheetData,
    }

    return {
      data,
      files: documentList
        .map((doc) => doc.file)
        .filter((file): file is UploadFile => file !== undefined),
    }
  }

  const composeUpdatePrData = (): Partial<PurchaseRequisitionRespType> | null => {
    if (!prData) {
      openNotification({
        title: 'Invalid PR. data.',
        description: 'Please try refreshing the page.',
      })
      return null
    }

    if (!prSelectedBudget) {
      openNotification({
        title: 'Budget is required.',
        description: 'Please select a budget.',
      })
      return null
    }

    const prDetailsFormData = prDetailsFormRef.getFieldsValue()
    const prBCSFormData = prBCSFormRef.getFieldsValue()
    const prPurchasingInchargeFormData = prPurchasingInchargeFormRef.getFieldsValue()

    const monetaryBaht = convertCurrencyToBaht({
      amount: prItemsGrandTotal,
      exchangeRateSource: exchangeRates.source ?? 0,
      exchangeRateDestination: exchangeRates.destination ?? 0,
    })

    return {
      // Existing PR Info
      id: prData.id,
      prNo: prData.prNo,
      prDate: prData.prDate,
      requesterName: user?.fullNameEn || '',
      requesterPosition: user?.currentPositionName || '',
      requesterSite: user?.currentSiteCode || '',
      requesterSection: user?.currentDepartmentName || '',
      requesterSectionId: user?.currentDepartmentId || '',
      requesterId: user?.employeeId || '',
      requesterTel: user?.telephone || '',
      requesterEmail: user?.email || '',

      // PR Details
      jobName: prDetailsFormData?.jobName,
      requireDate: formatToLocalDateTime(prDetailsFormData.requiredDate),
      budgetTypeId: prDetailsFormData?.budgetType?.value,
      budgetTypeName: prDetailsFormData?.budgetType?.label,

      mainGroupId: prDetailsFormData?.mainGroup?.value,
      mainGroupName: prDetailsFormData?.mainGroup?.label,
      mainGroupCode: selectedMainGroup?.mainGroupCode || '',

      // Budget Info
      budgetId: prSelectedBudget.budgetId,
      // budgetCode: prSelectedBudget.isSubBudget
      //   ? prSelectedBudget.mainBudgetCode!
      //   : prSelectedBudget.budgetCode,
      budgetCode: prSelectedBudget.budgetCode ?? null, // NOTE: Update จากพี่ชาย ไม่ต้องเอา subBudgetCode ส่งไป แค่ส่ง budgetCode ที่ match กับ budgetId พอ
      subBudgetCode: prSelectedBudget.isSubBudget ? prSelectedBudget.budgetCode : null,
      assetType: prSelectedBudget.assetType || null,
      budgetYear: prSelectedBudget.budgetYear ?? null,
      budgetSiteId: prSelectedBudget.budgetSiteId,
      budgetSiteName: prSelectedBudget.organizationName || prSelectedBudget.budgetSiteName,
      budgetDescription: prDetailsFormData?.budgetDescription,
      isMultipleBudget,

      // Additional Details
      line: prDetailsFormData?.line,
      purpose: prDetailsFormData?.purpose,
      // isImport: prDetailsFormData?.isImport,
      isImport: false, // NOTE [14 Mar 2025]: เก๋อัพเดทมาว่าให้เอา checkbox import ที่หน้าบ้านออก แต่ยังไม่แก้ backend เพราะฉะนั้นจะส่งเป็น false เสมอไปแทน
      remarkItem: prDetailsFormData?.remarkItem,

      // Currency Info
      currencyId: selectedCurrency?.value || '',
      currencyName: selectedCurrency?.label || '',
      exchangeRateSource: exchangeRates.source ?? 0,
      exchangeRateDestination: exchangeRates.destination ?? 0,

      // Purchase Incharge Info
      purchaseInChargeSectionId:
        prPurchasingInchargeFormData?.purchaseInchargeSection?.value || null,
      purchaseInChargeSectionName:
        prPurchasingInchargeFormData?.purchaseInchargeSection?.label || '',
      documentRoute: prPurchasingInchargeFormData?.documentRoute,
      purchaseStatus: prData.purchaseStatus,

      // BCS Info
      budgetControlSheetRemark: prBCSFormData?.budgetControlSheetRemark,

      // Monetary Info
      monetaryWordEn: toThaiCurrencyWords(monetaryBaht),
      monetaryWordTh: ThaiBahtText(monetaryBaht),
      itemGrandTotal: prItemsGrandTotal,
      monetaryBaht,

      // PR Items
      purchaseRequisitionItems: prItemsList.map((item, index) => {
        return {
          id: item.id || null,
          order: index + 1,
          budgetId: item.budgetId,
          budgetCode: item.budgetCode,
          budgetSiteId: item.budgetSiteId,
          budgetSiteName: item.budgetSiteName,
          name: item.name,
          model: item.model || '',
          brand: item.brand || '',
          detail: item.detail || '',
          qty: item.qty,
          unit: item.unit,
          unitPrice: item.unitPrice,
          unitDiscount: item.unitDiscount,
          netTotal: item.netTotal,
          matCode: item.matCode,
        }
      }),

      // Budget Control Sheets
      purchaseRequisitionBudgetControlSheets: budgetControlSheetData,
    }
  }

  return {
    composeCreatePrData,
    composeUpdatePrData,
  }
}

export default useComposeData
