import React from 'react'

import { FileAddOutlined } from '@ant-design/icons'
import {
  Col,
  Collapse,
  CollapseProps,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Space,
} from 'antd'
import dayjs from 'dayjs'

import { useGetBudgetsQuery } from 'api/prApi'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'
import useCustomModal from 'hooks/useCustomModal'

import BudgetCodeDropdown from 'components/BudgetCodeDropdown'
import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import CurrencyDropdown from 'components/CurrencyDropdown'
import CustomDatePicker from 'components/CustomDatePicker'
import MainGroupDropdown from 'components/MaingroupDropdown'

import { PAGE_MODE, gutter } from 'constants/index'

import {
  DropdownValueType,
  PRDetailsFormValuesType,
  PrItemType,
  mainGroupDropdownType,
} from '../../PurchaseRequisitionPage.types'

// import BudgetItemDropdown from '../BudgetItemDropdown'
import ConfirmChangeModal from './components/ConfirmChangeModal'
import useBudgetChangeConfirmation from './hooks/useBudgetChangeConfirmation'
import useMainGroupChangeConfirmation from './hooks/useMainGroupChangeConfirmation'
import usePRDetailsForm from './hooks/usePRDetailsForm'

const SPAN = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }

type PRDetailsFormProps = {
  prItemsList: PrItemType[]
  mode: (typeof PAGE_MODE)[keyof typeof PAGE_MODE]
  prDetailsFormRef: FormInstance<PRDetailsFormValuesType>
  selectedBudgetType?: DropdownValueType
  prSelectedBudget?: BudgetItemType | null
  selectedCurrency: DropdownValueType | undefined
  selectedMainGroup: mainGroupDropdownType | undefined
  isDisabledAllForm: boolean
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  onSetPrSelectedBudget: (budget: BudgetItemType | null) => void
  onBudgetTypeChange: (value: DropdownValueType) => void
  onSetSelectedCurrency: (value: DropdownValueType | undefined) => void
  onExchangeRateChange: (source: number | null, destination: number | null) => void
  onSetMainGroup: (value: mainGroupDropdownType) => void
  onSetIsBCSDataOutdated: (value: boolean) => void
  onSetPrItemsList: (items: PrItemType[]) => void
  onSetIsMultipleBudget: (value: boolean) => void
}

