import React from 'react'

import { ContainerOutlined } from '@ant-design/icons'
import { Checkbox, Col, Collapse, Form, FormInstance, Row, Space, Table } from 'antd'

import { MainGroupType } from 'api/masterApi.types'
import { POItemType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'

import {
  DropdownValueType,
  ExchangeRateType,
  PRAttachmentDataType,
} from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { gutter } from 'constants/index'

import { PRListDropdownType } from '../PRListDropdown'

import { columns } from './columns'
import PODetailsForm from './components/PODetailsForm'
import usePODetail from './hooks/usePODetail'

type Props = {
  isDisabledAllForm: boolean
  poDetailsFormRef: FormInstance
  selectedCurrency: DropdownValueType | undefined
  isNotRefPR: boolean
  prList: PRListDropdownType[]
  poItemsList: POItemType[]
  selectedBudget: BudgetItemType | null | undefined
  selectedBudgetType: DropdownValueType | undefined
  selectedMainGroup: MainGroupType | null
  setSelectedBudget: React.Dispatch<React.SetStateAction<BudgetItemType | null | undefined>>
  setSelectedMainGroup: React.Dispatch<React.SetStateAction<MainGroupType | null>>
  setSelectedCurrency: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setIsNotRefPR: React.Dispatch<React.SetStateAction<boolean>>
  setPrList: React.Dispatch<React.SetStateAction<PRListDropdownType[]>>
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setPoAttachmentsList: React.Dispatch<React.SetStateAction<PRAttachmentDataType[]>>
  setExchangeRates: React.Dispatch<React.SetStateAction<ExchangeRateType>>
  setSelectedBudgetType: React.Dispatch<React.SetStateAction<DropdownValueType | undefined>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  setIsRequiredUpdateBCS: React.Dispatch<React.SetStateAction<boolean>>
  updateMultipleBudgetBCS: (itemsList: POItemType[]) => void
}

const PODetail: React.FC<Props> = ({
  isDisabledAllForm,
  poDetailsFormRef,
  selectedCurrency,
  isNotRefPR,
  prList,
  poItemsList,
  selectedBudget,
  selectedBudgetType,
  selectedMainGroup,
  setSelectedCurrency,
  setIsNotRefPR,
  setPrList,
  setPoItemsList,
  setPoAttachmentsList,
  setExchangeRates,
  setSelectedBudgetType,
  setBudgetControlSheetData,
  updateMultipleBudgetBCS,
  setSelectedBudget,
  setIsRequiredUpdateBCS,
  setSelectedMainGroup,
}) => {
  const poDetailHook = usePODetail({
    poDetailsFormRef,
    prList,
    poItemsList,
    setPrList,
    setIsNotRefPR,
    setPoItemsList,
    setPoAttachmentsList,
    setSelectedBudgetType,
    setBudgetControlSheetData,
    updateMultipleBudgetBCS,
    setSelectedBudget,
    setSelectedCurrency,
    setSelectedMainGroup,
  })

  const _isDisabledAllForm = isDisabledAllForm || prList?.length > 0

  const items = [
    {
      key: '1',
      label: (
        <Space>
          <ContainerOutlined />
          Purchase Order (PO.)/ใบสั่งซื้อสินค้า
        </Space>
      ),
      children: (
        <Row gutter={gutter} align="bottom">
          {!isNotRefPR && (
            <Col span={24}>
              <Form form={poDetailHook.tableFormRef}>
                <Table
                  bordered
                  size="small"
                  columns={columns({
                    isDisabledAllForm,
                    onSelectPR: poDetailHook.onSelectPR,
                    selectedPR: poDetailHook.selectedPR,
                    onAddPR: poDetailHook.onAddPR,
                    onDeletePR: poDetailHook.onDeletePR,
                  })}
                  dataSource={
                    _isDisabledAllForm ? prList || [] : [...(prList || []), { key: 'new' }]
                  }
                  pagination={false}
                  scroll={{ x: true }}
                  tableLayout="auto"
                />
              </Form>
            </Col>
          )}

          <Col span={24} style={{ marginTop: 4 }}>
            <Checkbox
              disabled={isDisabledAllForm}
              checked={isNotRefPR}
              onChange={(e) => poDetailHook.onChangeNotReferPR(e.target.checked)}
            >
              Not Refer PR./ไม่อ้างอิงเอกสารขอสั่งซื้อ
            </Checkbox>
          </Col>

          <Col span={24}>
            <PODetailsForm
              selectedBudgetType={selectedBudgetType}
              isDisabledAllForm={isDisabledAllForm}
              formRef={poDetailsFormRef}
              isNotRefPR={isNotRefPR}
              selectedCurrency={selectedCurrency}
              selectedMainGroup={selectedMainGroup}
              setSelectedCurrency={setSelectedCurrency}
              setExchangeRates={setExchangeRates}
              setSelectedBudgetType={setSelectedBudgetType}
              setSelectedBudget={setSelectedBudget}
              setSelectedMainGroup={setSelectedMainGroup}
              selectedBudget={selectedBudget}
              setIsRequiredUpdateBCS={setIsRequiredUpdateBCS}
              poItemsList={poItemsList}
              setPoItemsList={setPoItemsList}
              setBudgetControlSheetData={setBudgetControlSheetData}
            />
          </Col>
        </Row>
      ),
    },
  ]

  return <Collapse defaultActiveKey={['1']} items={items} expandIconPosition="end" />
}

export default PODetail