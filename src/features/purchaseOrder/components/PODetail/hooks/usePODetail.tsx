import { useState } from 'react'

import { Form, FormInstance } from 'antd'

import { MainGroupType } from 'api/masterApi.types'
import { POItemType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import { useNotification } from 'hooks/useNotification'

import {
  DropdownValueType,
  PRAttachmentDataType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { getDateFromString } from 'utils/dateHelpers'

import { PRListDropdownType } from '../../PRListDropdown'

type Props = {
  poDetailsFormRef: FormInstance
  prList: PRListDropdownType[]
  poItemsList: POItemType[]
  setPrList: React.Dispatch<React.SetStateAction<PRListDropdownType[]>>
  setIsNotRefPR: React.Dispatch<React.SetStateAction<boolean>>
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setPoAttachmentsList: React.Dispatch<React.SetStateAction<PRAttachmentDataType[]>>
  setSelectedBudgetType: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  setSelectedBudget: React.Dispatch<React.SetStateAction<BudgetItemType | null | undefined>>
  setSelectedCurrency: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  updateMultipleBudgetBCS: (itemsList: POItemType[], prId?: string | null) => void
  setSelectedMainGroup: React.Dispatch<React.SetStateAction<MainGroupType | null>>
}

const usePODetail = ({
  poDetailsFormRef,
  prList,
  poItemsList,
  setPrList,
  setIsNotRefPR,
  setPoItemsList,
  setPoAttachmentsList,
  setSelectedBudgetType,
  setBudgetControlSheetData,
  setSelectedBudget,
  setSelectedCurrency,
  updateMultipleBudgetBCS,
  setSelectedMainGroup,
}: Props) => {
  const [tableFormRef] = Form.useForm()
  const [selectedPR, setSelectedPR] = useState<PRListDropdownType>()

  const { openNotification } = useNotification()

  const onChangeNotReferPR = (value: boolean) => {
    setIsNotRefPR(value)
    if (value) {
      // NOTE: Not refer PR
      setSelectedPR(undefined)
      tableFormRef.resetFields()
      setPrList([])
      setPoItemsList([])
      setPoAttachmentsList([])
      setBudgetControlSheetData([])
    } else {
      // NOTE: Refer PR
      // Reset budget ถ้าเขาเลือกไป refer pr เพราะจะได้ budget จาก pr แทน
      tableFormRef.resetFields(['budgetId'])
      setSelectedBudget(null)
    }
  }

  // NOTE: PR Table
  const onSelectPR = (value: PRListDropdownType | undefined) => {
    setSelectedPR(value)
    tableFormRef.setFieldsValue({
      prNo: value?.id,
      prDate: getDateFromString(value?.prDate),
      requireDate: getDateFromString(value?.requireDate),
      budgetCode: value?.budgetCode,
      budgetDescription: value?.budgetDescription || '-',
      requesterName: value?.requesterName || '-',
    })
  }

  const onAddPR = async () => {
    // NOTE: Validate the form
    try {
      await tableFormRef.validateFields()
    } catch (validationError) {
      console.error('Validation Failed:', validationError)
      openNotification({
        title: 'Validation Error',
        description: 'Please check the form fields for errors.',
      })
      return
    }

    // NOTE: Check duplicate PR
    if (prList.some((item) => item.id === selectedPR?.id)) {
      openNotification({
        title: 'Duplicate PR.',
        description: 'This PR. already exists in the list.',
      })
      return
    }

    // NOTE: Check all items need to have the same main group and budget type.
    if (!selectedPR) return
    const hasMismatchedMainGroup = prList.some(
      (item) => item.mainGroupId !== selectedPR.mainGroupId,
    )
    const hasMismatchedBudgetType = prList.some(
      (item) => item.budgetTypeId !== selectedPR.budgetTypeId,
    )
    if (hasMismatchedMainGroup || hasMismatchedBudgetType) {
      openNotification({
        title: 'Mismatched Main Group or Budget Type',
        description: 'All items need to have the same main group and budget type.',
      })
      return
    }

    // NOTE: Add the PR to the list
    try {
      if (!selectedPR) return
      // NOTE: Add the PR to the list
      setPrList((prev) => [
        ...prev,
        { ...selectedPR, purchaseRequisitionId: selectedPR.id!, key: selectedPR.id! },
      ])

      // NOTE: Update PO Items
      const itemsFromPr = selectedPR.purchaseRequisitionItems || []
      const newItemsList = itemsFromPr.map((item) => ({
        ...item,
        prId: selectedPR.id!,
        key: item.id!,
      }))
      setPoItemsList((prev) => [...prev, ...newItemsList])

      // NOTE: Update BCS
      const newPoItemsList = [...poItemsList, ...newItemsList]
      updateMultipleBudgetBCS(newPoItemsList, selectedPR.id)

      // NOTE: Update Attachments
      const attachmentsFromPr = selectedPR.documentAttachFiles || []
      const newAttachmentsList = attachmentsFromPr.map((item) => {
        return {
          ...item,
          isUse: true,
          prId: selectedPR.id!,
          key: item.id!,
        }
      })
      setPoAttachmentsList((prev) => [...prev, ...newAttachmentsList])

      // NOTE: Set Budget Type (Use in budget control sheet)
      setSelectedBudgetType({
        value: selectedPR.budgetTypeId || '',
        label: selectedPR.budgetTypeName || '',
      })

      setSelectedMainGroup({
        id: selectedPR.mainGroupId || '',
        mainGroupCode: selectedPR.mainGroupCode || '',
        mainGroupName: selectedPR.mainGroupName || '',
        mainGroupDetail: '',
      })

      // NOTE: Clear the form
      setSelectedPR(undefined)
      tableFormRef.resetFields()

      // NOTE: Set PO Details Form, only set these the first time
      if (prList.length <= 0) {
        setSelectedCurrency({
          value: selectedPR?.currencyId || '',
          label: selectedPR?.currencyName || '',
        })
        poDetailsFormRef.setFieldsValue({
          jobName: selectedPR?.jobName,
          mainGroup: { value: selectedPR?.mainGroupId, label: selectedPR?.mainGroupName },
          budgetType: {
            value: selectedPR?.budgetTypeId,
            label: selectedPR?.budgetTypeName,
          },
          currency: {
            value: selectedPR.currencyId,
            label: selectedPR.currencyName,
          },
          exchangeRateSource: selectedPR.exchangeRateSource,
          exchangeRateDestination: selectedPR.exchangeRateDestination,
        })
      } else {
        // NOTE: Jobs Name จะดึงข้อมูลจาก PR ในกรณีที่เป็น 1 PO ต่อ 1 PR เท่านั้น ถ้ามีหลาย PR ช่อง Jobs Name ให้ user กรอกเอง ไม่ต้องดึงข้อมูลมา
        poDetailsFormRef.resetFields(['jobName'])
      }
    } catch (error) {
      console.error('Failed to add PR to the list:', error)
      openNotification({
        title: 'Error',
        description: 'Failed to add PR to the list.',
      })
    }
  }

  const onDeletePR = (key: string) => {
    // NOTE: key = PR ID
    setSelectedPR(undefined)
    setPrList((prev) => prev.filter((item) => item.id !== key))
    setPoAttachmentsList((prev) => prev.filter((item) => item.prId !== key))

    const newPOItemsList = poItemsList.filter((item) => item.prId !== key)
    if (newPOItemsList.length <= 0) {
      setBudgetControlSheetData([])
    } else {
      updateMultipleBudgetBCS(newPOItemsList)
    }
    setPoItemsList(newPOItemsList)
  }

  return {
    selectedPR,
    onSelectPR,
    tableFormRef,
    onAddPR,
    onDeletePR,
    onChangeNotReferPR,
  }
}

export default usePODetail