const PRDetailsForm: React.FC<PRDetailsFormProps> = ({
  mode,
  prDetailsFormRef,
  prItemsList,
  selectedBudgetType,
  prSelectedBudget,
  selectedCurrency,
  selectedMainGroup,
  isDisabledAllForm,
  setBudgetControlSheetData,
  onSetPrSelectedBudget,
  onBudgetTypeChange,
  onSetSelectedCurrency,
  onExchangeRateChange,
  onSetMainGroup,
  onSetIsBCSDataOutdated,
  onSetPrItemsList,
  onSetIsMultipleBudget,
}) => {
  useGetBudgetsQuery(
    {
      budgetTypeId: selectedBudgetType?.value,
    },
    { skip: !selectedBudgetType?.value },
  )
  const { isRequiredExchangeRate } = usePRDetailsForm({
    prDetailsFormRef,
    selectedCurrency,
    prSelectedBudget: prSelectedBudget || null,
    onExchangeRateChange,
    onSetSelectedCurrency,
    mode,
    onSetIsBCSDataOutdated,
  })
  const disabledExchange = selectedCurrency?.label === 'THB' || isDisabledAllForm
  const budgetConfirmModal = useCustomModal()

  // Use the extracted hook for budget change confirmation
  const {
    handleBudgetSelection,
    handleConfirmBudget,
    handleCancelBudget,
    handleBudgetTypeChange,
    modalTitle,
    modalMessage,
  } = useBudgetChangeConfirmation({
    budgetModalHook: budgetConfirmModal,
    prItemsList,
    onSetPrSelectedBudget,
    onSetPrItemsList,
    setBudgetControlSheetData,
    onBudgetTypeChange,
    prDetailsFormRef,
    selectedBudgetType,
    prSelectedBudget,
  })

  const {
    modalMessage: mainGroupModalMessage,
    modalTitle: mainGroupModalTitle,
    handleMainGroupChange,
    mainGroupConfirmModal,
    handleConfirmMainGroup,
    handleCancelMainGroup,
  } = useMainGroupChangeConfirmation({
    prDetailsFormRef,
    prItemsList,
    selectedMainGroup,
    onSetMainGroup,
    onSetPrItemsList,
    setBudgetControlSheetData,
    setIsMultipleBudget: onSetIsMultipleBudget,
  })

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space>
          <FileAddOutlined />
          Purchase Requisition(PR.)/ใบขอสั่งซื้อสินค้า
        </Space>
      ),
      children: (
        <Form
          labelWrap
          form={prDetailsFormRef}
          layout="vertical"
          initialValues={{ requiredDate: dayjs() }}
          disabled={isDisabledAllForm}
        >
          <Row gutter={gutter} align="bottom">
            <Col {...SPAN}>
              <Form.Item
                name="jobName"
                label="Jobs Name/ชื่องาน"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="mainGroup"
                label="Main Group/กลุ่มสินค้าหลัก"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <MainGroupDropdown
                  onChange={(_, option) => {
                    handleMainGroupChange(option as mainGroupDropdownType)
                  }}
                />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="budgetType"
                label="Budget Type/ชนิดงบประมาณ"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <BudgetTypeDropdown onChange={handleBudgetTypeChange} />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="requiredDate"
                label="Require Date/วันที่ต้องการของ"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <CustomDatePicker minDate={dayjs()} />
              </Form.Item>
            </Col>

            <Col {...SPAN}>
              {isDisabledAllForm ? (
                <Form.Item label="Budget Code/งบประมาณเลขที่">
                  <Input
                    disabled
                    value={
                      prSelectedBudget?.budgetCode +
                      (prSelectedBudget?.budgetDescription
                        ? ' : ' + prSelectedBudget?.budgetDescription
                        : '')
                    }
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Budget Code/งบประมาณเลขที่"
                  name="budgetId"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <BudgetCodeDropdown
                    disabled={isDisabledAllForm || !selectedBudgetType?.value}
                    budgetTypeId={selectedBudgetType?.value}
                    onChange={(_, option) => {
                      handleBudgetSelection(option as BudgetItemType)
                    }}
                  />

                  {/* <BudgetItemDropdown
                  defaultOptions={defaultBudgetItemOptions}
                  budgetTypeId={selectedBudgetType?.value}
                  selectedBudget={prSelectedBudget}
                  onSetSelectedBudget={handleBudgetSelection}
                /> */}
                </Form.Item>
              )}
            </Col>
            <Col {...SPAN}>
              <Form.Item
                name="purpose"
                label="Purpose/วัตถุประสงค์"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col {...SPAN}>
              <Form.Item name="budgetDescription" label="Budget Description">
                <Input />
              </Form.Item>
            </Col>
            <Col {...SPAN}>
              <Form.Item name="line" label="Line/หน่วยงาน">
                <Input />
              </Form.Item>
            </Col>
            {/* NOTE [14 Mar 2025]: เก๋อัพเดทมาว่าให้เอา checkbox import ที่หน้าบ้านออก แต่ยังไม่แก้ backend เพราะฉะนั้นจะส่งเป็น false เสมอไปแทน */}
            {/* <Col span={24}>
              <Form.Item name="isImport" valuePropName="checked">
                <Checkbox>Import/สั่งซื้อต่างประเทศ</Checkbox>
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="currency" label="Currency/สกุลเงิน">
                <CurrencyDropdown
                  onChange={onSetSelectedCurrency}
                  onClear={() => onSetSelectedCurrency(undefined)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Exchange Rate/อัตราการแลกเปลี่ยน" name="exchangeRate">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item
                    noStyle
                    name="exchangeRateSource"
                    rules={[
                      {
                        required: isRequiredExchangeRate,
                      },
                      {
                        type: 'number',
                      },
                    ]}
                  >
                    <InputNumber
                      disabled={disabledExchange}
                      placeholder="Source Rate"
                      suffix={selectedCurrency?.label || 'BAHT'}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    name="exchangeRateDestination"
                    rules={[
                      {
                        required: isRequiredExchangeRate,
                      },
                      {
                        type: 'number',
                      },
                    ]}
                  >
                    <InputNumber
                      disabled={disabledExchange}
                      placeholder="Destination Rate"
                      suffix="BAHT"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
  ]

  return (
    <>
      <ConfirmChangeModal
        modalHook={budgetConfirmModal}
        onConfirm={handleConfirmBudget}
        onCancel={handleCancelBudget}
        title={modalTitle}
        message={modalMessage}
      />
      <ConfirmChangeModal
        modalHook={mainGroupConfirmModal}
        onConfirm={handleConfirmMainGroup}
        onCancel={handleCancelMainGroup}
        title={mainGroupModalTitle}
        message={mainGroupModalMessage}
      />
      <Collapse defaultActiveKey={['1']} expandIconPosition="end" items={items} />
    </>
  )
}

export default PRDetailsForm