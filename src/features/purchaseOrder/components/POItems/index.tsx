import { ProfileOutlined } from '@ant-design/icons'
import {
  Col,
  Collapse,
  CollapseProps,
  Form,
  FormInstance,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from 'antd'

import { MainGroupType } from 'api/masterApi.types'
import { POItemType } from 'api/poApi.types'
import { BudgetItemType, PrBudgetControlSheetType } from 'api/prApi.types'

import { DropdownValueType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { gutter } from 'constants/index'

import { PRListDropdownType } from '../PRListDropdown'

import { columns } from './columns'
import POItemsSummary from './components/POItemsSummary'
import usePOItems from './hooks/usePOItems'

const { TextArea } = Input
const Text = Typography.Text

const newItemRow = {
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

type Props = {
  isNotRefPR: boolean
  isDisabledAllForm: boolean
  poItemsList: POItemType[]
  poItemsGrandTotal: number
  selectedCurrency: DropdownValueType | undefined
  exchangeRateSource: number | null
  exchangeRateDestination: number | null
  vatPercentage: number
  poItemsFormRef: FormInstance
  selectedBudgetType: DropdownValueType | undefined
  selectedBudget: BudgetItemType | null | undefined
  selectedMainGroup: MainGroupType | null
  prList: PRListDropdownType[]
  setVatPercentage: React.Dispatch<React.SetStateAction<number>>
  setPoItemsList: React.Dispatch<React.SetStateAction<POItemType[]>>
  setPoItemsGrandTotal: React.Dispatch<React.SetStateAction<number>>
  setBudgetControlSheetData: React.Dispatch<React.SetStateAction<PrBudgetControlSheetType[]>>
  updateBCSWithBudgetId: ({
    itemsList,
    budgetId,
  }: {
    budgetId: string
    itemsList: POItemType[]
  }) => Promise<void>
  updateMultipleBudgetBCS: (itemsList: POItemType[]) => Promise<void>
}

const POItems = ({
  isDisabledAllForm,
  updateMultipleBudgetBCS,
  poItemsFormRef,
  poItemsList,
  poItemsGrandTotal,
  exchangeRateSource,
  exchangeRateDestination,
  selectedCurrency,
  vatPercentage,
  setVatPercentage,
  setPoItemsList,
  setPoItemsGrandTotal,
  updateBCSWithBudgetId,
  setBudgetControlSheetData,
  selectedBudget,
  selectedMainGroup,
  isNotRefPR,
  selectedBudgetType,
  prList,
}: Props) => {
  const poItemsHook = usePOItems({
    prList,
    poItemsList,
    setPoItemsList,
    setPoItemsGrandTotal,
    updateBCSWithBudgetId,
    setBudgetControlSheetData,
    updateMultipleBudgetBCS,
    selectedBudget,
    selectedMainGroup,
    isNotRefPR,
  })

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
          <div style={{ textAlign: 'right' }}>
            <Text type="danger">กรุณาตรวจสอบราคาสินค้าใหม่ทุกครั้งก่อนระบุข้อมูลราคา</Text>
          </div>
          <Table
            bordered
            size="small"
            dataSource={isDisabledAllForm ? poItemsList : [...poItemsList, newItemRow]}
            columns={columns({
              isDisabledAllForm: isDisabledAllForm,
              editFormRef: poItemsHook.editFormRef,
              newItemFormRef: poItemsHook.newItemFormRef,
              editSelectedBudget: poItemsHook.editSelectedBudget,
              newSelectedBudget: poItemsHook.newSelectedBudget,
              onSetNewSelectedBudget: poItemsHook.onSetNewSelectedBudget,
              onSetEditSelectedBudget: poItemsHook.onSetEditSelectedBudget,
              handleAddNewItem: poItemsHook.handleAddNewItem,
              onEditRecord: poItemsHook.onEditRecord,
              isRecordBeingEdited: poItemsHook.isRecordBeingEdited,
              editingKey: poItemsHook.editingKey,
              onCancelEditing: poItemsHook.onCancelEditing,
              handleSaveEditedItem: poItemsHook.handleSaveEditedItem,
              handleDeleteItem: poItemsHook.handleDeleteItem,
              budgetListFromPR: poItemsHook.budgetListFromPR,
              selectedBudgetType: selectedBudgetType,
              isNotRefPR,
            })}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
          <POItemsSummary
            poItemsGrandTotal={poItemsGrandTotal}
            selectedCurrency={selectedCurrency}
            exchangeRateSource={exchangeRateSource}
            exchangeRateDestination={exchangeRateDestination}
            vatPercentage={vatPercentage}
            setVatPercentage={setVatPercentage}
            isDisabledAllForm={isDisabledAllForm}
          />
          <Form labelWrap disabled={isDisabledAllForm} form={poItemsFormRef} layout="vertical">
            <Row gutter={gutter} align="bottom">
              <Col span={24}>
                <Form.Item name="remarkItem" label="Remark/หมายเหตุ">
                  <TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Space>
      ),
    },
  ]

  return <Collapse defaultActiveKey={['1']} items={collapseItems} expandIconPosition="end" />
}

export default POItems
