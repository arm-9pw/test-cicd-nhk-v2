import {
  ClearOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, Form, FormInstance, Input, InputNumber, Popconfirm, Space, Tooltip } from 'antd'

import { POItemType } from 'api/poApi.types'
import { BudgetItemType } from 'api/prApi.types'

import BudgetCodeDropdown from 'components/BudgetCodeDropdown'
import UnitPriceInput from 'components/UnitPriceInput'
import { DropdownValueType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'
import { BudgetItemTypeDropdown } from 'features/purchaseRequisition/components/BudgetItemDropdown'
import SearchItemDropdown from 'features/purchaseRequisition/components/PRItems/components/SearchItemDropdown'
import { calculateNetTotal } from 'features/purchaseRequisition/components/PRItems/utils'

import { formatNumber, formatNumberMax3Decimal, unitPriceNumberFormatter } from 'utils/generalHelpers'

import { validateUnitDiscountCannotExceedUnitPrice } from '../../utils/poItemValidations'

import BudgetDropdownListFromPR from './components/BudgetDropdownListFromPR'
import CustomInput from './components/CustomInput'

type ColumnsProps = {
  isNotRefPR: boolean
  isDisabledAllForm: boolean
  editFormRef: FormInstance
  newItemFormRef: FormInstance
  editSelectedBudget: BudgetItemType | null
  newSelectedBudget: BudgetItemType | null
  editingKey: string
  budgetListFromPR: BudgetItemTypeDropdown[]
  selectedBudgetType: DropdownValueType | undefined
  onSetNewSelectedBudget: (budget: BudgetItemType) => void
  onSetEditSelectedBudget: (budget: BudgetItemType) => void
  handleAddNewItem: () => void
  onEditRecord: (record: POItemType) => void
  isRecordBeingEdited: (record: POItemType) => boolean
  onCancelEditing: () => void
  handleSaveEditedItem: (key: string) => void
  handleDeleteItem: (key: string) => void
}

export const columns = ({
  isNotRefPR,
  isDisabledAllForm,
  editFormRef,
  newItemFormRef,
  newSelectedBudget,
  editSelectedBudget,
  editingKey,
  onSetNewSelectedBudget,
  onSetEditSelectedBudget,
  handleAddNewItem,
  onEditRecord,
  isRecordBeingEdited,
  onCancelEditing,
  handleSaveEditedItem,
  handleDeleteItem,
  budgetListFromPR,
  selectedBudgetType,
}: ColumnsProps) => {
  const getFormRef = (key: string) => {
    if (key === 'new') {
      return newItemFormRef
    }
    return editFormRef
  }

  return [
    {
      title: 'No.',
      dataIndex: 'seqNo',
      width: 50,
      align: 'center' as const,
      fixed: 'left' as const,
      render: (_text: unknown, record: POItemType, index: number) => {
        if (record.key === 'new') {
          return <Input disabled />
        }
        // Add asterisk prefix to items with matCode to indicate they are from the system
        return record.matCode && !record.matCode.includes('DUMMY')
          ? `${index + 1}`
          : `*${index + 1}`
      },
    },
    {
      title: 'Budget Code',
      dataIndex: 'budgetCode',
      width: 250,
      align: 'center' as const,
      // fixed: 'left' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)

        // Helper function to render BudgetDropdownListFromPR
        const renderBudgetDropdownFromPR = (
          selectedBudget: BudgetItemType | null,
          onSetSelectedBudget: (budget: BudgetItemType) => void,
        ) => (
          <Form form={formRef}>
            <Form.Item
              name="budgetCode"
              rules={[{ required: true, message: 'Please select budgetCode' }]}
            >
              <BudgetDropdownListFromPR
                budgetListFromPR={budgetListFromPR}
                selectedBudget={selectedBudget}
                onSetSelectedBudget={onSetSelectedBudget}
              />
            </Form.Item>
          </Form>
        )

        // Helper function to render BudgetItemDropdown
        const renderBudgetItemDropdown = (
          // defaultOptions: BudgetItemTypeDropdown[],
          // selectedBudget: BudgetItemType | null,
          onSetSelectedBudget: (budget: BudgetItemType) => void,
        ) => (
          <Form form={formRef}>
            <Form.Item
              name="budgetId"
              rules={[{ required: true, message: 'Please select budgetCode' }]}
            >
              <BudgetCodeDropdown
                style={{ maxWidth: 300 }}
                disabled={!selectedBudgetType?.value}
                budgetTypeId={selectedBudgetType?.value}
                onChange={(_, option) => {
                  onSetSelectedBudget(option as BudgetItemType)
                }}
              />
              {/* <BudgetItemDropdown
                budgetTypeId={selectedBudgetType?.value}
                forceOptions={defaultOptions}
                selectedBudget={selectedBudget}
                onSetSelectedBudget={onSetSelectedBudget}
                maxWidth={250}
              /> */}
            </Form.Item>
          </Form>
        )

        // CASE 1: If referencing PR, use budget from PR
        if (!isNotRefPR) {
          if (record.key === 'new') {
            return renderBudgetDropdownFromPR(newSelectedBudget, onSetNewSelectedBudget)
          } else if (isRecordBeingEdited(record)) {
            return renderBudgetDropdownFromPR(editSelectedBudget, onSetEditSelectedBudget)
          }
        }

        // CASE 2: New record (not referencing PR)
        if (record.key === 'new') {
          // Use BudgetItemDropdown with default option if available
          // let defaultOption: BudgetItemTypeDropdown[] = []
          // if (newSelectedBudget) {
          //   defaultOption = [
          //     {
          //       value: newSelectedBudget.budgetId,
          //       label: newSelectedBudget.budgetCode,
          //       budgetCode: newSelectedBudget.budgetCode,
          //       budgetId: newSelectedBudget.budgetId,
          //       budgetSiteId: newSelectedBudget.budgetSiteId,
          //       budgetSiteName: newSelectedBudget.budgetSiteName,
          //     },
          //   ]
          // }

          // return renderBudgetItemDropdown(defaultOption, newSelectedBudget, onSetNewSelectedBudget)
          return renderBudgetItemDropdown(onSetNewSelectedBudget)
        }

        // CASE 3: Editing existing record
        if (isRecordBeingEdited(record)) {
          // const defaultOption = [
          //   {
          //     value: record.budgetId,
          //     label: record.budgetCode,
          //     budgetCode: record.budgetCode,
          //     budgetId: record.budgetId,
          //     budgetSiteId: record.budgetSiteId,
          //     budgetSiteName: record.budgetSiteName,
          //   },
          // ]

          return renderBudgetItemDropdown(
            onSetEditSelectedBudget,
            // defaultOption,
            // editSelectedBudget,
          )
        }

        // CASE 4: Default - just show the budget code text
        return record.budgetCode
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return (
            <>
              <Form form={formRef} disabled={isDisabledAllForm}>
                <Form.Item hidden name="matCode">
                  <Input disabled />
                </Form.Item>
              </Form>
              <SearchItemDropdown form={formRef} inputName="name" />
            </>
          )
        }
        return record.name
      },
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      width: 150,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return <SearchItemDropdown form={formRef} inputName="brand" />
        }
        return record.brand
      },
    },
    {
      title: 'Model',
      dataIndex: 'model',
      width: 200,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return <SearchItemDropdown form={formRef} inputName="model" />
        }
        return record.model
      },
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      width: 250,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return <CustomInput name="detail" formRef={formRef} required={false} />
        }
        return record.detail
      },
    },
    // {
    //   title: 'Other',
    //   dataIndex: 'other',
    //   width: 50,
    //   align: 'center' as const,
    //   render: () => {
    //     return <Button size="small" type="primary" icon={<SelectOutlined />} />
    //   },
    // },
    {
      title: 'QTY',
      dataIndex: 'qty',
      width: 120,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return (
            <Form form={formRef}>
              <Form.Item
                name="qty"
                rules={[
                  { required: true },
                  { type: 'number', min: 0.009, message: 'Quantity must be greater than 0' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Form>
          )
        }
        return formatNumberMax3Decimal(record.qty)
      },
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: 100,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return <CustomInput name="unit" formRef={formRef} required={true} />
        }
        return record.unit
      },
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      width: 150,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return (
            // <Form form={formRef}>
            //   <Form.Item name="unitPrice" rules={[{ required: true }]}>
            //     <InputNumber
            //       style={{ width: '100%' }}
            //       min={0}
            //       max={999999999.99}
            //       formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            //     />
            //   </Form.Item>
            // </Form>
            <UnitPriceInput formRef={formRef} isDisabledAllForm={isDisabledAllForm} />
          )
        }
        return (
          <div style={{ textAlign: 'right' }}>{unitPriceNumberFormatter(record.unitPrice)}</div>
        )
      },
    },
    {
      title: 'Unit Discount',
      dataIndex: 'unitDiscount',
      width: 120,
      align: 'center' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        if (record.key === 'new' || isRecordBeingEdited(record)) {
          return (
            <Form form={formRef} initialValues={{ unitDiscount: 0 }}>
              <Form.Item
                name="unitDiscount"
                rules={[
                  { required: true, message: 'Please input unit discount' },
                  validateUnitDiscountCannotExceedUnitPrice(formRef),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Form>
          )
        }
        return <div style={{ textAlign: 'right' }}>{formatNumber(record.unitDiscount)}</div>
      },
    },
    {
      title: 'Net Total',
      dataIndex: 'netTotal',
      width: 150,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_text: unknown, record: POItemType) => {
        const formRef = getFormRef(record.key)
        const isEditOrNew = record.key === 'new' || isRecordBeingEdited(record)
        if (isEditOrNew) {
          return (
            <div style={{ textAlign: 'right' }}>
              <Form form={formRef}>
                <Form.Item noStyle dependencies={['qty', 'unitPrice', 'unitDiscount']}>
                  {({ getFieldsValue }) => {
                    const { qty = 0, unitPrice = 0, unitDiscount = 0 } = getFieldsValue()
                    const total = isEditOrNew
                      ? calculateNetTotal(qty, unitPrice, unitDiscount)
                      : record.netTotal
                    return formatNumber(total) || 0
                  }}
                </Form.Item>
              </Form>
            </div>
          )
        }
        return <div style={{ textAlign: 'right' }}>{formatNumber(record.netTotal || 0)}</div>
      },
    },
    {
      title: 'Action',
      width: 80,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_text: unknown, record: POItemType) => {
        // New item row
        if (record.key === 'new') {
          return (
            <Space>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                onClick={handleAddNewItem}
                disabled={editingKey !== '' || isDisabledAllForm}
              />
              <Tooltip title="Clear">
                <Button
                  size="small"
                  color="danger"
                  variant="outlined"
                  icon={<ClearOutlined />}
                  onClick={() => {
                    newItemFormRef.resetFields([
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
                  }}
                  disabled={editingKey !== '' || isDisabledAllForm}
                />
              </Tooltip>
            </Space>
          )
        }

        // Editing row
        if (isRecordBeingEdited(record)) {
          return (
            <Space>
              <Button
                color="primary"
                size="small"
                variant="outlined"
                icon={<SaveOutlined />}
                onClick={() => handleSaveEditedItem(record.key)}
                disabled={isDisabledAllForm}
              />
              <Popconfirm title="Cancel editing?" onConfirm={onCancelEditing}>
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  type="primary"
                  disabled={isDisabledAllForm}
                />
              </Popconfirm>
            </Space>
          )
        }

        // Normal row
        return (
          <Space>
            <Button
              color="primary"
              variant="outlined"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEditRecord(record)}
              disabled={editingKey !== '' || isDisabledAllForm}
            />
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleDeleteItem(record.key)}
            >
              <Button
                danger
                type="primary"
                size="small"
                icon={<DeleteOutlined />}
                disabled={editingKey !== '' || isDisabledAllForm}
              />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]
}
