import { CalculatorOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Collapse, CollapseProps, Form, FormInstance, Space } from 'antd'

import { clrErrorRed } from 'styles/theme'

import { PrBudgetControlSheetType } from 'api/prApi.types'

import BCSTable from './BCSTable'
import BcsSkeletonLoading from './BcsSkeletonLoading'

type PRBudgetControlSheetProps = {
  isDisabledAllForm: boolean
  isBCSDataOutdated: boolean
  prBCSFormRef: FormInstance
  budgetControlSheetData: PrBudgetControlSheetType[]
  budgetType?: string
  isLoadingBCS: boolean
  refetchBCS: () => void
}

const PRBudgetControlSheet = ({
  isDisabledAllForm,
  isBCSDataOutdated,
  prBCSFormRef,
  budgetType,
  budgetControlSheetData,
  refetchBCS,
  isLoadingBCS,
}: PRBudgetControlSheetProps) => {
  const getContent = () => {
    if (isLoadingBCS) {
      return <BcsSkeletonLoading active={true} />
    }

    if (budgetControlSheetData.length <= 0)
      return (
        <>
          <p style={{ color: clrErrorRed, margin: '0 8px' }}>
            <i>Please add Items/รายการสินค้า first.</i>
          </p>
          <BcsSkeletonLoading active={false} />
        </>
      )

    if (isBCSDataOutdated && !isDisabledAllForm) {
      return (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              paddingBottom: 8,
            }}
          >
            <p style={{ color: clrErrorRed, margin: '0 8px' }}>
              <i>Budget control sheet data is outdated.</i>
            </p>
            <Button
              color="primary"
              variant="outlined"
              icon={<ReloadOutlined />}
              onClick={() => {
                refetchBCS()
              }}
            >
              Update Data
            </Button>
          </div>
          {budgetControlSheetData.length <= 0 ? (
            <BcsSkeletonLoading active={false} />
          ) : (
            <BCSTable bcsData={budgetControlSheetData} budgetType={budgetType} />
          )}
        </>
      )
    }

    return <BCSTable bcsData={budgetControlSheetData} budgetType={budgetType} />
  }

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space>
          <CalculatorOutlined />
          Budget Control Sheet/เอกสารควบคุมงบประมาณ
        </Space>
      ),
      children: getContent(),
    },
  ]

  return (
    <Form form={prBCSFormRef} disabled={isDisabledAllForm}>
      <Collapse defaultActiveKey={['1']} items={collapseItems} expandIconPosition="end" />
    </Form>
  )
}

export default PRBudgetControlSheet
