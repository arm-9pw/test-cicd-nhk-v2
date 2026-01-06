import {
  ClearOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, Form, FormInstance, Input, InputNumber, Popconfirm, Space, Tooltip } from 'antd'

import { BudgetItemType } from 'api/prApi.types'

import BudgetCodeDropdown from 'components/BudgetCodeDropdown'
import UnitPriceInput from 'components/UnitPriceInput'
import { PrItemType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import {
  formatNumber,
  formatNumberMax3Decimal,
  unitPriceNumberFormatter,
} from 'utils/generalHelpers'

import { validateUnitDiscountCannotExceedUnitPrice } from '../../utils/prItemValidations'

// import BudgetItemDropdown, { BudgetItemTypeDropdown } from '../BudgetItemDropdown'
import CustomInput from './components/CustomInput'
import NetTotalDisplay from './components/NetTotalDisplay'
import SearchItemDropdown from './components/SearchItemDropdown'

type ColumnsProps = {
  isDisabledAllForm: boolean
  prSelectedBudget?: BudgetItemType | null
  budgetTypeId?: string
  isMultipleBudget: boolean
  newItemForm: FormInstance
  editForm: FormInstance
  newSelectedBudget: BudgetItemType | null
  editSelectedBudget: BudgetItemType | null
  editingKey: string
  onSetNewSelectedBudget: (budget: BudgetItemType) => void
  onSetEditSelectedBudget: (budget: BudgetItemType) => void
  isEditing: (record: PrItemType) => boolean
  handleAdd: () => Promise<void>
  save: (key: string) => Promise<void>
  cancel: () => void
  edit: (record: PrItemType) => void
  handleDelete: (key: string) => void
}

export const columns = ({
  isDisabledAllForm,
  budgetTypeId = '',
  // prSelectedBudget,
  isMultipleBudget,
  newItemForm,
  editForm,
  // newSelectedBudget,
  // editSelectedBudget,
  editingKey,
  onSetNewSelectedBudget,
  onSetEditSelectedBudget,
  isEditing,
  handleAdd,
  save,
  cancel,
  edit,
  handleDelete,
}: ColumnsProps) => {
  return [
    {
      title: 'No.',
      dataIndex: 'seqNo',
      width: 50,
      align: 'center' as const,
      fixed: 'left' as const,
      render: (_text: unknown, record: PrItemType, index: number) => {
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
      width: 300,
      align: 'center' as const,
      // fixed: 'left' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const form = isNew ? newItemForm : editForm
        const editable = isEditing(record) || isNew

        // Helper function to create budget option from budget data
        // const createBudgetOption = (
        //   budget:
        //     | {
        //         budgetId?: string
        //         budgetCode?: string
        //         budgetSiteId?: string
        //         budgetSiteName?: string
        //       }
        //     | null
        //     | undefined,
        // ): BudgetItemTypeDropdown[] => {
        //   if (!budget?.budgetId || !budget?.budgetCode) return []

        //   return [
        //     {
        //       value: budget.budgetId,
        //       label: budget.budgetCode,
        //       budgetId: budget.budgetId,
        //       budgetCode: budget.budgetCode,
        //       budgetSiteId: budget.budgetSiteId || '',
        //       budgetSiteName: budget.budgetSiteName || '',
        //     },
        //   ]
        // }

        // Use record budget if available, otherwise use PR selected budget
        // const recordOptions = createBudgetOption(record)
        // const defaultOption: BudgetItemTypeDropdown[] =
        //   recordOptions.length > 0 ? recordOptions : createBudgetOption(prSelectedBudget)

        if (!editable) return record.budgetCode

        if (!isMultipleBudget)
          return (
            <Form form={form} disabled={isDisabledAllForm}>
              <Form.Item
                name="budgetCode"
                rules={[{ required: true, message: 'Please select budgetCode' }]}
                style={{ margin: 0 }}
              >
                <Input disabled />
              </Form.Item>
            </Form>
          )

        return (
          <Form form={form} disabled={isDisabledAllForm}>
            <Form.Item
              name="budgetId"
              rules={[{ required: true, message: 'Please select budgetCode' }]}
              style={{ margin: 0 }}
            >
              <BudgetCodeDropdown
                style={{ maxWidth: '300px' }}
                disabled={!budgetTypeId}
                budgetTypeId={budgetTypeId}
                onChange={(_, option) => {
                  if (isNew) {
                    onSetNewSelectedBudget(option as BudgetItemType)
                  } else {
                    onSetEditSelectedBudget(option as BudgetItemType)
                  }
                }}
              />
              {/* <BudgetItemDropdown
                  budgetTypeId={budgetTypeId}
                  selectedBudget={isNew ? newSelectedBudget : editSelectedBudget}
                  onClickButton={() => {}} // FIXME: Need Real onClickButton
                  onSetSelectedBudget={isNew ? onSetNewSelectedBudget : onSetEditSelectedBudget}
                  defaultOptions={defaultOption}
                  maxWidth={250}
                /> */}
            </Form.Item>
          </Form>
        )
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || isNew
        const form = isNew ? newItemForm : editForm
        return editable ? (
          <>
            <Form form={form} disabled={isDisabledAllForm}>
              <Form.Item hidden name="matCode">
                <Input disabled />
              </Form.Item>
            </Form>
            <SearchItemDropdown
              isDisabledAllForm={isDisabledAllForm}
              form={form}
              inputName="name"
            />
          </>
        ) : (
          record.name
        )
      },
    },

    {
      title: 'Brand',
      dataIndex: 'brand',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || isNew
        const form = isNew ? newItemForm : editForm
        return editable ? (
          <SearchItemDropdown isDisabledAllForm={isDisabledAllForm} form={form} inputName="brand" />
        ) : (
          record.brand
        )
      },
    },
    {
      title: 'Model',
      dataIndex: 'model',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || isNew
        const form = isNew ? newItemForm : editForm
        return editable ? (
          <SearchItemDropdown isDisabledAllForm={isDisabledAllForm} form={form} inputName="model" />
        ) : (
          record.model
        )
      },
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      width: 250,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || record.key === 'new'
        return editable ? (
          <CustomInput
            name="detail"
            required={false}
            formRef={isNew ? newItemForm : editForm}
            isDisabledAllForm={isDisabledAllForm}
          />
        ) : (
          <div style={{ textAlign: 'left' }}>{record.detail}</div>
        )
      },
    },
    {
      title: 'QTY',
      dataIndex: 'qty',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || isNew
        return editable ? (
          <Form form={isNew ? newItemForm : editForm} disabled={isDisabledAllForm}>
            <Form.Item
              name="qty"
              rules={[
                { required: true, message: 'Please input qty' },
                { type: 'number', min: 0.009, message: 'Quantity must be greater than 0' },
              ]}
              style={{ margin: 0 }}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Form>
        ) : (
          formatNumberMax3Decimal(record?.qty)
        )
      },
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || isNew
        return editable ? (
          <CustomInput
            name="unit"
            required={true}
            formRef={isNew ? newItemForm : editForm}
            isDisabledAllForm={isDisabledAllForm}
          />
        ) : (
          record.unit
        )
      },
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || isNew
        return editable ? (
          <UnitPriceInput
            formRef={isNew ? newItemForm : editForm}
            isDisabledAllForm={isDisabledAllForm}
          />
        ) : (
          // <Form form={isNew ? newItemForm : editForm} disabled={isDisabledAllForm}>
          //   <Form.Item
          //     name="unitPrice"
          //     rules={[{ required: true, message: 'Please input unitPrice' }]}
          //     style={{ margin: 0 }}
          //   >

          //     {/* <InputNumber
          //       style={{ width: '100%' }}
          //       min={0}
          //       max={999999999.99}
          //       formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          //     /> */}
          //    </Form.Item>
          // </Form>
          <div style={{ textAlign: 'right' }}>{unitPriceNumberFormatter(record.unitPrice)}</div>
        )
      },
    },
    {
      title: 'Unit Discount',
      dataIndex: 'unitDiscount',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const editable = isEditing(record) || isNew
        return editable ? (
          <Form
            form={isNew ? newItemForm : editForm}
            disabled={isDisabledAllForm}
            initialValues={{ unitDiscount: 0 }}
          >
            <Form.Item
              name="unitDiscount"
              rules={[
                { required: true, message: 'Please input unitDiscount' },
                validateUnitDiscountCannotExceedUnitPrice(isNew ? newItemForm : editForm),
              ]}
              style={{ margin: 0 }}
            >
              <InputNumber
                min={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: 'right' }}>{formatNumber(record.unitDiscount)}</div>
        )
      },
    },
    {
      title: 'Net Total',
      dataIndex: 'netTotal',
      width: 150,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: unknown, record: PrItemType) => {
        const isNew = record.key === 'new'
        const isEdit = isEditing(record)
        const isEditOrNew = isEdit || isNew
        return isEditOrNew ? (
          <div style={{ textAlign: 'right' }}>
            <Form form={isNew ? newItemForm : editForm}>
              <NetTotalDisplay record={record} isEditOrNew={isEditOrNew} />
            </Form>
          </div>
        ) : (
          <div style={{ textAlign: 'right' }}>{formatNumber(record.netTotal || 0)}</div>
        )
      },
    },
    {
      title: 'Action',
      width: 80,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: unknown, record: PrItemType) => {
        const editing = isEditing(record)
        const isNewRow = record.key === 'new'

        if (isNewRow) {
          return (
            <Space>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                disabled={editingKey !== '' || isDisabledAllForm}
              />
              <Tooltip title="Clear">
                <Button
                  size="small"
                  color="danger"
                  variant="outlined"
                  icon={<ClearOutlined />}
                  onClick={() => {
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
                  }}
                  disabled={editingKey !== '' || isDisabledAllForm}
                />
              </Tooltip>
            </Space>
          )
        }

        if (editing) {
          return (
            <Space>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                icon={<SaveOutlined />}
                onClick={() => save(record.key)}
                disabled={isDisabledAllForm}
              />
              <Popconfirm title="Cancel editing?" onConfirm={cancel}>
                <Button danger size="small" icon={<CloseOutlined />} type="primary" />
              </Popconfirm>
            </Space>
          )
        }

        return (
          <Space>
            <Button
              color="primary"
              variant="outlined"
              size="small"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== '' || isDisabledAllForm}
            />
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleDelete(record.key)}
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
