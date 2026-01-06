import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Form } from 'antd'

import { useCreatePRMutation, useSubmitWithApprovalMutation, useUpdatePRMutation } from 'api/prApi'
import {
  BudgetItemType,
  PrBudgetControlSheetType,
  PurchaseRequisitionRespType,
} from 'api/prApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import useCustomModal from 'hooks/useCustomModal'
import { useNotification } from 'hooks/useNotification'

import {
  DropdownValueType,
  ExchangeRateType,
  PRAttachmentDataType,
  PrItemType,
  mainGroupDropdownType,
} from '../PurchaseRequisitionPage.types'

import useComposeData from './useComposeData'
import useGetPR from './useGetPR'
import useValidation from './useValidation'

const usePurchaseRequisitionPage = ({ prId: propPrId }: { prId?: string } = {}) => {
  const { id: paramId } = useParams()
  const id = propPrId || paramId
  /* ---------- BEGIN: 3rd Party ---------- */
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  // const { id } = useParams()
  // REQUEST
  const [triggerCreatePR] = useCreatePRMutation()
  const [triggerUpdatePR] = useUpdatePRMutation()
  const [submitWithApproval] = useSubmitWithApprovalMutation()

  const cancelModalHook = useCustomModal()
  const transferModalHook = useCustomModal()
  const { openNotification } = useNotification()
  const [prDetailsFormRef] = Form.useForm()
  const [prBCSFormRef] = Form.useForm()
  const [prPurchasingInchargeFormRef] = Form.useForm()
  const prDetailDivRef = useRef<HTMLDivElement | null>(null)
  const prItemsDivRef = useRef<HTMLDivElement | null>(null)
  const prAttachDivRef = useRef<HTMLDivElement | null>(null)
  const prBCSDivRef = useRef<HTMLDivElement | null>(null)
  const prPurchasingInchargeDivRef = useRef<HTMLDivElement | null>(null)
  /* ---------- END: 3rd Party ---------- */

  /* ---------- BEGIN: State ---------- */
  // PR Data
  const [prData, setPrData] = useState<PurchaseRequisitionRespType>()
  const [prLoading, setPrLoading] = useState<boolean>(false)
  // PR Detail Form
  const [selectedBudgetType, setSelectedBudgetType] = useState<DropdownValueType>()
  const [selectedMainGroup, setSelectedMainGroup] = useState<mainGroupDropdownType>()
  const [selectedCurrency, setSelectedCurrency] = useState<DropdownValueType | undefined>()
  const [prSelectedBudget, setPrSelectedBudget] = useState<BudgetItemType | null>()
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateType>({
    source: 1,
    destination: 1,
  })
  // PR Items Table
  const [isMultipleBudget, setIsMultipleBudget] = useState<boolean>(false) // NOTE: Need to be here because we need it when save PR
  const [prItemsList, setPrItemsList] = useState<PrItemType[]>([])
  const [prItemsGrandTotal, setPrItemsGrandTotal] = useState(0)
  // PR Attachment
  const [documentList, setDocumentList] = useState<PRAttachmentDataType[]>([])
  // PR Budget Control Sheet
  const [budgetControlSheetData, setBudgetControlSheetData] = useState<PrBudgetControlSheetType[]>(
    [],
  )
  const [isBCSDataOutdated, setIsBCSDataOutdated] = useState(false)
  /* ---------- END: State ---------- */

  /* ---------- BEGIN: Setter ---------- */
  const onSetMainGroup = useCallback((value: mainGroupDropdownType) => {
    setSelectedMainGroup(value)
  }, [])
  const onSetPrLoading = useCallback((value: boolean) => {
    setPrLoading(value)
  }, [])
  // PR Detail Form
  const onBudgetTypeChange = useCallback((value: DropdownValueType) => {
    setSelectedBudgetType(value)
  }, [])
  const onSetSelectedCurrency = useCallback(
    (value: DropdownValueType | undefined) => {
      // When selected currency is THB, set exchange rate to 1
      if (value && value.label === 'THB') {
        prDetailsFormRef.setFieldsValue({
          exchangeRateSource: 1,
          exchangeRateDestination: 1,
        })
      }
      setSelectedCurrency(value)
    },
    [prDetailsFormRef],
  )
  const onSetPrSelectedBudget = useCallback(
    (budget: BudgetItemType | null) => {
      if (!budget) {
        prDetailsFormRef.setFieldsValue({
          budgetCode: '',
          budgetDescription: '',
        })
        setPrSelectedBudget(null)
        return
      }

      if (budget?.budgetName) {
        prDetailsFormRef.setFieldsValue({
          budgetDescription: budget?.budgetDescription,
        })
      }
      prDetailsFormRef.setFieldsValue({
        budgetCode: budget?.budgetCode,
      })
      setPrSelectedBudget(budget)
    },
    [prDetailsFormRef],
  )
  const onSetPrItemsGrandTotal = useCallback((value: number) => {
    setPrItemsGrandTotal(value)
  }, [])
  const handleExchangeRateChange = useCallback(
    (source: number | null, destination: number | null) => {
      setExchangeRates({ source, destination })
    },
    [],
  )

  // PR Items Table
  const onSetIsMultipleBudget = useCallback((value: boolean) => {
    setIsMultipleBudget(value)
  }, [])
  const onSetPrItemsList = useCallback((value: PrItemType[]) => {
    setPrItemsList(value)
  }, [])

  // PR Attachment
  const onSetDocumentList = useCallback((value: PRAttachmentDataType[]) => {
    setDocumentList(value)
  }, [])

  // PR Budget Control Sheet
  const onSetBudgetControlSheetData = useCallback((value: PrBudgetControlSheetType[]) => {
    setBudgetControlSheetData(value)
  }, [])
  const onSetIsBCSDataOutdated = useCallback((value: boolean) => {
    setIsBCSDataOutdated(value)
  }, [])
  /* ---------- END: Setter ---------- */

  /* ---------- BEGIN: Custom Hooks ---------- */
  const { validatePRData } = useValidation({
    isBCSDataOutdated,
    prDetailDivRef,
    prItemsDivRef,
    prAttachDivRef,
    prPurchasingInchargeDivRef,
    prDetailsFormRef,
    prPurchasingInchargeFormRef,
    prBCSDivRef,
    prItemsList,
    documentList,
  })

  const { composeCreatePrData, composeUpdatePrData } = useComposeData({
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
  })

  const { isFetchingPR } = useGetPR({
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
  })
  /* ---------- END: Custom Hooks ---------- */

  /* ---------- BEGIN: Computed ---------- */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const submitNewPR = async () => {
    if (!(await validatePRData())) return

    const prData = composeCreatePrData()
    if (!prData) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to compose PR. data. Please try again.',
      })
      return
    }

    try {
      dispatch(showLoading())
      const response = await triggerCreatePR({
        files: prData.files,
        data: prData.data,
      }).unwrap()

      openNotification({
        type: 'success',
        title: 'Create Successful',
        description: 'The purchase requisition has been created successfully.',
      })

      if (response.id) {
        scrollToTop()
        navigate(`/purchase-requisition/${response.id}/edit`)
      }
    } catch (error) {
      // Handle error
      console.error('Failed to create PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to Create PR.',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const submitPRUpdate = async () => {
    if (!id || !prData) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PR. data or ID.',
      })
      return
    }

    if (!(await validatePRData())) return

    const updateData = composeUpdatePrData()
    if (!updateData) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to compose update data. Please try again.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await triggerUpdatePR({ id, data: updateData }).unwrap()
      scrollToTop()
      openNotification({
        type: 'success',
        title: 'Success',
        description: 'Purchase requisition updated successfully.',
      })
    } catch (error) {
      console.error('PR update failed:', error)
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to update purchase requisition.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const handlePRSubmissionWithPasscode = async ({
    passcode,
  }: {
    passcode: string
  }): Promise<void> => {
    if (!id) {
      throw new Error('Invalid PR ID.')
    }

    // Step 1: Compose and save PR data
    // const composedData = composeUpdatePrData()
    // if (!composedData) {
    //   throw new Error('Failed to compose update data. Please try again.')
    // }

    // Step 2: Update PR and submit with approval
    // [2 Oct 2025] NOTE: เอาออกชั่วคราวเพราะมันบัค next approver person
    // [28 Nov 2025] NOTE: ไม่ต้องยิง save ก่อนอีกรอบแล้วเพราะยิง save ไปตั้งแต่ก่อนเปิด modal
    // await triggerUpdatePR({ id, data: composedData }).unwrap()
    await submitWithApproval({ prid: id, passcode }).unwrap()
  }
  /* ---------- END: Computed ---------- */

  return {
    // --- Div Ref ---
    prDetailDivRef,
    prItemsDivRef,
    prAttachDivRef,
    prBCSDivRef,
    prPurchasingInchargeDivRef,
    // --- FORM REF ---
    prDetailsFormRef,
    prBCSFormRef,
    prPurchasingInchargeFormRef,

    // --- STATE ---
    prId: id,
    prData,
    prLoading,
    isFetchingPR,
    // PR Detail Form
    selectedCurrency,
    selectedBudgetType,
    prSelectedBudget,
    exchangeRates,
    selectedMainGroup,
    // PR Items Table
    isMultipleBudget,
    prItemsList,
    prItemsGrandTotal,
    // PR Attachment
    documentList,
    // PR Budget Control Sheet
    budgetControlSheetData,
    isBCSDataOutdated,

    // --- FUNCTION ---
    onSetPrLoading,
    composeUpdatePrData,
    // PR Detail Form
    handleExchangeRateChange,
    onSetPrSelectedBudget,
    onBudgetTypeChange,
    onSetSelectedCurrency,
    onSetMainGroup,
    // PR Items Table
    onSetIsMultipleBudget,
    onSetPrItemsList,
    onSetPrItemsGrandTotal,
    // PR Attachment
    onSetDocumentList,
    // PR Budget Control Sheet
    onSetBudgetControlSheetData,
    setBudgetControlSheetData,
    onSetIsBCSDataOutdated,
    // Other
    composeCreatePrData,
    // Create/Update PR
    submitNewPR,
    submitPRUpdate,
    handlePRSubmissionWithPasscode,
    // Validation
    validatePRData,
    // Modal
    cancelModalHook,
    transferModalHook,
  }
}

export default usePurchaseRequisitionPage
