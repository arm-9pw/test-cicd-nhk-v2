import { FormInstance } from 'antd'

import { POItemType } from 'api/poApi.types'
import { PrBudgetControlSheetType } from 'api/prApi.types'
import { useNotification } from 'hooks/useNotification'

import { PRAttachmentDataType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { scrollIntoViewOptions } from 'constants/index'

import { PRListDropdownType } from '../components/PRListDropdown'

type UseValidationProps = {
  isNotRefPR: boolean
  isRequiredUpdateBCS: boolean
  prList: PRListDropdownType[]
  poItemsList: POItemType[]
  poAttachmentsList: PRAttachmentDataType[]
  budgetControlSheetData: PrBudgetControlSheetType[]
  poDetailsFormRef: FormInstance
  supplierDetailsFormRef: FormInstance
  poDetailDivRef: React.RefObject<HTMLDivElement>
  poSupplierDivRef: React.RefObject<HTMLDivElement>
  poItemsDivRef: React.RefObject<HTMLDivElement>
  poAttachDivRef: React.RefObject<HTMLDivElement>
  poBCSDivRef: React.RefObject<HTMLDivElement>
}

const useValidation = ({
  prList,
  isNotRefPR,
  isRequiredUpdateBCS,
  poItemsList,
  poAttachmentsList,
  budgetControlSheetData,
  poDetailsFormRef,
  supplierDetailsFormRef,
  poDetailDivRef,
  poSupplierDivRef,
  poItemsDivRef,
  poAttachDivRef,
  poBCSDivRef,
}: UseValidationProps) => {
  const { openNotification } = useNotification()

  const validatePODetailForm = async () => {
    try {
      await poDetailsFormRef.validateFields()
    } catch (error) {
      console.error('Validation Failed [Detail Form]:', error)
      if (poDetailDivRef.current) {
        poDetailDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return Promise.reject(new Error('Please check the form fields for errors.'))
    }
  }

  const validateIsRefPRNeedAtLeastOnePR = () => {
    if (!isNotRefPR && prList?.length <= 0) {
      if (poDetailDivRef.current) {
        poDetailDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'You need to have at least one purchase requisition.',
      })
      throw Error('You need to have at least one purchase requisition.')
    }
  }

  const validateSupplierDetailForm = async () => {
    try {
      await supplierDetailsFormRef.validateFields()
    } catch (error) {
      console.error('Validation Failed [Supplier Form]:', error)
      if (poSupplierDivRef.current) {
        poSupplierDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return Promise.reject(new Error('Please check the form fields for errors.'))
    }
  }

  const validatePOItemsAtleastOne = () => {
    if (poItemsList?.length <= 0) {
      if (poItemsDivRef.current) {
        poItemsDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please add Items/รายการสินค้า first.',
      })
      throw Error('Please add Items/รายการสินค้า first.')
    }
  }

  const validatePOAttachmentsAtleastOne = () => {
    if (poAttachmentsList?.length <= 0) {
      if (poAttachDivRef.current) {
        poAttachDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please add Attachments/เอกสาร first.',
      })
      throw Error('Please add Attachments/เอกสาร first.')
    }
  }

  const validateBCS = () => {
    if (isRequiredUpdateBCS) {
      if (poBCSDivRef.current) {
        poBCSDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please update Budget Control Sheet first.',
      })
      throw Error('Please update Budget Control Sheet first.')
    }
  }

  const validateBCSAtleastOne = () => {
    if (budgetControlSheetData?.length <= 0) {
      if (poBCSDivRef.current) {
        poBCSDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please update Budget Control Sheet first.',
      })
      throw Error('Please update Budget Control Sheet first.')
    }
  }

  const validatePO = async () => {
    /* STEPS:
    1 Validate isNotReferPR is false, need to have at least one PR
    1.1 Validate PO detail form
    2. Validate supplier detail form
    3. Validate PO items, need to have at least one item
    4. Validate PO attachments, need to have at least one attachment
    5. Validate budget control sheet, if isRequiredUpdateBCS is true, cannot save PO
      5.1 Validate budget control sheet must have at least one item
    */

    try {
      // NOTE: 1 & 1.1 Validate PO detail form
      validateIsRefPRNeedAtLeastOnePR()
      await validatePODetailForm()

      // NOTE: 2 Validate supplier detail form
      await validateSupplierDetailForm()

      // NOTE: 3 Validate PO items
      validatePOItemsAtleastOne()

      // MAY'S NOTE: ไม่จำเป็นต้องแนบไฟล์อย่างน้อย 1 ไฟล์แล้ว ( requirement เปลี่ยน) จึงยกเลิกการ validate ตรงนี้
      // NOTE: 4 Validate PO attachments
      // validatePOAttachmentsAtleastOne()

      // NOTE: 5 Validate budget control sheet
      validateBCS()
      validateBCSAtleastOne()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { validatePOItemsAtleastOne, validatePO, validatePOAttachmentsAtleastOne }
}

export default useValidation
