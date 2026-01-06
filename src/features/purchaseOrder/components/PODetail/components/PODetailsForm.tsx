import React, { useEffect, useRef } from 'react'

import { Checkbox, Col, Form, FormInstance, Input, InputNumber, Row, Space } from 'antd'
import dayjs from 'dayjs'

import { MainGroupType } from 'api/masterApi.types'
import { POItemType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'

import BudgetCodeDropdown from 'components/BudgetCodeDropdown'
import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import CurrencyDropdown from 'components/CurrencyDropdown'
import CustomDatePicker from 'components/CustomDatePicker'
import MainGroupDropdown from 'components/MaingroupDropdown'
import SiteDeliveryDropdown from 'components/SiteDeliveryDropdown'
import {
  DropdownValueType,
  ExchangeRateType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'
// import { BudgetItemTypeDropdown } from 'features/purchaseRequisition/components/BudgetItemDropdown'
import ConfirmChangeModal from 'features/purchaseRequisition/components/PRDetailsForm/components/ConfirmChangeModal'

import { gutter } from 'constants/index'

import useBudgetChangeConfirmation from '../hooks/useBudgetChangeConfirmation'
import useMainGroupChangeConfirmation from '../hooks/useMainGroupChangeConfirmation'

const SPAN = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }

type Props = {
  isDisabledAllForm: boolean
  isNotRefPR: boolean
  formRef: FormInstance
  poItemsList: POItemType[]
  selectedBudgetType: DropdownValueType | undefined
  selectedCurrency: DropdownValueType | undefined
  selectedBudget: BudgetItemType | null | undefined
  selectedMainGroup: MainGroupType | null
  setSelectedBudget: React.Dispatch<React.SetStateAction<BudgetItemType | null | undefined>>
  setSelectedMainGroup: React.Dispatch<React.SetStateAction<MainGroupType | null>>
  setSelectedCurrency: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setExchangeRates: React.Dispatch<React.SetStateAction<ExchangeRateType>>
  setSelectedBudgetType: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setIsRequiredUpdateBCS: React.Dispatch<React.SetStateAction<boolean>>
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
}

const PODetailsForm = ({
  isDisabledAllForm,
  formRef,
  isNotRefPR,
  selectedCurrency,
  selectedBudget,
  selectedBudgetType,
  selectedMainGroup,
  setSelectedCurrency,
  setSelectedBudget,
  setExchangeRates,
  setSelectedBudgetType,
  setIsRequiredUpdateBCS,
  poItemsList,
  setPoItemsList,
  setBudgetControlSheetData,
  setSelectedMainGroup,
}: Props) => {
  const renderCount = useRef(0)
  const isRequiredExchangeRate = !!selectedCurrency

  const exchangeRateSource = Form.useWatch('exchangeRateSource', formRef)
  const exchangeRateDestination = Form.useWatch('exchangeRateDestination', formRef)

  const isImport = Form.useWatch('isImport', formRef)
  const {
    modalMessage: budgetModalMessage,
    modalTitle: budgetModalTitle,
    handleBudgetChange,
    handleBudgetTypeChange,
    budgetConfirmModal,
    handleConfirmBudget,
    handleCancelBudget,
  } = useBudgetChangeConfirmation({
    isNotRefPR,
    poItemsList,
    onSelectBudget,
    setSelectedBudgetType,
    setPoItemsList,
    setBudgetControlSheetData,
    setSelectedBudget,
    selectedBudgetType,
    selectedBudget,
    formRef,
  })

  const {
    modalMessage: mainGroupModalMessage,
    modalTitle: mainGroupModalTitle,
    handleMainGroupChange,
    mainGroupConfirmModal,
    handleConfirmMainGroup,
    handleCancelMainGroup,
  } = useMainGroupChangeConfirmation({
    formRef,
    poItemsList,
    selectedMainGroup,
    setSelectedMainGroup,
    setPoItemsList,
    setBudgetControlSheetData,
  })

  // NOTE: disable exchange rate for THB
  const disableExchangeRate = selectedCurrency?.label === 'THB'

  // const defaultBudgetItemOptions: BudgetItemTypeDropdown[] = useMemo(() => {
  //   if (selectedBudget) {
  //     return [
  //       {
  //         budgetId: selectedBudget.budgetId || '',
  //         budgetCode: selectedBudget.budgetCode || '',
  //         budgetSiteId: selectedBudget.budgetSiteId || '',
  //         budgetSiteName: selectedBudget.budgetSiteName || '',
  //         label: selectedBudget.budgetCode || '',
  //         value: selectedBudget.budgetId || '',
  //       },
  //     ]
  //   } else {
  //     return []
  //   }
  // }, [selectedBudget])

  useEffect(() => {
    setExchangeRates({ source: exchangeRateSource, destination: exchangeRateDestination })

    if (renderCount.current <= 1) {
      // FIXME: use `renderCount <= 1`
      /* MAY'S NOTE: use `renderCount <= 1` because in PRODUCTION this effect will run `twice` for
      1. rendering things 
      2. setting default values, 
      and we only want to run setIsRequiredUpdateBCS only when everything is finished rendering and setting default values, 
      
      NOTE: This's not gonna work in DEVELOPMENT because of `strict mode` that runs this effect, by default twice, and the effect itself also runs twice
      that means `renderCount` value  always gonna be 2 or more, so the `setIsRequiredUpdateBCS(true)` will always run in DEVELOPMENT.
      But it's ok because production integrity is more important.
      */

      // Increment render count during the first mount
      renderCount.current += 1
      return // Skip running the effect
    }

    setIsRequiredUpdateBCS(true)
  }, [exchangeRateSource, exchangeRateDestination, setExchangeRates, setIsRequiredUpdateBCS])

  function onSelectBudget(budget: BudgetItemType | null) {
    if (!budget) {
      setSelectedBudget(null)
      formRef.resetFields(['budgetCode', 'budgetId'])
      return
    }

    setSelectedBudget(budget)
    formRef.setFieldsValue({
      budgetCode: budget.budgetCode,
      budgetId: budget.budgetId,
      budgetDescription: budget.budgetDescription,
    })
  }

  return (
    <>
      <ConfirmChangeModal
        modalHook={budgetConfirmModal}
        onConfirm={handleConfirmBudget}
        onCancel={handleCancelBudget}
        title={budgetModalTitle}
        message={budgetModalMessage}
      />
      <ConfirmChangeModal
        modalHook={mainGroupConfirmModal}
        onConfirm={handleConfirmMainGroup}
        onCancel={handleCancelMainGroup}
        title={mainGroupModalTitle}
        message={mainGroupModalMessage}
      />
      <Form
        labelWrap
        disabled={isDisabledAllForm}
        form={formRef}
        layout="vertical"
        initialValues={{ requiredDate: dayjs() }}
      >
        <Row gutter={gutter} align="middle">
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
                  handleMainGroupChange(option as MainGroupType & { value: string; label: string })
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
              name="siteInvoice"
              label="Site Invoice/ออกใบกำกับภาษีที่"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              {/* <SiteInvoiceTaxDropdown /> */}
              <SiteDeliveryDropdown
                onChange={(value) => {
                  formRef.setFieldsValue({
                    siteDelivery: {
                      value: value.value,
                      label: value.label,
                    },
                  })
                }}
              />
            </Form.Item>
          </Col>
          <Col {...SPAN}>
            <Form.Item
              name="deliveryDate"
              label="Delivery Date/กำหนดส่งของ"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <CustomDatePicker />
            </Form.Item>
          </Col>
          <Col {...SPAN}>
            <Form.Item
              name="siteDelivery"
              label="Site Delivery/ส่งของที่"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SiteDeliveryDropdown />
            </Form.Item>
          </Col>

          {isNotRefPR && (
            <>
              <Col {...SPAN}>
                {isDisabledAllForm ? (
                  <Form.Item label="Budget Code/งบประมาณเลขที่">
                    <Input
                      disabled
                      value={
                        selectedBudget?.budgetCode +
                        (selectedBudget?.budgetDescription
                          ? ' : ' + selectedBudget?.budgetDescription
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
                      disabled={!selectedBudgetType?.value}
                      budgetTypeId={selectedBudgetType?.value}
                      onChange={(_, option) => {
                        handleBudgetChange(option as BudgetItemType)
                      }}
                    />
                    {/* <BudgetItemDropdown
                    budgetTypeId={selectedBudgetType?.value}
                    defaultOptions={defaultBudgetItemOptions}
                    selectedBudget={selectedBudget}
                    onSetSelectedBudget={handleBudgetChange}
                  /> */}
                  </Form.Item>
                )}
                <Form.Item name="budgetId" hidden>
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col {...SPAN}>
                <Form.Item name="budgetDescription" label="Budget Description">
                  <Input />
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={isImport ? 12 : 24}>
            <Form.Item name="isImport" valuePropName="checked">
              <Checkbox>Import/สั่งซื้อต่างประเทศ</Checkbox>
            </Form.Item>
          </Col>
          {isImport && (
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="incoterm" label="Incoterm">
                <Input />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="currency" label="Currency/สกุลเงิน">
              <CurrencyDropdown
                onChange={(value) => {
                  if (value?.label === 'THB') {
                    formRef.setFieldsValue({
                      exchangeRateSource: 1,
                      exchangeRateDestination: 1,
                    })
                  }
                  setSelectedCurrency(value)
                }}
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
                    disabled={disableExchangeRate}
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
                    disabled={disableExchangeRate}
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
    </>
  )
}

export default PODetailsForm
