import React from 'react'

import { Col, Form, Input, Row } from 'antd'

import styles from './BudgetControlSheet.module.css'
import { clrErrorRed, clrWhite } from 'styles/theme'

import { PrBudgetControlSheetType } from 'api/prApi.types'

import { BCS_STATUS } from 'constants/index'
import { getFormattedCurrency } from 'utils/generalHelpers'

const { TextArea } = Input

type BCSTableProps = {
  budgetType?: string
  bcsData: PrBudgetControlSheetType[]
}

const BCSTable: React.FC<BCSTableProps> = ({ bcsData, budgetType }) => {
  const dataColumnsWidth = (100 - 35) / bcsData.length

  return (
    <div className={styles['budget-table-wrap']}>
      <table className={styles['budget-table']}>
        <tbody>
          <tr>
            <th
              colSpan={3 + bcsData.length}
              style={{ backgroundColor: clrWhite, padding: 0, border: 'none' }}
            >
              <div className={styles['budget-table-header']}>Bugdet Control Sheet</div>
            </th>
          </tr>
          <tr>
            <td colSpan={3 + bcsData.length}>
              <Row gutter={[16, 0]} align="middle">
                <Col>
                  <strong>Budget Type</strong>
                </Col>
                <Col>
                  <span>{budgetType}</span>
                </Col>
              </Row>
            </td>
          </tr>

          {/* เอาออกไปใช้ตรง Main Budget code แทน */}
          {/* <tr>
            <th colSpan={3} style={{ width: '35%' }}>
              Budget Name
            </th>
            {bcsData.map((data, index) => (
              <td key={index} style={{ width: `${dataColumnsWidth}%` }}>
                {data.budgetName}
              </td>
            ))}
          </tr> */}
          <tr>
            <th colSpan={3} style={{ width: '35%', textAlign: 'left' }}>
              Budget Year
            </th>
            {bcsData.map((data, index) => (
              <td key={index} style={{ width: `${dataColumnsWidth}%`, textAlign: 'right' }}>
                {data.budgetYear}
              </td>
            ))}
          </tr>
          <tr>
            <th colSpan={3} style={{ textAlign: 'left' }}>
              Budget Status
            </th>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {data.isOverBudget ? (
                  <span style={{ color: clrErrorRed }}>{BCS_STATUS.OVER_BUDGET}</span>
                ) : (
                  BCS_STATUS.NOT_OVER_BUDGET
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th colSpan={3} style={{ textAlign: 'left' }}>
              Cost Center
            </th>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {data.budgetSiteName}
              </td>
            ))}
          </tr>
          {/* Main Row */}
          <tr>
            <th rowSpan={2} style={{ textAlign: 'left' }}>
              Main
            </th>
            <td colSpan={2}>
              <div className={styles['split-text']}>Budget Code</div>
            </td>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {data.mainBudgetCode}
              </td>
            ))}
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={styles['split-text']}>
                <span>Budget Amount</span>
                <span>(A)</span>
              </div>
            </td>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {getFormattedCurrency(data.mainBudgetAmount)}
              </td>
            ))}
          </tr>
          {/* Sub Row */}
          <tr>
            <th rowSpan={2} style={{ textAlign: 'left' }}>
              Sub
            </th>
            <td colSpan={2}>
              <div className={styles['split-text']}>Budget Code</div>
            </td>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {data.subBudgetCode}
              </td>
            ))}
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={styles['split-text']}>Budget Amount</div>
            </td>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {getFormattedCurrency(data.subBudgetAmount)}
              </td>
            ))}
          </tr>
          {/* PR */}
          <tr>
            <th rowSpan={3} style={{ textAlign: 'left' }}>
              PR.
            </th>
            <th rowSpan={2} style={{ fontWeight: 'normal', textAlign: 'left' }}>
              Waiting for PO.
            </th>
            <th>
              <div className={styles['split-text']}>
                <span>PR. Pending </span>
                <span>(B)</span>
              </div>
            </th>
            {bcsData.map((data, index) => (
              <td key={index}>
                <div className={styles['split-text']}>
                  <span style={{ fontWeight: 'bold' }}>({data.numOfPendingAmount || '0'})</span>
                  <span>
                    {data.pendingAmount ? getFormattedCurrency(data.pendingAmount) : '0.00 ฿'}
                  </span>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <th>
              <div className={styles['split-text']}>
                <span>PR. Approve</span>
                <span>(C)</span>
              </div>
            </th>
            {bcsData.map((data, index) => (
              <td key={index}>
                <div className={styles['split-text']}>
                  <span style={{ fontWeight: 'bold' }}>({data.numOfApproveAmount || '0'})</span>
                  <span>
                    {data.approveAmount ? getFormattedCurrency(data.approveAmount) : '0.00 ฿'}
                  </span>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <th colSpan={2}>
              <div className={styles['split-text']}>
                <span>Amount of "This order"</span>
                <span>(D)</span>
              </div>
            </th>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {data.thisOrderAmount ? getFormattedCurrency(data.thisOrderAmount) : '0.00 ฿'}
              </td>
            ))}
          </tr>
          {/* Latest accumulate PO. issue */}
          <tr>
            <th colSpan={3}>
              <div className={styles['split-text']}>
                <span style={{ fontWeight: 'bold' }}>Latest accumulate PO. issue</span>
                <span>(E)</span>
              </div>
            </th>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {data.purchaseOrderAmount
                  ? getFormattedCurrency(data.purchaseOrderAmount)
                  : '0.00 ฿'}
              </td>
            ))}
          </tr>
          {/* Budget Remain */}
          <tr>
            <th colSpan={3}>
              <div className={styles['split-text']}>
                <span style={{ fontWeight: 'bold' }}>Budget Remain</span>
                <span>F = A - (B+C+D+E)</span>
              </div>
            </th>
            {bcsData.map((data, index) => (
              <td key={index} style={{ textAlign: 'right' }}>
                {data.budgetRemain ? getFormattedCurrency(data.budgetRemain) : '0.00 ฿'}
              </td>
            ))}
          </tr>
          {/* Remark */}
          <tr>
            <th colSpan={3} style={{ textAlign: 'left' }}>
              Remark
            </th>
            <td colSpan={bcsData.length}>
              <Form.Item name="budgetControlSheetRemark">
                <TextArea rows={2} />
              </Form.Item>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default BCSTable
