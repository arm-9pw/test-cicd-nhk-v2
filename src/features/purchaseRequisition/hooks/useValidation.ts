import { RefObject } from 'react'

import { FormInstance } from 'antd'

import { useNotification } from 'hooks/useNotification'

import { scrollIntoViewOptions } from 'constants/index'

import { PRAttachmentDataType, PrItemType } from '../PurchaseRequisitionPage.types'

type UseValidationProps = {
  prDetailDivRef: RefObject<HTMLDivElement>
  prItemsDivRef: RefObject<HTMLDivElement>
  prAttachDivRef: RefObject<HTMLDivElement>
  prPurchasingInchargeDivRef: RefObject<HTMLDivElement>
  prBCSDivRef: RefObject<HTMLDivElement>
  prDetailsFormRef: FormInstance
  prPurchasingInchargeFormRef: FormInstance
  prItemsList: PrItemType[] // TODO: Add proper type
  documentList: PRAttachmentDataType[] // TODO: Add proper type
  isBCSDataOutdated: boolean
}

/**
 * Custom hook for PR form validation logic
 *
 * Features:
 * 1. Validates PR detail form
 * 2. Validates PR items (requires at least one item)
 * 3. Validates attachments (requires at least one document)
 * 4. Validates purchasing incharge form
 * 5. Handles scroll to error and notifications
 */
const useValidation = ({
  isBCSDataOutdated,
  prDetailDivRef,
  prItemsDivRef,
  prAttachDivRef,
  prPurchasingInchargeDivRef,
  prDetailsFormRef,
  prPurchasingInchargeFormRef,
  prItemsList,
  documentList,
  prBCSDivRef,
}: UseValidationProps) => {
  const { openNotification } = useNotification()

  const validatePRDetails = async (): Promise<boolean> => {
    try {
      await prDetailsFormRef.validateFields()
      return true
    } catch (validationError) {
      console.error('PR Details Validation Failed:', validationError)
      if (prDetailDivRef.current) {
        prDetailDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return false
    }
  }

  const validatePRItems = (): boolean => {
    if (prItemsList.length <= 0) {
      if (prItemsDivRef.current) {
        prItemsDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please add Items/รายการสินค้า first.',
      })
      return false
    }
    return true
  }

  const validateAttachments = (): boolean => {
    if (documentList.length <= 0) {
      if (prAttachDivRef.current) {
        prAttachDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please upload Attachment/เอกสารแนบ first.',
      })
      return false
    }
    return true
  }

  const validatePurchasingIncharge = async (): Promise<boolean> => {
    try {
      await prPurchasingInchargeFormRef.validateFields()
      return true
    } catch (validationError) {
      console.error('Purchasing Incharge Validation Failed:', validationError)
      if (prPurchasingInchargeDivRef.current) {
        prPurchasingInchargeDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return false
    }
  }

  const validateBCSOutdated = (): boolean => {
    if (isBCSDataOutdated) {
      if (prBCSDivRef.current) {
        prBCSDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please update Budget Control Sheet first.',
      })
      return false
    }
    return true
  }

  const validatePRData = async (): Promise<boolean> => {
    // Validate PR details form
    const isValidPRDetails = await validatePRDetails()
    if (!isValidPRDetails) return false

    // Validate PR items
    const isValidPRItems = validatePRItems()
    if (!isValidPRItems) return false

    // MAY'S NOTE: ไม่จำเป็นต้องแนบไฟล์อย่างน้อย 1 ไฟล์แล้ว ( requirement เปลี่ยน) จึงยกเลิกการ validate ตรงนี้
    // Validate attachments
    // const isValidAttachments = validateAttachments()
    // if (!isValidAttachments) return false

    // Validate purchasing incharge form
    const isValidPurchasingIncharge = await validatePurchasingIncharge()
    if (!isValidPurchasingIncharge) return false

    // Validate BCS
    const isValidBCS = validateBCSOutdated()
    if (!isValidBCS) return false

    return true
  }

  return {
    validatePRData,
    validatePRDetails,
    validatePRItems,
    validateAttachments,
    validatePurchasingIncharge,
  }
}

export default useValidation
