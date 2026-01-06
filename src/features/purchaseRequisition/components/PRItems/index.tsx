import { useCallback, useEffect, useState } from 'react'

import { ProfileOutlined } from '@ant-design/icons'
import {
  Checkbox,
  Collapse,
  CollapseProps,
  Form,
  FormInstance,
  Space,
  Table,
  Typography,
} from 'antd'

import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import { useNotification } from 'hooks/useNotification'

import {
  DropdownValueType,
  ExchangeRateType,
  PRDetailsFormValuesType,
  PrItemType,
  mainGroupDropdownType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'
import { updateBCSParams } from 'features/purchaseRequisition/hooks/useUpdateBCS'

import { MAIN_GROUP_CODE } from 'constants/index'
import { roundNumber } from 'utils/generalHelpers'

import { validatePrItemForm } from '../../utils/prItemValidations'

import { columns } from './columns'
import ExtraForm from './components/ExtraForm'
import ItemsSummary from './components/ItemsSummary'
import { calculateNetTotal } from './utils'

const Text = Typography.Text

const newItemRow: PrItemType = {
  key: 'new',
  budgetId: '',
  budgetCode: '',
  budgetSiteId: '',
  budgetSiteName: '',
  name: '',
  model: '',
  brand: '',
  detail: '',
  qty: 0,
  unit: '',
  unitPrice: 0,
  unitDiscount: 0,
  netTotal: 0,
  matCode: null,
}

type PRItemsProps = {
  isDisabledAllForm: boolean
  budgetTypeId?: string
  prItemsList: PrItemType[]
  prItemsGrandTotal: number
  exchangeRates: ExchangeRateType
  isMultipleBudget: boolean
  selectedCurrency?: DropdownValueType
  prSelectedBudget?: BudgetItemType | null
  prDetailsFormRef: FormInstance<PRDetailsFormValuesType>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  selectedMainGroup: mainGroupDropdownType | undefined
  updateBCS: (values: updateBCSParams) => void
  onSetPrLoading: (value: boolean) => void
  onSetPrItemsList: (items: PrItemType[]) => void
  onSetPrItemsGrandTotal: (total: number) => void
  onSetIsMultipleBudget: (value: boolean) => void
  refetchBCS: (itemsList?: PrItemType[]) => void
}

const PRItems = ({
  isDisabledAllForm,
  budgetTypeId,
  prDetailsFormRef,
  prItemsList,
  prItemsGrandTotal,
  prSelectedBudget,
  isMultipleBudget,
  selectedCurrency,
  exchangeRates,
  onSetIsMultipleBudget,
  onSetPrItemsList,
  onSetPrItemsGrandTotal,
  updateBCS,
  selectedMainGroup,
  refetchBCS,
}: PRItemsProps) => {
  const [editForm] = Form.useForm()
  const [newItemForm] = Form.useForm()
  const { openNotification } = useNotification()

  const [editingKey, setEditingKey] = useState<string>('')
  const [editSelectedBudget, setEditSelectedBudget] = useState<BudgetItemType | null>(null)
  const [newSelectedBudget, setNewSelectedBudget] = useState<BudgetItemType | null>(null)

  const isEditing = (record: PrItemType) => record.key === editingKey
  const isEnableMultipleBudget = [
    MAIN_GROUP_CODE.GENERAL_ADM,
    MAIN_GROUP_CODE.INFORMATION_SYSTEM,
  ].includes(selectedMainGroup?.mainGroupCode || '')

  const cancel = () => {
    setEditingKey('')
    editForm.resetFields()
  }

  const handleDelete = (key: string) => {
    const selectedItem = prItemsList.find((item) => item.key === key)
    if (!selectedItem) {
      openNotification({
        title: 'Delete Failed',
        description: 'Could not find the item to delete.',
      })
      return
    }

    const newList = prItemsList.filter((item) => item.key !== key)
    onSetPrItemsList(newList)

    refetchBCS(newList)
  }

  const updateGrandTotal = useCallback(
    (items: PrItemType[]) => {
      const total = items.reduce((sum, item) => sum + (item.netTotal || 0), 0)
      onSetPrItemsGrandTotal(total)
    },
    [onSetPrItemsGrandTotal],
  )

  useEffect(() => {
    updateGrandTotal(prItemsList)
  }, [prItemsList, updateGrandTotal])

  const onSetEditSelectedBudget = useCallback(
    (budget: BudgetItemType) => {
      editForm.setFieldsValue({
        // ...budget,
        budgetSiteName: budget.organizationName,
        budgetSiteId: budget.budgetSiteId,
        budgetCode: budget.budgetCode,
        budgetId: budget.budgetId,
      })
      setEditSelectedBudget({
        ...budget,
        budgetSiteName: budget.organizationName,
      })
    },
    [editForm],
  )

  const onSetNewSelectedBudget = useCallback(
    (budget: BudgetItemType) => {
      newItemForm.setFieldsValue({
        // ...budget,
        budgetSiteName: budget.organizationName,
        budgetSiteId: budget.budgetSiteId,
        budgetCode: budget.budgetCode,
        budgetId: budget.budgetId,
      })
      setNewSelectedBudget({
        ...budget,
        budgetSiteName: budget.organizationName,
      })
    },
    [newItemForm],
  )

  useEffect(() => {
    if (prSelectedBudget && !isMultipleBudget) {
      onSetNewSelectedBudget(prSelectedBudget)
    }
  }, [newItemForm, prSelectedBudget, onSetNewSelectedBudget, isMultipleBudget])

  const edit = (record: PrItemType) => {
    editForm.setFieldsValue({
      ...record,
    })
    if (record.budgetId) {
      onSetEditSelectedBudget({
        budgetSiteName: record.budgetSiteName,
        budgetSiteId: record.budgetSiteId,
        budgetId: record.budgetId,
        budgetCode: record.budgetCode,
      })
    }
    setEditingKey(record.key)
  }

  const save = async (key: string) => {
    // Use the validation utility for common validations
    const isValid = await validatePrItemForm({
      form: editForm,
      prItemsList,
      selectedBudget: editSelectedBudget,
      openNotification,
      editingKey,
    })

    if (!isValid) return

    // If validation passes, proceed to gather values and update state
    const values = editForm.getFieldsValue()
    const newData = [...prItemsList]
    const index = newData.findIndex((item) => key === item.key)

    if (index === -1) {
      openNotification({
        title: 'Update Failed',
        description: 'Could not find the item to update.',
      })
      return
    }

    // Calculate new values
    const netTotal = roundNumber(
      calculateNetTotal(values.qty, values.unitPrice, values.unitDiscount),
      2,
    )
    const updatedItem = {
      ...newData[index],
      ...values,
      budgetId: editSelectedBudget?.budgetId || '',
      budgetCode: editSelectedBudget?.budgetCode || '',
      budgetSiteId: editSelectedBudget?.budgetSiteId || '',
      budgetSiteName: editSelectedBudget?.organizationName || '',
      netTotal,
    }
    newData.splice(index, 1, updatedItem)

    try {
      // Compare original and new budgetId
      const originalBudgetId = prItemsList[index].budgetId
      const newBudgetId = editSelectedBudget?.budgetId
      if (originalBudgetId === newBudgetId) {
        updateBCS({
          selectedBudget: editSelectedBudget!,
          prItemsList: newData,
        })
      } else {
        refetchBCS(newData)
      }

      // If everything succeeded, update state and reset the form
      onSetPrItemsList(newData)
      setEditingKey('')
      editForm.resetFields()
      setEditSelectedBudget(null)
    } catch (requestError) {
      console.error('Update BCS Failed:', requestError)
      openNotification({
        title: 'Update Budget Control Sheet Failed',
        description: 'Please try saving the changes again.',
      })
    }
  }

  const handleAdd = async () => {
    // Use the validation utility for common validations
    const isValid = await validatePrItemForm({
      form: newItemForm,
      prItemsList,
      selectedBudget: newSelectedBudget,
      openNotification,
    })

    if (!isValid) return

    // If validation passes, proceed to gather values and update state
    const values = newItemForm.getFieldsValue()
    const netTotal = roundNumber(
      calculateNetTotal(values.qty, values.unitPrice, values.unitDiscount),
      2,
    )
    const newItem: PrItemType = {
      ...values,
      budgetId: newSelectedBudget?.budgetId || '',
      budgetCode: newSelectedBudget?.budgetCode || '',
      budgetSiteId: newSelectedBudget?.budgetSiteId || '',
      budgetSiteName: newSelectedBudget?.organizationName || '',
      key: Date.now().toString(),
      netTotal,
    }
    const newItemList = [...prItemsList, newItem]

    try {
      // Attempt to update the budget control sheet
      /* NOTE: If you need to handle errors here (e.g. show a notification),
       add 'await' before 'updateBCS' */
      /* WHY: Error handling is deferred here to keep the form responsive.
      Waiting for the request would make the form unresponsive, 
      and fetching budget control sheet data is not critical to the immediate form interaction. 
      The user can retrieve this data later if needed.
      */
      updateBCS({
        selectedBudget: newSelectedBudget!,
        prItemsList: newItemList,
      })

      // If everything succeeded, reset the form and update the state
      onSetPrItemsList(newItemList)

      // if (isMultipleBudget) {
      //   setNewSelectedBudget(null)
      // }

      newItemForm.resetFields([
        'name',
        'model',
        'brand',
        'detail',
        'qty',
        'unit',
        'unitPrice',
        'unitDiscount',
        'netTotal',
        'matCode',
      ])

      newItemForm.setFieldsValue({
        unitDiscount: 0,
      })
    } catch (requestError) {
      // Handle request-related errors
      console.error('Update BCS Failed:', requestError)
      openNotification({
        title: 'Update Budget Control Sheet Failed',
        description: 'Please try adding the item again.',
      })
      return
    }
  }

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space>
          <ProfileOutlined />
          Items/รายการสินค้า
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <Checkbox
              checked={isMultipleBudget}
              onChange={(e) => onSetIsMultipleBudget(e.target.checked)}
              disabled={isDisabledAllForm || !isEnableMultipleBudget}
            >
              Multiple Budget
            </Checkbox>
            <Text type="danger">กรุณาตรวจสอบราคาสินค้าใหม่ทุกครั้งก่อนระบุข้อมูลราคา</Text>
          </div>
          <Table
            bordered
            tableLayout="fixed"
            size="small"
            dataSource={isDisabledAllForm ? prItemsList : [...prItemsList, newItemRow]}
            columns={columns({
              isDisabledAllForm,
              prSelectedBudget,
              budgetTypeId,
              isMultipleBudget,
              newItemForm,
              editForm,
              newSelectedBudget,
              editSelectedBudget,
              editingKey,
              onSetNewSelectedBudget,
              onSetEditSelectedBudget,
              isEditing,
              handleAdd,
              save,
              cancel,
              edit,
              handleDelete,
            })}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
          <ItemsSummary
            grandTotal={prItemsGrandTotal}
            selectedCurrency={selectedCurrency}
            exchangeRateSource={exchangeRates.source}
            exchangeRateDestination={exchangeRates.destination}
          />
          <ExtraForm isDisabledAllForm={isDisabledAllForm} prDetailsFormRef={prDetailsFormRef} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Collapse defaultActiveKey={['1']} items={collapseItems} expandIconPosition="end" />
    </div>
  )
}

export default PRItems
