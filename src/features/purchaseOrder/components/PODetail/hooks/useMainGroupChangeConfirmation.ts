import { useState } from 'react'

import { FormInstance } from 'antd'

import { MainGroupType } from 'api/masterApi.types'
import { POItemType } from 'api/poApi.types'
import { PrBudgetControlSheetType } from 'api/prApi.types'
import useCustomModal from 'hooks/useCustomModal'

type MainGroupDropdownType = MainGroupType & { value: string; label: string }

type Props = {
  formRef: FormInstance
  poItemsList: POItemType[]
  selectedMainGroup: MainGroupType | null
  setSelectedMainGroup: React.Dispatch<React.SetStateAction<MainGroupType | null>>
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
}

const useMainGroupChangeConfirmation = ({
  formRef,
  poItemsList,
  selectedMainGroup,
  setSelectedMainGroup,
  setPoItemsList,
  setBudgetControlSheetData,
}: Props) => {
  const mainGroupConfirmModal = useCustomModal()
  const [pendingMainGroup, setPendingMainGroup] = useState<MainGroupDropdownType | null>(null)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalMessage, setModalMessage] = useState<string>('')

  const isRestrictedMainGroup = (code: string) => ['8', '9'].includes(code)

  const needsConfirmation = (oldCode: string | undefined, newCode: string) => {
    // If there are items, always need confirmation
    if (poItemsList.length > 0) {
      // If no oldCode, just need basic confirmation
      if (!oldCode) return true

      // If oldCode exists, check for restricted group changes
      return (
        (isRestrictedMainGroup(oldCode) && !isRestrictedMainGroup(newCode)) ||
        (!isRestrictedMainGroup(oldCode) && isRestrictedMainGroup(newCode))
      )
    }
    return false
  }

  const handleMainGroupChange = (value: MainGroupDropdownType) => {
    if (needsConfirmation(selectedMainGroup?.mainGroupCode, value.mainGroupCode)) {
      setPendingMainGroup(value)
      setModalTitle('คุณต้องการเปลี่ยน Main Group หรือไม่?')
      setModalMessage(
        'หากคุณเปลี่ยน Main Group, Items และ Budget Control Sheet ที่มีอยู่จะถูกลบ คุณต้องการเปลี่ยน Main Group หรือไม่?',
      )
      mainGroupConfirmModal.showModal()
      return
    }
    setSelectedMainGroup(value)
  }

  const handleConfirmMainGroup = () => {
    if (pendingMainGroup) {
      setSelectedMainGroup(pendingMainGroup)
      setPendingMainGroup(null)
      setPoItemsList([])
      setBudgetControlSheetData([])
    }
    mainGroupConfirmModal.handleOk()
  }

  const handleCancelMainGroup = () => {
    if (selectedMainGroup) {
      formRef.setFieldsValue({ mainGroup: selectedMainGroup })
    } else {
      formRef.resetFields(['mainGroup'])
    }
    setPendingMainGroup(null)
    mainGroupConfirmModal.handleCancel()
  }

  return {
    modalMessage,
    modalTitle,
    handleMainGroupChange,
    mainGroupConfirmModal,
    handleConfirmMainGroup,
    handleCancelMainGroup,
  }
}

export default useMainGroupChangeConfirmation
