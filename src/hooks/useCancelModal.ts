import { useEffect, useState } from 'react'

import { Form, UploadFile } from 'antd'

import { AttachmentFileType } from 'api/attachmentApi.types'
import { useCancelPOMutation } from 'api/poApi'
import { useCancelPRMutation } from 'api/prApi'
import { CancelPurchaseLogDTO, PurchaseLogRequest, PurchaseLogType } from 'api/purchaseLogApi.types'
import { useNotification } from 'hooks/useNotification'

import { DOMAINS } from 'constants/index'
import { formatToLocalDateTime } from 'utils/dateHelpers'

type Props = {
  requesterName: string
  requesterSite: string
  requesterSection: string
  domainNo: string
  domainDate: string
  domain: (typeof DOMAINS)[keyof typeof DOMAINS]
  domainId: string
  domainStatus: string
  cancelData?: PurchaseLogType | null
  hideModal: () => void
}

const useCancelModal = ({
  requesterName,
  requesterSite,
  requesterSection,
  domainNo,
  domainDate,
  domain,
  domainId,
  domainStatus,
  cancelData,
  hideModal,
}: Props) => {
  const [cancelFormRef] = Form.useForm()
  const { openNotification } = useNotification()
  const [cancelPR, { isLoading: isCancelingPR }] = useCancelPRMutation()
  const [cancelPO, { isLoading: isCancelingPO }] = useCancelPOMutation()

  const [fileList, setFileList] = useState<AttachmentFileType[]>([])

  useEffect(() => {
    if (cancelData) {
      const fileList = cancelData?.documentAttachFiles
        ? cancelData?.documentAttachFiles?.map((file) => ({
            key: file.id,
            domain: file.domain,
            documentType: file.documentType,
            documentNo: file.documentNo,
            documentDate: file.documentDate,
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            id: file.id,
          }))
        : []
      setFileList(fileList)
    }
  }, [cancelData, setFileList])

  const validateForm = async (): Promise<boolean> => {
    try {
      await cancelFormRef.validateFields()
      return true
    } catch (error) {
      console.error('Validation failed:', error)
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return false
    }
  }

  // Helper function to prepare data
  const prepareData = (): PurchaseLogRequest => {
    const data: PurchaseLogRequest = {
      poId: null,
      poNo: null,
      poDate: null,
      prId: null,
      prNo: null,
      prDate: null,
      reasonApprove: null, // NOTE: Implement later in phase2
      approverName: null, // NOTE: Implement later in phase2
      approverSite: null, // NOTE: Implement later in phase2
      approverSection: null, // NOTE: Implement later in phase2
      reasonCancel: cancelFormRef.getFieldValue('reasonCancel'),
      requesterName,
      requesterSite,
      requesterSection,
      status: domainStatus,
      documentAttachFiles: fileList?.map((item) => ({
        domain: item.domain,
        documentType: item.documentType,
        documentNo: item.documentNo,
        documentDate: item.documentDate,
        fileName: item.fileName,
      })),
    }

    if (domain === DOMAINS.PURCHASE_ORDER) {
      data.poId = domainId
      data.poNo = domainNo
      data.poDate = formatToLocalDateTime(domainDate)
    } else if (domain === DOMAINS.PURCHASE_REQUISITION) {
      data.prId = domainId
      data.prNo = domainNo
      data.prDate = formatToLocalDateTime(domainDate)
    }

    return data
  }

  // Helper function to get valid files
  const getValidFiles = (): UploadFile[] => {
    return (
      fileList?.map((item) => item.file).filter((file): file is UploadFile => file !== undefined) ||
      []
    )
  }

  // [17 Feb 2025] MAY'S NOTE ไม่ได้ใช้แล้ว ย้ายไปใช้ onSaveCancelPR, onSaveCancelPO
  // const onSaveCancel = async () => {
  //   const isValid = await validateForm()
  //   if (!isValid) return

  //   try {
  //     const data = prepareData()
  //     const files = getValidFiles()

  //     const requestBody: CancelPurchaseLogDTO = {
  //       data,
  //       files,
  //     }

  //     await cancelPurchaseLog(requestBody).unwrap()
  //     openNotification({
  //       title: 'Success',
  //       type: 'success',
  //       description: 'Purchase requisition cancel has been submitted.',
  //     })
  //     hideModal()
  //   } catch (error) {
  //     console.error('Failed to cancel purchase requisition:', error)
  //     openNotification({
  //       title: 'Error',
  //       description: 'Failed to cancel purchase requisition. Please try again.',
  //     })
  //   }
  // }

  const onSaveCancelPR = async () => {
    const isValid = await validateForm()
    if (!isValid) return

    try {
      const data = prepareData()
      const files = getValidFiles()

      const requestBody: CancelPurchaseLogDTO = {
        data,
        files,
      }

      await cancelPR(requestBody).unwrap()
      openNotification({
        title: 'Success',
        type: 'success',
        description: 'Purchase requisition cancel has been submitted.',
      })
      hideModal()
    } catch (error) {
      console.error('Failed to cancel purchase requisition:', error)
      openNotification({
        title: 'Error',
        description: 'Failed to cancel purchase requisition. Please try again.',
      })
    }
  }

  const onSaveCancelPO = async () => {
    const isValid = await validateForm()
    if (!isValid) return

    try {
      const data = prepareData()
      const files = getValidFiles()

      const requestBody: CancelPurchaseLogDTO = {
        data,
        files,
      }

      await cancelPO(requestBody).unwrap()
      openNotification({
        title: 'Success',
        type: 'success',
        description: 'Purchase order cancel has been submitted.',
      })
      hideModal()
    } catch (error) {
      console.error('Failed to cancel purchase order:', error)
      openNotification({
        title: 'Error',
        description: 'Failed to cancel purchase order. Please try again.',
      })
    }
  }

  // [18 Feb 2025] MAY'S NOTE ไม่ได้ใช้แล้ว Approve cancel implement แยก
  // const onConfirmCancel = async () => {
  //   if (!cancelData?.id) {
  //     openNotification({
  //       title: 'Error',
  //       type: 'error',
  //       description: 'Cannot find cancel id, please try again.',
  //     })
  //     return
  //   }

  //   try {
  //     await approvePurchaseLog({ id: cancelData?.id, domain, domainId }).unwrap()
  //     openNotification({
  //       title: 'Success',
  //       type: 'success',
  //       description: 'Confirm cancel successfully.',
  //     })
  //     hideModal()
  //   } catch (error) {
  //     console.error('Error confirming cancel:', error)
  //     openNotification({
  //       title: 'Error',
  //       type: 'error',
  //       description: 'Failed to confirm cancel. Please try again.',
  //     })
  //   }
  // }

  // [18 Feb 2025] MAY'S NOTE ไม่ได้ใช้แล้ว Approve cancel implement แยก
  // const onDeleteCancel = async () => {
  //   if (!cancelData?.id) {
  //     openNotification({
  //       title: 'Error',
  //       type: 'error',
  //       description: 'Cannot find cancel id, please try again.',
  //     })
  //     return
  //   }

  //   try {
  //     await deletePurchaseLog({ id: cancelData.id, domain, domainId }).unwrap()
  //     openNotification({
  //       title: 'Success',
  //       type: 'success',
  //       description: 'Reject cancel successfully.',
  //     })
  //     hideModal()
  //   } catch (error) {
  //     console.error('Error rejecting cancel:', error)
  //     openNotification({
  //       title: 'Error',
  //       type: 'error',
  //       description: 'Failed to reject cancel. Please try again.',
  //     })
  //   }
  // }

  return {
    cancelFormRef,
    fileList,
    setFileList,
    isLoading: isCancelingPR || isCancelingPO,
    onSaveCancelPR,
    onSaveCancelPO,
  }
}

export default useCancelModal
