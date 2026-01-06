import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Form, UploadFile } from 'antd'

import { useGetCurrenciesQuery } from 'api/masterApi'
import { MainGroupType, SupplierType } from 'api/masterApi.types'
import { useCreatePOMutation, useUpdatePOMutation } from 'api/poApi'
import { POItemType, PurchaseOrderRespType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import { useNotification } from 'hooks/useNotification'

import {
  DropdownValueType,
  ExchangeRateType,
  PRAttachmentDataType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { PAGE_MODE } from 'constants/index'
import { convertCurrencyToBaht } from 'utils/generalHelpers'

import { PRListDropdownType } from '../components/PRListDropdown'

import useComposeData from './useComposeData'
import useGetPO from './useGetPO'
import useValidation from './useValidation'

type Props = {
  poId?: string
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
}

const usePurchaseOrderPage = ({ mode, poId }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { openNotification } = useNotification()
  /* ---------- BEGIN: 3rd Party ---------- */
  const [poDetailsFormRef] = Form.useForm()
  const [supplierDetailsFormRef] = Form.useForm()
  const [poItemsFormRef] = Form.useForm()
  const [poBCSFormRef] = Form.useForm()

  const poDetailDivRef = useRef<HTMLDivElement | null>(null)
  const poSupplierDivRef = useRef<HTMLDivElement | null>(null)
  const poItemsDivRef = useRef<HTMLDivElement | null>(null)
  const poAttachDivRef = useRef<HTMLDivElement | null>(null)
  const poBCSDivRef = useRef<HTMLDivElement | null>(null)

  // REQUEST
  const { data: currencyList = [] } = useGetCurrenciesQuery()
  const [triggerCreatePO] = useCreatePOMutation()
  const [triggerUpdatePO] = useUpdatePOMutation()
  /* ---------- END: 3rd Party ---------- */

  /* ---------- BEGIN: State ---------- */
  // PO
  const [poData, setPoData] = useState<PurchaseOrderRespType | null>(null)
  // PO Details Form
  const [selectedBudget, setSelectedBudget] = useState<BudgetItemType | null>()
  const [selectedMainGroup, setSelectedMainGroup] = useState<MainGroupType | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<DropdownValueType | undefined>()
  const [selectedBudgetType, setSelectedBudgetType] = useState<DropdownValueType>()
  const [isNotRefPR, setIsNotRefPR] = useState<boolean>(false)
  const [prList, setPrList] = useState<PRListDropdownType[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateType>({
    source: 1,
    destination: 1,
  })
  // PO Supplier
  const [isShowPaymentDesc, setIsShowPaymentDesc] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierType>()
  // PO Items
  const [poItemsList, setPoItemsList] = useState<POItemType[]>([])
  const [poItemsGrandTotal, setPoItemsGrandTotal] = useState(0)
  const [vatPercentage, setVatPercentage] = useState(0)
  // PO Attachments
  const [poAttachmentsList, setPoAttachmentsList] = useState<PRAttachmentDataType[]>([])
  // PO Budget Control Sheet
  const [budgetControlSheetData, setBudgetControlSheetData] = useState<PrBudgetControlSheetType[]>(
    [],
  )
  const [isRequiredUpdateBCS, setIsRequiredUpdateBCS] = useState(false)
  const [isLoadingBCS, setIsLoadingBCS] = useState(false)
  /* ---------- END: State ---------- */

  /* ---------- BEGIN: Hooks ---------- */
  const validationHook = useValidation({
    isNotRefPR,
    isRequiredUpdateBCS,
    prList,
    poItemsList,
    poAttachmentsList,
    poDetailsFormRef,
    supplierDetailsFormRef,
    poDetailDivRef,
    poSupplierDivRef,
    poItemsDivRef,
    poAttachDivRef,
    poBCSDivRef,
    budgetControlSheetData,
  })
  const { composeCreatePoData, composeUpdatePoData } = useComposeData({
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
  })
  const { isFetchingPO } = useGetPO({
    poId,
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
    setSelectedSupplier,
    setIsShowPaymentDesc,
    setPoItemsList,
    setVatPercentage,
    setPoItemsGrandTotal,
    setBudgetControlSheetData,
    setPoData,
    setPoAttachmentsList,
    setSelectedMainGroup,
  })
  /* ---------- END: Hooks ---------- */

  /* ---------- BEGIN: DefaultState ---------- */
  // Default Currency to be BAHT
  const defaultCurrency = useMemo(
    () => currencyList.find((currency) => currency.currencyName === 'THB'),
    [currencyList],
  )
  useEffect(() => {
    if (mode === PAGE_MODE.CREATE && defaultCurrency) {
      poDetailsFormRef.setFieldsValue({
        exchangeRateSource: 1,
        exchangeRateDestination: 1,
        currency: {
          value: defaultCurrency?.id,
          label: defaultCurrency?.currencyName,
        },
      })
      setSelectedCurrency({
        value: defaultCurrency?.id,
        label: defaultCurrency?.currencyName,
      })
    }
  }, [defaultCurrency, mode, poDetailsFormRef])
  /* ---------- END: DefaultState ---------- */

  /* ---------- BEGIN: Computed ---------- */
  const getAmountForBCS = (amount: number): number => {
    return exchangeRates.source && exchangeRates.destination
      ? convertCurrencyToBaht({
          amount,
          exchangeRateSource: exchangeRates.source,
          exchangeRateDestination: exchangeRates.destination,
        })
      : 0
  }
  /* ---------- END: Computed ---------- */

  /* ---------- BEGIN: Operations ---------- */
  const onCreatePO = async () => {
    // Validate
    try {
      await validationHook.validatePO()
    } catch (error) {
      console.error('Validation failed:', error)
      return
    }

    // Compose PO data
    const data = composeCreatePoData()
    if (!data) {
      console.error('Failed to compose PO. data')
      openNotification({
        title: 'Error',
        description: 'Failed to compose purchase order data.',
      })
      return
    }

    // Create PO
    const files = poAttachmentsList
      .map((doc) => doc.file)
      .filter((file): file is UploadFile => file !== undefined)

    try {
      dispatch(showLoading())
      const response = await triggerCreatePO({ data, files }).unwrap()
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      openNotification({
        type: 'success',
        title: 'Create Successful',
        description: 'The purchase requisition has been created successfully.',
      })
      if (response?.id) navigate(`/purchase-order/${response.id}/edit`)
    } catch (error) {
      console.error('Failed to create PO:', error)
      openNotification({
        title: 'Failed to create puchase order',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const onUpdatePO = async () => {
    try {
      await validationHook.validatePO()
    } catch (error) {
      console.error('Validation failed:', error)
      return
    }

    try {
      const data = composeUpdatePoData()
      if (!data) {
        console.error('Failed to compose PO. data')
        openNotification({
          title: 'Error',
          description: 'Failed to compose purchase order data.',
        })
        return
      }

      dispatch(showLoading())
      await triggerUpdatePO(data).unwrap()

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      openNotification({
        type: 'success',
        title: 'Update Successful',
        description: 'The purchase requisition has been updated successfully.',
      })
    } catch (error) {
      console.error('Failed to update PO:', error)
      openNotification({
        title: 'Failed to update purchase order',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }
  /* ---------- END: Operations ---------- */

  /**
   * Updates the PO data in preparation for submission:
   * 1. Composes the update data
   * 2. Updates the PO via API
   */
  const updatePOForSubmission = async (): Promise<void> => {
    if (!poData?.id) {
      throw new Error('Invalid PO ID.')
    }

    // Step 1: Compose and save PO data
    const composedData = composeUpdatePoData()
    if (!composedData) {
      throw new Error('Failed to compose update data. Please try again.')
    }

    // Step 2: Update PO and submit with approval
    await triggerUpdatePO(composedData).unwrap()
  }

  return {
    // --- FORM REF ---
    poDetailsFormRef,
    supplierDetailsFormRef,
    poItemsFormRef,
    poBCSFormRef,

    // --- DIV REF ---
    poDetailDivRef,
    poSupplierDivRef,
    poItemsDivRef,
    poAttachDivRef,
    poBCSDivRef,

    // --- STATE ---
    poData,
    isFetchingPO,
    // PO Details Form
    isNotRefPR,
    selectedCurrency,
    selectedMainGroup,
    prList,
    poItemsList,
    poAttachmentsList,
    exchangeRates,
    selectedBudgetType,
    selectedBudget,

    // PO Supplier
    isShowPaymentDesc,
    selectedSupplier,

    // PO Items
    poItemsGrandTotal,
    vatPercentage,

    // PO Budget Control Sheet
    budgetControlSheetData,
    isRequiredUpdateBCS,
    isLoadingBCS,

    // --- FUNCTION ---
    composeUpdatePoData,
    updatePOForSubmission,
    // PO Details Form
    setSelectedCurrency,
    setSelectedMainGroup,
    setSelectedBudgetType,
    setIsNotRefPR,
    setPrList,
    setExchangeRates,
    setSelectedBudget,

    // PO Supplier
    setIsShowPaymentDesc,
    setSelectedSupplier,

    // PO Items
    setPoItemsList,
    setPoItemsGrandTotal,
    setVatPercentage,
    // PO Attachments
    setPoAttachmentsList,

    // PO Budget Control Sheet
    setBudgetControlSheetData,
    setIsRequiredUpdateBCS,
    setIsLoadingBCS,

    // Computed
    getAmountForBCS,

    // Action
    onCreatePO,
    onUpdatePO,
    validatePO: validationHook.validatePO,
  }
}

export default usePurchaseOrderPage
