import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Form, FormInstance, UploadFile } from 'antd'
import { valueType } from 'antd/es/statistic/utils'

import { downloadDocument } from 'api/attachmentApi'
import { UserInfoType } from 'api/authApi.types'
import {
  useCreateGRDocumentMutation,
  useCreateGRMutation,
  useDeleteGRDocumentMutation,
  useDeleteGRMutation,
  useLazyGetGRByIdQuery,
  useLazyGetGRDocumentsQuery, // useLazyGetGRHistoryQuery,
  useLazyGetPOGRRemainingItemsQuery,
  useLazyGetPOGRsQuery,
  useUpdateGRDocumentMutation,
  useUpdateGRMutation,
} from 'api/grApi'
import {
  GRDocumentItemType, // GRHistoryDataType,
  GRbyIdDataType,
  GRinvoiceItem,
  GoodReceiveItemType,
  PurchaseOrderItemType,
  TPOGRItem,
  TPOGRRemainingItem,
  createGRRequestDataType,
  requesterInfoType,
  updateGRRequestDataType,
} from 'api/grApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import useFileManagement from 'hooks/useFileManagement'
import { useNotification } from 'hooks/useNotification'

import { PAGE_MODE } from 'constants/index'
import { formatDisplayDate, formatToLocalDateTime, getDateFromString } from 'utils/dateHelpers'
import { formatNumber } from 'utils/generalHelpers'

import { isGRDoctypeRequireBudgetCode } from '../constant'

const GR_DOMAIN = 'GOOD_RECEIVE'

type Props = {
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  GRID: string
  user: UserInfoType | null
}

