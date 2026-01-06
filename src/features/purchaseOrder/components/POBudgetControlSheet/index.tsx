import React from 'react'

import { CalculatorOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Collapse, Form, Space } from 'antd'
import type { CollapseProps, FormInstance } from 'antd'

import { clrErrorRed } from 'styles/theme'

import { PrBudgetControlSheetType } from 'api/prApi.types'

import BcsSkeletonLoading from 'features/purchaseRequisition/components/PRBudgetControlSheet/BcsSkeletonLoading'

import BCSTable from './BCSTable'

type Props = {
  isDisabledAllForm: boolean
  poBCSFormRef: FormInstance
  budgetType?: string
  budgetControlSheetData?: PrBudgetControlSheetType[]
  isRequiredUpdateBCS: boolean
  isLoadingBCS: boolean
  refetchBCS: () => void
}

const POBudgetControlSheet: React.FC<Props> = ({
  isDisabledAllForm,
  poBCSFormRef,
  budgetType,
  budgetControlSheetData = [],
  isRequiredUpdateBCS,
  isLoadingBCS,
  refetchBCS,
}) => {
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

    if (isRequiredUpdateBCS && !isDisabledAllForm) {
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
            <BCSTable budgetType={budgetType} budgetControlSheetData={budgetControlSheetData} />
          )}
        </>
      )
    }

    return <BCSTable budgetType={budgetType} budgetControlSheetData={budgetControlSheetData} />
  }

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space>
          {/* <AccountBookOutlined /> */}
          <CalculatorOutlined />
          Budget Control Sheet/เอกสารควบคุมงบประมาณ
        </Space>
      ),
      children: getContent(),
    },
  ]

  return (
    <Form form={poBCSFormRef} disabled={isDisabledAllForm}>
      <Collapse defaultActiveKey={['1']} items={collapseItems} expandIconPosition="end" />
    </Form>
  )
}

export default POBudgetControlSheet