const useGoodRecievePage = ({ mode, GRID, user }: Props) => {
  //
  // ######  ########    ###    ######## ########
  // ##    ##    ##      ## ##      ##    ##
  // ##          ##     ##   ##     ##    ##
  //  ######     ##    ##     ##    ##    ######
  //       ##    ##    #########    ##    ##
  // ##    ##    ##    ##     ##    ##    ##
  //  ######     ##    ##     ##    ##    ########

  // const [isGRHistoryModalOpen, setIsGRHistoryModalOpen] = useState<boolean>(false)
  const [selectedGRinvoiceItemKeys, setSelectedGRinvoiceItemKeys] = useState<React.Key[]>([])
  const [deletedGRInvoiceItems, setDeletedGRInvoiceItems] = useState<GRinvoiceItem[]>([])
  const [selectedGRNo, setSelectedGRNo] = useState<string>('')
  const [selectedPOID, setSelectedPOID] = useState<string>('')
  const [selectedGRDate, setSelectedGRDate] = useState<string>('')
  const [GRSearchItemInputValue, setGRSearchItemInputValue] = useState<string>('')
  const [GRinvoiceItems, setGRInvoiceItems] = useState<GRinvoiceItem[]>([])
  const [attachFiles, setAttachFiles] = useState<GRDocumentItemType[]>([])
  const [triggerGRSearchItemInputChanged, setTriggerGRSearchItemInputChanged] =
    useState<boolean>(false)
  const [POGR, setPOGR] = useState<TPOGRItem>()
  const dispatch = useAppDispatch()
  const [GRForm] = Form.useForm()
  const [GRIForm] = Form.useForm()
  const [GRAForm] = Form.useForm()
  const { openNotification } = useNotification()
  const GRDetailDivRef = useRef<HTMLDivElement | null>(null)
  const GRItemsDivRef = useRef<HTMLDivElement | null>(null)
  const GRAttachDivRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { handleDownloadLocalFile } = useFileManagement({})
  const [isPOFullyReceived, setIsPOFullyReceived] = useState<boolean>(false)

  const scrollIntoViewOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
  }

  const clearGRFormValues = useCallback(() => {
    GRForm.setFieldsValue({
      poDate: '',
      // grNo: '',
      // grDate: '',
      prNo: '',
      prDate: '',
      supplierName: '',
      paymentTermName: '',
      receiveCondition: '',
      comment: '',
    })
  }, [GRForm])

  const [
    triggerGetPOGRs,
    {
      data: POGRs,
      isLoading: isLoadingPOGRs,
      isFetching: isFetchingPOGRs,
      isError: isErrorPOGRs,
      // currentData
    },
  ] = useLazyGetPOGRsQuery()

  // useCreateGRMutation
  const [triggerCreateGR] = useCreateGRMutation()

  const [
    triggerUpdateGR,
    {
      //   data: updatedGR,
      isLoading: isUpdatingGR,
      //   isError: isUpdateGRError,
    },
  ] = useUpdateGRMutation()

  // useGetGRByIdQuery
  const [
    triggerGetGRByIdQuery,
    {
      data: GRFromAPI,
      isLoading: isLoadingGRFromAPI,
      // isFetching: isFetchingGRFromAPI,
      // isError: isErrorGRFromAPI,
      // currentData: currentGRFromAPI,
    },
  ] = useLazyGetGRByIdQuery()

  //    ###    ########  ####
  //   ## ##   ##     ##  ##
  //  ##   ##  ##     ##  ##
  // ##     ## ########   ##
  // ######### ##         ##
  // ##     ## ##         ##
  // ##     ## ##        ####
  const [
    triggerGetPOGRRemainingItems,
    {
      data: POGRRemainingItems,
      isLoading: isLoadingPOGRRemainingItems,
      // isFetching: isFetchingPOGRRemainingItems,
      isError: isErrorPOGRRemainingItems,
      // currentData: currentPOGRRemainingItems,
    },
  ] = useLazyGetPOGRRemainingItemsQuery()

  const [
    triggerGetGRDocuments,
    {
      data: GRDocuments,
      isLoading: isLoadingGRDocuments,
      // isFetching: isFetchingGRDocuments,
      // isError: isErrorGRDocuments,
      // currentData
    },
  ] = useLazyGetGRDocumentsQuery()

  const [
    triggerCreateGRDocument,
    //   // , {
    //   //   data: createdGRDocument,
    //   //   isLoading: isCreatingGRDocument,
    //   //   isError: isCreatingGRDocumentError,
    //   // }
  ] = useCreateGRDocumentMutation()

  const [
    triggerUpdateGRDocument,
    {
      // data: updatedGRDocument,
      isLoading: isUpdatingGRDocument,
      // isError: isUpdateGRDocumentError,
    },
  ] = useUpdateGRDocumentMutation()

  const [
    triggerDeleteGRDocument,
    {
      // data: deletedGRDocument,
      isLoading: isDeletingGRDocument,
      // isError: isDeleteGRDocumentError,
    },
  ] = useDeleteGRDocumentMutation()

  const [triggerDeleteGR] = useDeleteGRMutation()

  const onDeleteGR = async () => {
    if (!GRID) {
      openNotification({
        title: 'Error',
        description: 'Unable to delete GR. GRID is empty.',
      })
      return
    }
    try {
      dispatch(showLoading())
      await triggerDeleteGR(GRID).unwrap()
      openNotification({
        type: 'success',
        title: 'Delete Successful',
        description: 'The GR has been deleted.',
      })
      navigate('/good-receive') // redirect ไปยังหน้า list
    } catch (error) {
      console.error('Failed to delete GR:', error)
      openNotification({
        title: 'Error',
        description: 'Failed to delete GR. Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  // useLazyGetGRHistoryQuery
  // const [
  //   triggerGetGRHistory,
  //   {
  //     data: GRHistoryFromAPI,
  //     isLoading: isLoadingGRHistory,
  //     // isFetching: isFetchingGRHistory,
  //     // isError: isErrorGRHistory,
  //     // currentData: currentGRHistory,
  //   },
  // ] = useLazyGetGRHistoryQuery()

  //
  // ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##
  // ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ##
  // ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ##
  // ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##
  // ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####
  // ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ###
  // ##        #######  ##    ##  ######     ##    ####  #######  ##    ##
  //

  const notifyUserIfPOGRRemainingItemsHaveNoRecievableItemsLeft = useCallback(
    (purchaseOrderItems: PurchaseOrderItemType[]) => {
      if (Array.isArray(purchaseOrderItems)) {
        const remainingItems = purchaseOrderItems.filter((item) => item.receiveQty > 0)

        if (remainingItems.length <= 0) {
          setIsPOFullyReceived(true)
          openNotification({
            type: 'info',
            title: 'This PO. has no remaining items',
            description: 'รายการรับสินค้าตามใน PO. ครบจำนวนแล้ว',
          })
        } else if (remainingItems.length > 0) {
          setIsPOFullyReceived(false)
        }
      }
    },
    [openNotification],
  )

  const StringOrNumberToNumber = (value: string | number | null | undefined) => {
    if (typeof value === 'string') {
      return parseFloat(value)
    } else if (typeof value === 'number') {
      return value
    } else {
      return 0
    }
  }

  const convertGRinvoiceItemsToGoodReceiveItems = useCallback(
    (GRinvoiceItems: GRinvoiceItem[], isRemoveAllIds: boolean) => {
      return GRinvoiceItems.map((item) => ({
        id: isRemoveAllIds ? undefined : item.GRIid,
        name: item.GRIname,
        model: item.GRImodel,
        brand: item.GRIbrand,
        detail: item.GRIdetail,
        qty: item.GRIqty ? item.GRIqty : 0,
        unitPrice: item.GRIunitPrice ? item.GRIunitPrice : 0,
        netTotal: item.GRInetTotal ? Number(item.GRInetTotal) : 0,
        invoiceReceiveName: item.GRIinvoiceReceiveName,
        invoiceNo: item.GRIinvoiceNo,
        invoiceDate: item.GRIinvoiceDate,
        paidDate: item.GRIpaidDate,
        remark: item.GRIremark,
        unit: item.GRIunit,
        matCode: item.matCode,
      }))
    },
    [],
  )

  const convertGoodReceiveItemsToGRinvoiceItems = useCallback(
    (goodReceiveItems: GoodReceiveItemType[]) => {
      return goodReceiveItems.map((item, index) => ({
        GRIid: item.id,
        GRIname: item.name ? item.name : '',
        GRImodel: item.model ? item.model : '',
        GRIbrand: item.brand ? item.brand : '',
        GRIdetail: item.detail ? item.detail : '',
        GRIqty: item.qty,
        GRIunitPrice: StringOrNumberToNumber(item.unitPrice),
        GRInetTotal: StringOrNumberToNumber(item.netTotal),
        GRIinvoiceReceiveName: item.invoiceReceiveName ? item.invoiceReceiveName : '',
        GRIinvoiceNo: item.invoiceNo ? item.invoiceNo : '',
        GRIinvoiceDate: item.invoiceDate ? item.invoiceDate : '',
        GRIpaidDate: item.paidDate ? item.paidDate : '',
        GRIremark: item.remark ? item.remark : '',
        GRIunit: item.unit ? item.unit : '',
        matCode: item.matCode,
        //
        GRIkey: `${index}`,
        GRIno: index + 1,
        GRImaxReceiveQty: item.qty,
        GRImaxReceivePrice: item.unitPrice,
        //
        key: `${index}`,
      }))
    },
    [],
  )

  const convertPurchaseOrderItemsToGRinvoiceItems = useCallback(
    (purchaseOrderItems: PurchaseOrderItemType[], isRemoveZeroQtyRecord: boolean) => {
      let newGRinvoiceItems = purchaseOrderItems.map((item, index) => ({
        GRIid: item.id,
        GRIname: item.name ? item.name : '',
        GRImodel: item.model ? item.model : '',
        GRIbrand: item.brand ? item.brand : '',
        GRIdetail: item.detail ? item.detail : '',
        GRIqty: item.receiveQty,
        GRIunitPrice: StringOrNumberToNumber(item.receivePrice),
        // GRInetTotal:
        //   StringOrNumberToNumber(item.receiveQty) * StringOrNumberToNumber(item.receivePrice),
        GRInetTotal: formatNumber(
          StringOrNumberToNumber(item.receiveQty) * StringOrNumberToNumber(item.receivePrice),
        ),
        GRIinvoiceReceiveName: '',
        GRIinvoiceNo: '',
        GRIinvoiceDate: '',
        GRIpaidDate: '',
        GRIremark: '',
        GRIunit: '',
        matCode: item.matCode,
        //
        GRIkey: `${index}`,
        GRIno: index + 1,
        GRImaxReceiveQty: item.receiveQty,
        GRImaxReceivePrice: item.receivePrice,
        //
        key: `${index}`,
      }))

      if (isRemoveZeroQtyRecord) {
        newGRinvoiceItems = newGRinvoiceItems.filter((item) => item.GRIqty > 0)
      }

      return newGRinvoiceItems
    },
    [],
  )

  const mergeGRinvoiceItemsFromGRFromAPIAndPOGRRemainingItems = useCallback(
    (GoodReceiveItems: GoodReceiveItemType[], PurchaseOrderItems: PurchaseOrderItemType[]) => {
      // use GRFromAPI as base
      // use POGRRemainingItems as reference

      const base = convertGoodReceiveItemsToGRinvoiceItems(GoodReceiveItems)
      const reference = PurchaseOrderItems

      // merge base and reference
      // base.GRImaxReceiveQty = reference.receiveQty + base.GRIqty

      // TODO id from both side still never match
      // need to wait for the backend to fix this
      // use GRIname as a key for now
      const newGRinvoiceItems = base.map((item) => {
        const referenceItem = reference.find((ref) => ref.name === item.GRIname)
        if (referenceItem) {
          const newGRinvoiceItem = {
            ...item,
            GRImaxReceiveQty: referenceItem.receiveQty + item.GRIqty,
            GRImaxReceivePrice: referenceItem.receivePrice,
          }

          return newGRinvoiceItem
        } else {
          console.error(
            'mergeGRinvoiceItemsFromGRFromAPIAndPOGRRemainingItems(): referenceItem not found',
            {
              item,
              reference,
            },
          )
          return item
        }
      })

      return newGRinvoiceItems
    },
    [convertGoodReceiveItemsToGRinvoiceItems],
  )

  const regenerateIsNewRowForAttachFiles = (attachFiles: GRDocumentItemType[]) => {
    // set isNewRow to false for all rows except the last row
    if (Array.isArray(attachFiles) && attachFiles.length > 0) {
      let newAttachFiles = [...attachFiles]
      newAttachFiles = newAttachFiles.map((item, index) => {
        if (index < newAttachFiles.length - 1) {
          return {
            ...item,
            isNewRow: false,
          }
        }
        return item
      })
      return newAttachFiles
    } else {
      console.error('regenerateIsNewRowForAttachFiles(): attachFiles is not an array or empty', {
        attachFiles,
      })
      return attachFiles
    }
  }

  const clearGRAformFieldsForNewRow = () => {
    for (const record of attachFiles) {
      if (record.isNewRow) {
        GRAForm.setFieldsValue({
          [`documentNo-${record.key}`]: '',
          [`documentDate-${record.key}`]: '',
          [`documentType-${record.key}`]: '',
          [`price-${record.key}`]: '',
          // [`budgetCode-${record.key}`]: '',
        })
      }
    }
  }

  const StringOrNumberToString = (value: string | number | null | undefined) => {
    if (typeof value === 'string') {
      return value
    } else if (typeof value === 'number') {
      return value.toString()
    } else {
      return ''
    }
  }

  const onClickSetAllGRInvoiceItems = () => {
    // get field name SETALLinvReceiveName, SETALLinvNo, SETALLinvDate from GRForm
    // and set it to all GRinvoiceItems
    const fv = GRIForm.getFieldsValue()

    const SETALLinvReceiveName = fv.SETALLinvReceiveName
    const SETALLinvNo = fv.SETALLinvNo
    const SETALLinvDate = fv.SETALLinvDate
    const SETALLpaidDate = fv.SETALLpaidDate

    let items = [...GRinvoiceItems]

    if (SETALLinvReceiveName) {
      items = items.map((item) => ({
        ...item,
        GRIinvoiceReceiveName: SETALLinvReceiveName,
      }))
    }

    if (SETALLinvNo) {
      items = items.map((item) => ({
        ...item,
        GRIinvoiceNo: SETALLinvNo,
      }))
    }

    if (SETALLinvDate) {
      const newDate = SETALLinvDate ? formatToLocalDateTime(SETALLinvDate.toString()) : ''

      items = items.map((item) => ({
        ...item,
        GRIinvoiceDate: newDate,
      }))
    }

    if (SETALLpaidDate) {
      const newDate = SETALLpaidDate ? formatToLocalDateTime(SETALLpaidDate.toString()) : ''

      items = items.map((item) => ({
        ...item,
        GRIpaidDate: newDate,
      }))
    }

    setGRInvoiceItems(items)
  }

  const clearAttachFileAndAddNewRow = () => {
    setAttachFiles([
      {
        documentNo: '',
        documentDate: '',
        fileName: '',
        fileUrl: '',
        fileSize: '',
        mimeType: '',
        domain: '',
        refId: '',
        documentType: '',
        id: '',
        key: '0',
        no: 1,
        isNewRow: true,
        budgetCode: '',
        price: '',
      },
    ])
  }

  const addNewEmptyRowOfAttachFile = (attachFiles: GRDocumentItemType[]) => {
    const newLength = attachFiles.length

    // Add new empty row for new row
    const newAttachFilesEmptyRow: GRDocumentItemType = {
      documentNo: '',
      documentDate: '',
      fileName: '',
      fileUrl: '',
      fileSize: '',
      mimeType: '',
      domain: '',
      refId: '',
      documentType: '',
      id: '',
      key: `${newLength + 1}`,
      no: newLength + 1,
      isNewRow: true,
      budgetCode: '',
      price: '',
      file: undefined,
    }

    return [...attachFiles, newAttachFilesEmptyRow]
  }

  const validateGRData = async (): Promise<boolean> => {
    try {
      await GRForm.validateFields()
      try {
        await GRIForm.validateFields()
      } catch (validationError) {
        console.error('Validation Failed:', validationError)
        if (GRItemsDivRef.current) {
          GRItemsDivRef.current.scrollIntoView(scrollIntoViewOptions)
        }
        openNotification({
          title: 'Validation Error',
          description: 'Please check the form fields for errors.',
        })
        return false
      }
    } catch (validationError) {
      console.error('Validation Failed:', validationError)
      if (GRDetailDivRef.current) {
        GRDetailDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return false
    }
    return true
  }

  const composeGRData = ({
    mode,
    POGRRemainingItems,
    GRForm,
    GRinvoiceItems,
    attachFiles,
    GRFromAPI,
    selectedRequester,
  }: {
    mode: string
    POGRRemainingItems: TPOGRRemainingItem | undefined
    GRForm: FormInstance
    GRinvoiceItems: GRinvoiceItem[]
    attachFiles: GRDocumentItemType[]
    GRFromAPI: GRbyIdDataType | undefined
    selectedRequester: requesterInfoType
  }) => {
    // CREATE mode
    if (mode === PAGE_MODE.CREATE) {
      const filteredAttachFile = attachFiles.filter(
        (item) =>
          item.file &&
          // item.file.status !== 'removed' &&
          item.file?.name &&
          item.documentType &&
          item.documentType !== '',
      )

      // MAY'S NOTE: ไม่จำเป็นต้องแนบไฟล์อย่างน้อย 1 ไฟล์แล้ว ( requirement เปลี่ยน) จึงยกเลิกการ validate ตรงนี้
      // if (filteredAttachFile.length <= 0) {
      //   openNotification({
      //     title: 'Invalid attachFiles data',
      //     description: 'Please add attachFiles first.',
      //   })
      //   if (GRAttachDivRef.current) {
      //     GRAttachDivRef.current.scrollIntoView(scrollIntoViewOptions)
      //   }
      //   return null
      // }

      // verify every file in attachFiles has file.name
      const hasInvalidFileName = filteredAttachFile.some((item) => !item.file?.name)
      if (hasInvalidFileName) {
        openNotification({
          title: 'Invalid attachFiles data',
          description: 'One or more attachFiles has no file name.',
        })
        return null
      }

      if (!POGRRemainingItems || !POGRRemainingItems.id) {
        console.error('Unable to find POGRRemainingItems ID', { POGRRemainingItems })

        openNotification({
          title: 'Error',
          description: 'Unable to find POGRRemainingItems ID',
        })

        return null
      }

      const data: createGRRequestDataType = {
        data: {
          purchaseOrderId: POGRRemainingItems.id,
          comment: GRForm.getFieldValue('comment'),
          goodReceiveItems: convertGRinvoiceItemsToGoodReceiveItems(GRinvoiceItems, true),
          documentAttachFiles: filteredAttachFile.map((item) => ({
            domain: GR_DOMAIN,
            documentNo: item.documentNo,
            documentDate: item.documentDate,
            documentType: item.documentType,
            budgetCode: item.budgetCode,
            fileName: item.file?.name,
            price: StringOrNumberToString(item.price),
          })),
          requesterId: selectedRequester?.requesterId,
          requesterName: selectedRequester?.requesterName,
          requesterSite: selectedRequester?.requesterSite,
          requesterSection: selectedRequester?.requesterSection,
          requesterSectionId: selectedRequester?.requesterSectionId,
        },
        files: filteredAttachFile.map((item) => ({
          ...item,
          file: item.file as UploadFile,
          id: undefined, // remove id for CREATE mode only
        })),
      }

      // MAY'S NOTE: ไม่จำเป็นต้องแนบไฟล์อย่างน้อย 1 ไฟล์แล้ว ( requirement เปลี่ยน) จึงยกเลิกการ validate ตรงนี้
      // if (data.files.length <= 0) {
      //   openNotification({
      //     title: 'Invalid attachFiles data',
      //     description: 'Please add attachFiles first.',
      //   })
      //   return null
      // }

      return data
    } else if (mode === PAGE_MODE.EDIT) {
      if (!GRFromAPI) {
        console.error('GRFromAPI is undefined', { GRFromAPI })

        openNotification({
          title: 'Error',
          description: 'GRFromAPI is undefined',
        })

        return null
      }

      const data: updateGRRequestDataType = {
        id: GRID,
        purchaseOrderId: GRFromAPI?.purchaseOrderId ? GRFromAPI.purchaseOrderId : '',
        grNo: selectedGRNo,
        // grDate: formatDisplayDate(selectedGRDate),
        grDate: formatToLocalDateTime(selectedGRDate),
        comment: GRForm.getFieldValue('comment'),
        purchaseStatus: 'GR_PENDING',
        goodReceiveItems: convertGRinvoiceItemsToGoodReceiveItems(GRinvoiceItems, false),
        requesterId: selectedRequester?.requesterId,
        requesterName: selectedRequester?.requesterName,
        requesterSite: selectedRequester?.requesterSite,
        requesterSection: selectedRequester?.requesterSection,
        requesterSectionId: selectedRequester?.requesterSectionId,
      }

      return data
    }
  }

  const onCreateGR = async (createData: createGRRequestDataType) => {
    if (!POGRRemainingItems || !POGRRemainingItems.id) {
      console.error('Unable to find POGRRemainingItems ID', { POGRRemainingItems })
      throw new Error('Unable to find POGRRemainingItems ID')
    }

    dispatch(showLoading())
    try {
      const response = await triggerCreateGR(createData).unwrap()

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      if (response) {
        if (response.grNo) {
          setSelectedGRNo(response.grNo)
        } else {
          setSelectedGRNo('')
          // Error
          openNotification({
            title: 'Error',
            description: 'GR. was created but GR. No is empty.',
          })
        }

        if (response.grDate) {
          setSelectedGRDate(response.grDate)
        } else {
          setSelectedGRDate('')
          // Error
          openNotification({
            title: 'Error',
            description: 'GR. was created but GR. Date is empty.',
          })
        }

        if (response.id) {
          const newGRid = response.id

          // use GR ID to get GR documents
          const getGRDocumentsResp = await triggerGetGRDocuments(newGRid)
          if (getGRDocumentsResp && Array.isArray(getGRDocumentsResp?.data)) {
            let newAttachFiles = getGRDocumentsResp.data.map((item, index) => {
              return {
                ...item,
                key: `${index}`,
                no: index + 1,
              }
            }) as GRDocumentItemType[]

            newAttachFiles = regenerateIsNewRowForAttachFiles(newAttachFiles)

            setAttachFiles(newAttachFiles)
          } else {
            console.error('Failed to get GR documents: unexpected getGRDocumentsResp.data ', {
              getGRDocumentsResp,
            })
            openNotification({
              title: 'Failed to Get Attachments',
              description: 'Unexpected getGRDocumentsResp.data',
            })
          }
        } else {
          openNotification({
            title: 'Error',
            description: 'GR. was created but GR. ID is empty.',
          })
        }
      }

      if (Array.isArray(response.goodReceiveItems)) {
        const newGRinvoiceItems = convertGoodReceiveItemsToGRinvoiceItems(response.goodReceiveItems)

        setGRInvoiceItems(newGRinvoiceItems)
      } else {
        console.error('Failed to get GR items: unexpected response data', response)
        openNotification({
          title: 'Failed to Get GR. Items',
          description: 'Unexpected response data. response.goodReceiveItems is not an array.',
        })
      }

      openNotification({
        type: 'success',
        title: 'Update Successful',
        description: 'The good receive has been created successfully.',
      })

      return response
    } catch (error) {
      console.error('Failed to create GR:', error)
      openNotification({
        title: 'Failed to create GR.',
        description: 'Please try again later.',
      })
      throw error
    } finally {
      dispatch(hideLoading())
    }
  }

  const onUpdateGR = async (updateData: updateGRRequestDataType) => {
    dispatch(showLoading())
    try {
      const updateGRresp = await triggerUpdateGR(updateData).unwrap()
      await triggerGetGRByIdQuery(GRID).unwrap()
      await triggerGetPOGRRemainingItems({ id: selectedPOID, page: '0', sizePerPage: '1' })

      if (updateGRresp) {
        if (updateGRresp.grNo) {
          //
        } else {
          // Error
          openNotification({
            title: 'Error',
            description: 'GR. was updated but GR. No is empty.',
          })
        }

        if (updateGRresp.grDate) {
          //
        } else {
          //
          // Error
          openNotification({
            title: 'Error',
            description: 'GR. was updated but GR. Date is empty.',
          })
        }

        if (updateGRresp.id) {
          //
        } else {
          // Error
          openNotification({
            title: 'Error',
            description: 'GR. was updated but GR. ID is empty.',
          })
        }
      }

      openNotification({
        type: 'success',
        title: 'Update Successful',
        description: 'The good receive has been updated successfully.',
      })

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return updateGRresp
    } catch (error) {
      console.error('Failed to update GR:', error)
      openNotification({
        title: 'Failed to Update GR.',
        description: 'Please contact the system administrator.',
      })
      throw error
    } finally {
      dispatch(hideLoading())
    }
  }

  const onSubmitUpdateGR = async () => {
    if (!(await validateGRData())) {
      return
    }

    // Compose GR data
    const composedGRData = composeGRData({
      mode,
      POGRRemainingItems,
      GRForm,
      GRinvoiceItems,
      attachFiles,
      GRFromAPI,
      selectedRequester: selectedRequester,
    })

    if (!composedGRData) {
      return
    }

    // if mode is 'CREATE'
    if (mode === PAGE_MODE.CREATE) {
      try {
        const CreateGRResponse = await onCreateGR(composedGRData as createGRRequestDataType)

        // if success, navigate to edit mode
        if (CreateGRResponse && CreateGRResponse.id) {
          navigate(`/good-receive/${CreateGRResponse.id}/edit`)
        }
      } catch (error) {
        // Error already handled in onCreateGR
        console.error('Create GR failed:', error)
      }
    } else if (mode === PAGE_MODE.EDIT) {
      try {
        await onUpdateGR(composedGRData as updateGRRequestDataType)
      } catch (error) {
        // Error already handled in onUpdateGR
        console.error('Update GR submission failed:', error)
      }
    }
  }

  const onDeleteAttachFile = async (key: string) => {
    let newAttachFiles = [...attachFiles]

    // for 'CREATE' mode, remove the row
    if (mode === PAGE_MODE.CREATE) {
      newAttachFiles = attachFiles.filter((item) => item.key !== key)

      // regenerate key and no
      newAttachFiles = newAttachFiles.map((item, index) => {
        return {
          ...item,
          key: `${index}`,
          no: index + 1,
        }
      })

      // if there is only one row left, assume the row is new one, clear the row's data
      if (newAttachFiles.length === 1) {
        newAttachFiles = [
          {
            documentNo: '',
            documentDate: '',
            fileName: '',
            fileUrl: '',
            fileSize: '',
            mimeType: '',
            domain: '',
            refId: '',
            documentType: '',
            id: '',
            key: '0',
            no: 1,
            isNewRow: true,
            budgetCode: '',
            price: '',
          },
        ]
      }

      newAttachFiles = regenerateIsNewRowForAttachFiles(newAttachFiles)
      clearGRAformFieldsForNewRow()
      setAttachFiles(newAttachFiles)

      return
    } else if (mode === PAGE_MODE.EDIT) {
      // for 'EDIT' mode, call API to delete the file
      const record = attachFiles.find((item) => item.key === key)
      if (record?.id) {
        try {
          await triggerDeleteGRDocument(record.id)

          // get GR documents into newAttachFiles
          const resp = await triggerGetGRDocuments(GRID).unwrap()

          if (resp && Array.isArray(resp)) {
            newAttachFiles = resp.map((item, index) => {
              return {
                ...item,
                key: `${index}`,
                no: index + 1,
                // isNewRow: false,
              }
            })

            // if there is only one row left, assume the row is new one, clear the row's data
            if (newAttachFiles.length === 1) {
              newAttachFiles = [
                {
                  documentNo: '',
                  documentDate: '',
                  fileName: '',
                  fileUrl: '',
                  fileSize: '',
                  mimeType: '',
                  domain: '',
                  refId: '',
                  documentType: '',
                  id: '',
                  key: '0',
                  no: 1,
                  isNewRow: true,
                  budgetCode: '',
                  price: '',
                },
              ]
            }

            newAttachFiles = regenerateIsNewRowForAttachFiles(newAttachFiles)
            clearGRAformFieldsForNewRow()
            setAttachFiles(newAttachFiles)
            return
          } else {
            console.error('Failed to get GR documents: unexpected resp data', resp)
            openNotification({
              title: 'Failed to Get Attachments',
              description: 'Unexpected resp data',
            })
            return
          }
        } catch (error) {
          console.error('Failed to delete the file:', error)
          openNotification({
            title: 'Failed to Delete Attachment',
            description: 'Please contact the system administrator.',
          })
          return
        }
      } else {
        console.error('record.id is empty', { record })
        openNotification({
          title: 'Error',
          description: 'Unable to delete the file: record.id is empty.',
        })
        return
      }
    }
  }

  const onAddGRAttachment = async (
    record: GRDocumentItemType,
    // formValues
  ) => {
    try {
      await GRAForm.validateFields()
    } catch (validationError) {
      console.error('Validation Failed:', validationError)
      if (GRAttachDivRef.current) {
        GRAttachDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    // for 'CREATE' mode, do upsert with attachFiles directly
    let newAttachFiles = [...attachFiles]
    if (mode === PAGE_MODE.CREATE) {
      // find and update row with new data

      newAttachFiles = attachFiles.map((item) => {
        if (item.key === record.key) {
          const returnItem = {
            ...item,
            documentNo: item.documentNo,
            documentDate: item.documentDate,
            documentType: item.documentType,
            budgetCode: item.budgetCode,
            price: item.price,
            file: record?.file as UploadFile,
            isNewRow: false,
            fileName: record?.file?.name ? record?.file?.name : '',
            isFileExistOnLocal: true,
          }
          return returnItem
        }
        return item
      })

      newAttachFiles = addNewEmptyRowOfAttachFile(newAttachFiles)
      newAttachFiles = regenerateIsNewRowForAttachFiles(newAttachFiles)

      setAttachFiles(newAttachFiles)

      return
    } else if (mode === PAGE_MODE.EDIT) {
      // for 'EDIT' mode, call API to add the file, then get the new list of files to update attachFiles
      // compose document data
      const createGRDocumentRequest = {
        metadata: {
          domain: GR_DOMAIN,
          documentType: record.documentType,
          documentNo: record.documentNo,
          documentDate: record.documentDate,
          fileName: record.file?.name || '',
          refId: GRID,
          id: record.id,
          price: StringOrNumberToString(record.price),
          budgetCode: record.budgetCode,
          requesterId: selectedRequester?.requesterId,
          requesterName: selectedRequester?.requesterName,
          requesterSite: selectedRequester?.requesterSite,
          requesterSection: selectedRequester?.requesterSection,
          requesterSectionId: selectedRequester?.requesterSectionId,
        },
        file: record.file as UploadFile,
      }

      try {
        await triggerCreateGRDocument(createGRDocumentRequest).unwrap()

        // get GR documents into newAttachFiles
        const resp = await triggerGetGRDocuments(GRID).unwrap()

        if (resp && Array.isArray(resp)) {
          newAttachFiles = resp.map((item, index) => {
            return {
              ...item,
              key: `${index}`,
              no: index + 1,
              // isNewRow: false,
            }
          })

          newAttachFiles = regenerateIsNewRowForAttachFiles(newAttachFiles)
          setAttachFiles(newAttachFiles)
          return
        } else {
          console.error('Failed to get GR documents: unexpected resp data', resp)
          openNotification({
            title: 'Failed to Get Attachments',
            description: 'Unexpected resp data',
          })
          return
        }
      } catch (error) {
        console.error('Failed to create GR attachment:', error)
        openNotification({
          title: 'Failed to create Attachment',
          description: 'Please try again later.',
        })
        throw error
      }
    }
  }

  const onChangeGRFileUpload = (file: UploadFile, record: GRDocumentItemType) => {
    if (!file.name) {
      // openNotification({
      //   type: 'error',
      //   title: 'Error',
      //   description: 'onChangeGRFileUpload: file.name is empty',
      // })

      // no file name , remove the file from record
      let newAttachFiles = getNewAttachFileAfterRemoveKey(record, 'file', attachFiles)
      // set record.fileName to empty
      newAttachFiles = getNewAttachFileAfterRemoveKey(record, 'fileName', newAttachFiles)

      setAttachFiles(newAttachFiles)

      return
    }

    // put file object to record of attachFiles
    const newAttachFiles = attachFiles.map((item) => {
      if (item.key === record.key) {
        const returnItem = {
          ...item,
          file,
          fileName: file.name ? file.name : '',
        }

        return returnItem
      }
      return item
    })

    setAttachFiles(newAttachFiles)

    GRAForm.validateFields([`fileName-${record.key}`])
  }

  const onChangeGRInvoiceItems = ({
    key,
    value,
    //record,
    index,
  }: {
    key: string
    value: valueType | null
    record: GRinvoiceItem
    index: number
  }) => {
    const newGRinvoiceItems = GRinvoiceItems.map((item, i) => {
      if (i === index) {
        // recalculate netTotal
        if (key === 'GRIqty' || key === 'GRIunitPrice') {
          let newNetTotal = Number(item.GRInetTotal)
          const numValue = StringOrNumberToNumber(value)

          if (key === 'GRIqty') {
            newNetTotal = numValue * item.GRIunitPrice
          } else if (key === 'GRIunitPrice') {
            newNetTotal = item.GRIqty * numValue
          }

          // convert newNetTotal to 2 decimal places
          newNetTotal = Math.floor(newNetTotal * 100) / 100

          return {
            ...item,
            [key]: value,
            GRInetTotal: newNetTotal,
          }
        } else if (key === 'GRInetTotal') {
          // if key is netTotal, recalculate GRIqty
          let newQty = item.GRIqty
          const numValue = StringOrNumberToNumber(value)
          if (item.GRIunitPrice !== 0) {
            newQty = numValue / item.GRIunitPrice
            // discard all decimal
            // newQty = Math.floor(newQty)
            // keep only 2 digits after decimal
            newQty = Math.floor(newQty * 100) / 100
          } else {
            newQty = 0
          }

          const newNetTotal = StringOrNumberToNumber(value)

          return {
            ...item,
            [key]: newNetTotal,
            GRIqty: newQty,
          }
        } else {
          // default case with no recalculation
          return {
            ...item,
            [key]: value,
          }
        }
      }
      return item
    })

    setGRInvoiceItems(newGRinvoiceItems)
  }

  // handle other updates for attachFiles fields
  // used for reactive form and table rendering
  const onChangeGRAttachItems = (
    record: GRDocumentItemType,
    key: string,
    value: string | number | null | boolean | undefined,
  ) => {
    const newAttachFiles = attachFiles.map((item) => {
      if (item.key === record.key) {
        let newItem = {
          ...item,
          [key]: value,
        }

        // if key is documentType, set budgetCode to empty
        if (key === 'documentType') {
          newItem = {
            ...newItem,
            budgetCode: '',
          }
        }

        return newItem
      }
      return item
    })

    setAttachFiles(newAttachFiles)

    // re validate budgetCode if it is required for this record.documentType
    if (isGRDoctypeRequireBudgetCode(record.documentType)) {
      GRAForm.validateFields([`budgetCode-${record.key}`])
    }
  }

  const onChangeGRAttachItemsBL = (
    record: GRDocumentItemType,
    key: string,
    value: boolean,
    sourceAttachFiles: GRDocumentItemType[],
  ) => {
    let source = attachFiles
    if (Array.isArray(sourceAttachFiles)) {
      source = sourceAttachFiles
    }

    const newAttachFiles = source.map((item) => {
      if (item.key === record.key) {
        return {
          ...item,
          [key]: value,
        }
      }
      return item
    })

    setAttachFiles(newAttachFiles)
  }

  const getNewAttachFileAfterRemoveKey = (
    record: GRDocumentItemType,
    key: string,
    sourceAttachFiles: GRDocumentItemType[],
  ) => {
    const resultAttachFiles = sourceAttachFiles.map((item) => {
      if (item.key === record.key) {
        return {
          ...item,
          [key]: undefined,
        }
      }
      return item
    })

    return resultAttachFiles
  }

  const onDeleteGRinvoiceItems = () => {
    const localDeletedGRinvoiceItems: GRinvoiceItem[] = []
    const newGRinvoiceItems = GRinvoiceItems.filter((item) => {
      if (item.GRIkey !== undefined && item.GRIkey !== null && item.GRIkey !== '') {
        {
          if (selectedGRinvoiceItemKeys.includes(item.GRIkey)) {
            // add to local delete list
            const newDeletedGRinvoiceItem = Object.assign({}, item)
            localDeletedGRinvoiceItems.push(newDeletedGRinvoiceItem)
            return false
          }
        }
        return true
      }
    })

    // save localDeletedGRinvoiceItems to state
    setDeletedGRInvoiceItems([...deletedGRInvoiceItems, ...localDeletedGRinvoiceItems])
    setGRInvoiceItems(newGRinvoiceItems)
    setSelectedGRinvoiceItemKeys([])
  }

  const onClickGRSearchItem = () => {
    setTriggerGRSearchItemInputChanged(!triggerGRSearchItemInputChanged)
  }

  // const onClickGRHistory = () => {
  //   if (selectedPOID === '' || selectedPOID === undefined || selectedPOID === null) {
  //     openNotification({
  //       title: 'Error',
  //       description: 'Unable to find GR. id, Please check if GR. was successfully created.',
  //     })
  //   } else {
  //     triggerGetGRHistory({ poId: selectedPOID })
  //     setIsGRHistoryModalOpen(true)
  //   }
  // }

  // const onOKGRHistory = () => {
  //   setIsGRHistoryModalOpen(false)
  // }

  // const onCancelGRHistory = () => {
  //   setIsGRHistoryModalOpen(false)
  // }

  // const [GRHistoryData, setGRHistoryData] = useState<Partial<GRHistoryDataType>>({})

  const onDownloadLocalFile = (record: GRDocumentItemType) => {
    // Ensure record.file is converted to File type
    const fileToDownload =
      record.file instanceof File ? record.file : (record.file?.originFileObj as File | undefined)
    if (!fileToDownload) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to download GR. file',
      })
      return
    }
    handleDownloadLocalFile(fileToDownload)
  }

  const onDownloadGRAttachment = async (record: GRDocumentItemType) => {
    if (record.isFileExistOnLocal) {
      onDownloadLocalFile(record)
    } else {
      if (!record.id) {
        openNotification({
          type: 'error',
          title: 'Error',
          description: 'Failed to download GR. file: record.id is empty',
        })
        return
      }

      await downloadDocument(record.id)
    }
  }

  const onEditGRAttachment = (record: GRDocumentItemType) => {
    // create record.backupRecord from record
    // as new object, not reference to record
    const backupRecord = Object.assign({}, record)
    record.backupRecord = backupRecord

    onChangeGRAttachItemsBL(record, 'isEditing', true, attachFiles)
  }

  const onSaveGRAttachmentEditingRecord = async (record: GRDocumentItemType) => {
    try {
      await GRAForm.validateFields([
        `documentNo-${record.key}`,
        `documentDate-${record.key}`,
        `documentType-${record.key}`,
        `price-${record.key}`,
        `budgetCode-${record.key}`,
        `fileName-${record.key}`,
      ])
    } catch (validationError) {
      console.error('Validation Failed:', validationError)
      if (GRAttachDivRef.current) {
        GRAttachDivRef.current.scrollIntoView(scrollIntoViewOptions)
      }
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    if (mode === PAGE_MODE.CREATE) {
      // delete record.backupRecord from attachFiles
      const newAttachFiles = getNewAttachFileAfterRemoveKey(record, 'backupRecord', attachFiles)

      // exit editing mode
      onChangeGRAttachItemsBL(record, 'isEditing', false, newAttachFiles)
      return
    }
    // TODO for EDIT mode, call API to update the file
    else if (mode === PAGE_MODE.EDIT) {
      const updateGRDocumentRequestData = {
        metadata: {
          domain: GR_DOMAIN,
          documentType: record.documentType,
          documentNo: record.documentNo,
          documentDate: record.documentDate,
          fileName: record.file?.name || '',
          refId: record.refId,
          id: record.id,
          price: StringOrNumberToString(record.price),
          budgetCode: record.budgetCode,
          requesterId: selectedRequester?.requesterId,
          requesterName: selectedRequester?.requesterName,
          requesterSite: selectedRequester?.requesterSite,
          requesterSection: selectedRequester?.requesterSection,
          requesterSectionId: selectedRequester?.requesterSectionId,
        },
        file: record.file as UploadFile,
      }

      try {
        const resp = await triggerUpdateGRDocument(updateGRDocumentRequestData).unwrap()

        if (resp && resp.id) {
          // success
          try {
            await triggerGetGRDocuments(GRID)
          } catch (error) {
            console.error('Failed to get GR documents after update success:', error)
            openNotification({
              title: 'Failed to Get Attachments',
              description:
                'Failed to get GR. documents after update success. Please try again later. Or contact the system administrator.',
            })
          }

          // // delete record.backupRecord from attachFiles
          // const newAttachFiles = getNewAttachFileAfterRemoveKey(record, 'backupRecord', attachFiles)

          // // exit editing mode
          // onChangeGRAttachItemsBL(record, 'isEditing', false, newAttachFiles)
        } else {
          console.error(
            'triggerUpdateGRDocument() Failed: unexpected resp data, resp.id not found:',
            resp,
          )
          openNotification({
            title: 'Failed to update Attachments',
            description: 'Unexpected resp data, resp.id not found.',
          })
          return
        }
      } catch (error) {
        console.error('Failed to update GR attachment:', error)
        openNotification({
          title: 'Failed to update Attachments',
          description: 'Please try again later. Or contact the system administrator.',
        })
      }
    } else {
      openNotification({
        title: 'Error',
        description: 'Invalid mode:' + mode,
      })
    }
  }

  const onCancelGRAttachmentEditingRecord = async (record: GRDocumentItemType) => {
    // restore record.backupRecord to record
    const restoredRecord = Object.assign({}, record.backupRecord)
    delete restoredRecord.backupRecord

    // restore record.backupRecord to record
    const newAttachFiles = attachFiles.map((item) => {
      if (item.key === record.key) {
        return restoredRecord
      }
      return item
    })

    onChangeGRAttachItemsBL(record, 'isEditing', false, newAttachFiles)
  }

  const onRestoreGRinvoiceItems = () => {
    // for CREATE mode, restore deletedGRInvoiceItems to GRinvoiceItems
    if (mode === PAGE_MODE.CREATE) {
      let restoredGRinvoiceItems = [...GRinvoiceItems, ...deletedGRInvoiceItems]

      restoredGRinvoiceItems = restoredGRinvoiceItems.sort((a, b) => {
        if (a.GRIno && b.GRIno) {
          return a.GRIno - b.GRIno
        } else {
          return 0
        }
      })

      setGRInvoiceItems(restoredGRinvoiceItems)
      setDeletedGRInvoiceItems([])
    } else if (mode === PAGE_MODE.EDIT) {
      // for EDIT mode, find records from POGRRemainingItems and restore them
      // then set the record id to null to prevent update GR error
      // leave other records in GRinvoiceItems as is
      // record.GRIid is currently can't be used as identifier
      // use record.name as identifier for now
      // TODO identify each record by GRIkey
      if (Array.isArray(GRinvoiceItems) && Array.isArray(POGRRemainingItems?.purchaseOrderItems)) {
        const reference = convertPurchaseOrderItemsToGRinvoiceItems(
          POGRRemainingItems?.purchaseOrderItems,
          false,
        )

        const restoredGRinvoiceItems = reference.map((item) => {
          const foundItem = GRinvoiceItems.find((POitem) => POitem.GRIname === item.GRIname)
          if (foundItem) {
            const newItem = {
              ...foundItem,
              GRImaxReceiveQty: item.GRIqty + foundItem.GRIqty, // restore maxQty from both
              GRImaxReceivePrice: item.GRIunitPrice, // restore maxPrice from reference
            }

            return newItem
          } else {
            // not found, return original item from reference
            const oldItemFromReference = {
              ...item,
              GRIid: null,
              GRIpaidDate: '',
            }
            return oldItemFromReference
          }
        })

        setGRInvoiceItems(restoredGRinvoiceItems)
        setDeletedGRInvoiceItems([])
      }
    }
  }

  const onBlurGRInvoiceItems = ({ key, record }: { key: string; record: GRinvoiceItem }) => {
    if (key === 'GRInetTotal') {
      let formValue = GRIForm.getFieldValue(`GRInetTotal-${record.GRIkey}`)

      // convert formValue to string
      formValue = StringOrNumberToString(formValue)

      // remove comma from number
      formValue = formValue.replace(/,/g, '')

      const formattedValue = formatNumber(Number(formValue))

      GRIForm.setFieldsValue({
        [`GRInetTotal-${record.GRIkey}`]: formattedValue,
      })

      GRIForm.validateFields([`GRIqty-${record.GRIkey}`])
    } else if (key === 'GRIqty') {
      let formValue = GRIForm.getFieldValue(`GRIqty-${record.GRIkey}`)

      // convert formValue to string
      formValue = StringOrNumberToString(formValue)

      // remove comma from number
      formValue = formValue.replace(/,/g, '')

      const formattedValue = formatNumber(Number(formValue))

      GRIForm.setFieldsValue({
        [`GRIqty-${record.GRIkey}`]: formattedValue,
      })

      GRIForm.validateFields([`GRInetTotal-${record.GRIkey}`])
    }
  }

  // useEffects : side effect functions
  //
  // ##     ##  ######  ########    ######## ######## ######## ########  ######  ########
  // ##     ## ##    ## ##          ##       ##       ##       ##       ##    ##    ##
  // ##     ## ##       ##          ##       ##       ##       ##       ##          ##
  // ##     ##  ######  ######      ######   ######   ######   ######   ##          ##
  // ##     ##       ## ##          ##       ##       ##       ##       ##          ##
  // ##     ## ##    ## ##          ##       ##       ##       ##       ##    ##    ##
  //  #######   ######  ########    ######## ##       ##       ########  ######     ##
  //
  //

  useEffect(() => {
    GRForm.setFieldsValue({
      grNo: selectedGRNo,
    })
  }, [selectedGRNo, GRForm])

  useEffect(() => {
    if (Array.isArray(attachFiles) && attachFiles.length > 0) {
      for (const record of attachFiles) {
        GRAForm.setFieldsValue({
          [`documentNo-${record.key}`]: record.documentNo,
          [`documentDate-${record.key}`]: record.documentDate
            ? getDateFromString(record.documentDate)
            : undefined,
          [`documentType-${record.key}`]: record.documentType,
          [`price-${record.key}`]: record.price,
        })
      }
    }
  }, [GRAForm, attachFiles])

  // useEffect(() => {
  //   if (GRHistoryFromAPI) {
  //     setGRHistoryData(GRHistoryFromAPI)
  //   }
  // }, [GRHistoryFromAPI])

  useEffect(() => {
    if (mode === PAGE_MODE.CREATE) {
      // setSelectedGRDate('')
      // setSelectedGRNo('')
      // setSelectedGRid('')
      // setGRInvoiceItems([])
      clearAttachFileAndAddNewRow()
    }
  }, [POGRRemainingItems, mode, convertPurchaseOrderItemsToGRinvoiceItems])

  useEffect(() => {
    for (const record of GRinvoiceItems) {
      GRIForm.setFieldsValue({
        [`GRIno-${record.GRIkey}`]: record.GRIno,
        [`GRIname-${record.GRIkey}`]: record.GRIname,
        [`GRImodel-${record.GRIkey}`]: record.GRImodel,
        [`GRIbrand-${record.GRIkey}`]: record.GRIbrand,
        [`GRIdetail-${record.GRIkey}`]: record.GRIdetail,
        [`GRIqty-${record.GRIkey}`]: record.GRIqty,
        [`GRIunitPrice-${record.GRIkey}`]: record.GRIunitPrice,
        [`GRIinvoiceReceiveName-${record.GRIkey}`]: record.GRIinvoiceReceiveName,
        [`GRIinvoiceNo-${record.GRIkey}`]: record.GRIinvoiceNo,
        [`GRIinvoiceDate-${record.GRIkey}`]: record.GRIinvoiceDate
          ? getDateFromString(record.GRIinvoiceDate)
          : '',
        [`GRIpaidDate-${record.GRIkey}`]: record.GRIpaidDate
          ? getDateFromString(record.GRIpaidDate)
          : '',
        [`GRIremark-${record.GRIkey}`]: record.GRIremark,
        [`GRInetTotal-${record.GRIkey}`]: record.GRInetTotal,
        // [`GRInetTotal-${record.GRIkey}`]: formatNumber(record.GRInetTotal),
      })
    }
  }, [GRinvoiceItems, GRIForm])

  useEffect(() => {
    if (mode === PAGE_MODE.CREATE) {
      if (POGRRemainingItems) {
        GRForm.setFieldsValue({
          poDate: formatDisplayDate(POGRRemainingItems.poDate),
          prNo: POGRRemainingItems.prNo,
          prDate: formatDisplayDate(POGRRemainingItems.prDate),
          supplierName: POGRRemainingItems.supplierName,
          paymentTermName: POGRRemainingItems.paymentTermName,
          receiveCondition: POGRRemainingItems.receiveCondition,
          comment: POGRRemainingItems.comment,
        })

        clearAttachFileAndAddNewRow()
      } else {
        clearGRFormValues()
      }
    }
  }, [POGRRemainingItems, GRForm, clearGRFormValues, mode])

  // load POGRRemainingItems when selectedPOID is changed
  // updateGRinvoiceItems_0
  useEffect(() => {
    const fetchPOGRRemainingItems = async () => {
      if (selectedPOID === '') {
        // clear POGRRemainingItems
        clearGRFormValues()
        setGRInvoiceItems([])
        setDeletedGRInvoiceItems([])
      } else if (selectedPOID !== '' && typeof selectedPOID === 'string') {
        const resp = await triggerGetPOGRRemainingItems({
          id: selectedPOID,
          page: '0',
          sizePerPage: '1',
        }).unwrap()

        // convert POGRRemainingItems to GRinvoiceItems
        // only work for CREATE mode
        if (mode === PAGE_MODE.CREATE) {
          if (resp && Array.isArray(resp.purchaseOrderItems)) {
            const newGRinvoiceItems = convertPurchaseOrderItemsToGRinvoiceItems(
              resp.purchaseOrderItems,
              true,
            )

            notifyUserIfPOGRRemainingItemsHaveNoRecievableItemsLeft(resp.purchaseOrderItems)

            setGRInvoiceItems(newGRinvoiceItems)
            setDeletedGRInvoiceItems([])
          } else {
            console.error(
              'updateGRinvoiceItems_0: Error: resp.purchaseOrderItems is not an array',
              {
                resp,
              },
            )

            setGRInvoiceItems([])
            setDeletedGRInvoiceItems([])
          }
        }
      }
    }
    fetchPOGRRemainingItems()
  }, [
    selectedPOID,
    triggerGetPOGRRemainingItems,
    clearGRFormValues,
    convertPurchaseOrderItemsToGRinvoiceItems,
    mode,
    notifyUserIfPOGRRemainingItemsHaveNoRecievableItemsLeft,
  ])

  useEffect(() => {
    GRForm.setFieldsValue({
      grDate: selectedGRDate ? formatDisplayDate(selectedGRDate) : '',
    })
  }, [selectedGRDate, GRForm])

  useEffect(() => {
    GRForm.setFieldsValue({
      grId: GRID,
    })
  }, [GRID, GRForm])

  useEffect(() => {
    if (Array.isArray(POGRs) && GRSearchItemInputValue !== '') {
      // find POGRs by POGRs.poNo
      const POGR = POGRs.find((item) => item?.poNo === GRSearchItemInputValue)
      setPOGR(POGR)

      if (POGR?.id) {
        setSelectedPOID(POGR.id)
      } else {
        setSelectedPOID('')
      }
    } else {
      // setPOGR(undefined)
    }
  }, [
    GRSearchItemInputValue,
    POGRs,
    clearGRFormValues,
    triggerGetPOGRRemainingItems,
    triggerGRSearchItemInputChanged,
  ])

  // from POGRRemainingItems to GRinvoiceItems
  // updateGRinvoiceItems_1
  useEffect(() => {
    // for CREATE mode. convert entire POGRRemainingItems to GRinvoiceItems
    if (mode === PAGE_MODE.CREATE) {
      if (POGRRemainingItems && Array.isArray(POGRRemainingItems.purchaseOrderItems)) {
        const newGRinvoiceItems = convertPurchaseOrderItemsToGRinvoiceItems(
          POGRRemainingItems.purchaseOrderItems,
          true,
        )

        setGRInvoiceItems(newGRinvoiceItems)
        setDeletedGRInvoiceItems([])
      } else {
        setGRInvoiceItems([])
        setDeletedGRInvoiceItems([])
      }
    } else if (mode === PAGE_MODE.EDIT) {
      // handle POGRRemainingItems -> GRinvoiceItems EDIT mode
      // somewhere else
    }
  }, [POGRRemainingItems, convertPurchaseOrderItemsToGRinvoiceItems, mode])

  useEffect(() => {
    if (GRID) {
      triggerGetGRByIdQuery(GRID)
    }
  }, [GRID, triggerGetGRByIdQuery])

  // GRFromAPI to GRForm, selectedPOID
  useEffect(() => {
    if (GRFromAPI && GRFromAPI.id === GRID && mode === PAGE_MODE.EDIT) {
      GRForm.setFieldsValue({
        poNo: GRFromAPI?.purchaseOrder?.poNo,
        poDate: GRFromAPI?.purchaseOrder?.poDate
          ? formatDisplayDate(GRFromAPI.purchaseOrder.poDate)
          : '',
        grNo: GRFromAPI.grNo,
        grDate: formatDisplayDate(GRFromAPI.grDate),
        prNo: GRFromAPI?.purchaseOrder?.purchaseRequisitions?.prNo
          ? GRFromAPI.purchaseOrder.purchaseRequisitions.prNo
          : '',
        prDate: GRFromAPI?.purchaseOrder?.purchaseRequisitions?.prDate
          ? formatDisplayDate(GRFromAPI.purchaseOrder.purchaseRequisitions.prDate)
          : '',
        supplierName: GRFromAPI?.purchaseOrder?.supplierName,
        paymentTermName: GRFromAPI?.purchaseOrder?.paymentTermName,
        receiveCondition: GRFromAPI.purchaseOrder?.paymentTermName,
        comment: GRFromAPI.comment,
      })

      // trigger get GR documents to get attachFiles
      triggerGetGRDocuments(GRID)

      if (GRFromAPI.purchaseOrderId) {
        setSelectedPOID(GRFromAPI.purchaseOrderId)
      } else {
        console.error('GRFromAPI.purchaseOrderId is undefined')
        setSelectedPOID('')
      }
    }
  }, [GRForm, GRFromAPI, isLoadingGRFromAPI, GRID, mode, setSelectedPOID, triggerGetGRDocuments])

  // handle merge GRinvoiceItems from GRFromAPI and POGRRemainingItems
  useEffect(() => {
    if (
      GRFromAPI &&
      Array.isArray(GRFromAPI.goodReceiveItems) &&
      POGRRemainingItems &&
      Array.isArray(POGRRemainingItems.purchaseOrderItems) &&
      isLoadingGRFromAPI === false &&
      isLoadingPOGRRemainingItems === false
    ) {
      const newGRinvoiceItems = mergeGRinvoiceItemsFromGRFromAPIAndPOGRRemainingItems(
        GRFromAPI.goodReceiveItems,
        POGRRemainingItems.purchaseOrderItems,
      )

      setGRInvoiceItems(newGRinvoiceItems)
    }
  }, [
    GRFromAPI,
    POGRRemainingItems,
    isLoadingGRFromAPI,
    isLoadingPOGRRemainingItems,
    mergeGRinvoiceItemsFromGRFromAPIAndPOGRRemainingItems,
  ])

  useEffect(() => {
    if (isErrorPOGRRemainingItems === true) {
      openNotification({
        title: 'Error',
        description: 'Unable to get POGRRemainingItems',
      })
      setSelectedPOID('')
      setGRInvoiceItems([])
    }
  }, [isErrorPOGRRemainingItems, openNotification])

  useEffect(() => {
    if (isErrorPOGRs === true) {
      openNotification({
        title: 'Error',
        description: 'Unable to get POGRs',
      })
      setSelectedPOID('')
      setGRInvoiceItems([])
    }
  }, [isErrorPOGRs, openNotification])

  // load GRDocuments to attachFiles. For EDIT mode only
  useEffect(() => {
    if (GRDocuments && Array.isArray(GRDocuments) && mode === PAGE_MODE.EDIT) {
      let newAttachFiles = GRDocuments.map((item, index) => {
        return {
          ...item,
          key: `${index}`,
          no: index + 1,
          isEditing: false,
        }
      }) as GRDocumentItemType[]

      newAttachFiles = regenerateIsNewRowForAttachFiles(newAttachFiles)

      setAttachFiles(newAttachFiles)
    }
  }, [GRDocuments, mode])

  const selectedRequester = useMemo(() => {
    if (mode === PAGE_MODE.CREATE) {
      const newRequester = {
        requesterId: user?.employeeId,
        requesterName: user?.fullNameEn,
        requesterSite: user?.currentSiteCode,
        requesterSection: user?.currentDepartmentName,
        requesterSectionId: user?.currentDepartmentId,
      }
      return newRequester
    } else if (mode === PAGE_MODE.EDIT) {
      const newRequester = {
        requesterId: GRFromAPI?.requesterId,
        requesterName: GRFromAPI?.requesterName,
        requesterSite: GRFromAPI?.requesterSite,
        requesterSection: GRFromAPI?.requesterSection,
        requesterSectionId: GRFromAPI?.requesterSectionId,
      }
      return newRequester
    } else {
      return {
        requesterId: '',
        requesterName: '',
        requesterSite: '',
        requesterSection: '',
        requesterSectionId: '',
      }
    }
  }, [GRFromAPI, user, mode])

  // debug loggers functions
  //
  //
  //
  // ########  ######## ########  ##     ##  ######
  // ##     ## ##       ##     ## ##     ## ##    ##
  // ##     ## ##       ##     ## ##     ## ##
  // ##     ## ######   ########  ##     ## ##   ####
  // ##     ## ##       ##     ## ##     ## ##    ##
  // ##     ## ##       ##     ## ##     ## ##    ##
  // ########  ######## ########   #######   ######
  //
  //
  //

  // main return
  //
  // ########  ######## ######## ##     ## ########  ##    ##
  // ##     ## ##          ##    ##     ## ##     ## ###   ##
  // ##     ## ##          ##    ##     ## ##     ## ####  ##
  // ########  ######      ##    ##     ## ########  ## ## ##
  // ##   ##   ##          ##    ##     ## ##   ##   ##  ####
  // ##    ##  ##          ##    ##     ## ##    ##  ##   ###
  // ##     ## ########    ##     #######  ##     ## ##    ##
  //
  //

  return {
    purchaseStatus: GRFromAPI?.purchaseStatus,
    selectedPOID,
    GRSearchItemInputValue,
    setGRSearchItemInputValue,
    POGRs,
    POGR,
    isLoadingPOGRs,
    isFetchingPOGRs,
    isErrorPOGRs,
    triggerGetPOGRs,
    GRinvoiceItems,
    GRForm,
    GRIForm,
    POGRRemainingItems,
    onClickSetAllGRInvoiceItems,
    onSubmitUpdateGR,
    GRDetailDivRef,
    attachFiles,
    onDeleteAttachFile,
    onAddGRAttachment,
    onChangeGRFileUpload,
    isLoadingPOGRRemainingItems,
    isLoadingGRDocuments,
    GRAForm,
    GRItemsDivRef,
    GRAttachDivRef,
    onChangeGRInvoiceItems,
    selectedGRinvoiceItemKeys,
    setSelectedGRinvoiceItemKeys,
    onDeleteGRinvoiceItems,
    onClickGRSearchItem,
    onChangeGRAttachItems,
    isDeletingGRDocument,
    // onClickGRHistory,
    // isGRHistoryModalOpen,
    // onOKGRHistory,
    // onCancelGRHistory,
    // GRHistoryData,
    // isLoadingGRHistory,
    onDownloadGRAttachment,
    onEditGRAttachment,
    onSaveGRAttachmentEditingRecord,
    onCancelGRAttachmentEditingRecord,
    isUpdatingGRDocument,
    onRestoreGRinvoiceItems,
    isUpdatingGR,
    onBlurGRInvoiceItems,
    selectedRequester,
    onDeleteGR,
    isPOFullyReceived,
  }
}

export default useGoodRecievePage
