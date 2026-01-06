import dayjs from 'dayjs'

import { clrBlack300, clrErrorRed, clrPrimary, clrWhite } from 'styles/theme'

import { BudgetControlSheetRespType } from 'api/poApi.types'

import { DOMAINS } from 'constants/index'
import { formatDisplayDate } from 'utils/dateHelpers.js'
import { getFormattedCurrency } from 'utils/generalHelpers'

type Props = {
  domain: 'PURCHASE_ORDER' | 'PURCHASE_REQUISITION'
  budgets: BudgetControlSheetRespType[]
  budgetTypeName: string | null
  bcsRemark: string | null
}

const createBCSTableSection = ({ domain, budgets, budgetTypeName, bcsRemark }: Props) => {
  return [
    // NOTE:  HEADER
    [
      {
        colSpan: 3 + budgets.length,
        text: 'BUDGET CONTROL SHEET/เอกสารควบคุมงบประมาณ',
        fillColor: clrPrimary,
        alignment: 'center',
        color: clrWhite,
        bold: true,
        margin: [0, -2, 0, 0],
        fontSize: 10,
      },
      '',
      '',
      ...budgets.map(() => ''),
    ],
    // NOTE: EMPTY SPACE ACT AS A MARGIN TOP
    [
      {
        colSpan: 3 + budgets.length,
        text: '',
        border: [0, 0, 0, 0],
      },
      '',
      '',
      ...budgets.map(() => ''),
    ],
    [
      {
        colSpan: 3 + budgets.length,
        text: 'BUDGET CONTROL SHEET',
        bold: true,
        alignment: 'center',
        fillColor: clrBlack300,
      },
      '',
      '',
      ...budgets.map(() => ''),
    ],
    // NOTE: BUDGET TYPE NAME
    [
      {
        colSpan: 3 + budgets.length,
        text: [{ text: 'BUDGET TYPE', bold: true }, { text: '   ' }, { text: budgetTypeName }],
      },
      '',
      '',
      ...budgets.map(() => ''),
    ],
    // NOTE: BUDGET YEAR
    [
      {
        colSpan: 3,
        text: 'BUDGET YEAR',
        bold: true,
      },
      '',
      '',
      ...budgets.map((budget, idx) => ({
        text: budget.budgetYear,
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: BUDGET STATUS
    [
      {
        colSpan: 3,
        text: 'BUGDET STATUS',
        bold: true,
      },
      '',
      '',
      ...budgets.map((budget, idx) => ({
        text: budget.isOverBudget ? 'OVER BUDGET' : 'ON BUDGET',
        color: budget.isOverBudget ? clrErrorRed : undefined,
        alignment: 'right',
        bold: budget.isOverBudget ? true : false,
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: COST CENTER
    [
      {
        colSpan: 3,
        text: 'COST CENTER',
        bold: true,
      },
      '',
      '',
      ...budgets.map((budget, idx) => ({
        text: budget.budgetSiteName,
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: ------ MAIN ------
    [
      {
        rowSpan: 2,
        text: 'MAIN',
        bold: true,
        alignment: 'center',
      },
      {
        colSpan: 2,
        text: 'BUDGET CODE',
        bold: true,
        borderColor: [clrBlack300, 'default', 'default', clrBlack300],
      },
      '',
      ...budgets.map((budget, idx) => ({
        text: budget.mainBudgetCode,
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', clrBlack300] // last row
            : [clrBlack300, 'default', 'default', clrBlack300], // left, top, right, bottom
      })),
    ],
    [
      '',
      {
        colSpan: 2,
        columns: [
          {
            width: '*',
            text: 'BUDGET AMOUNT',
            bold: true,
          },
          {
            width: 'auto',
            text: '(A)',
            alignment: 'right',
            bold: true,
          },
        ],
        borderColor: [clrBlack300, 'default', 'default', 'default'],
      },
      '',
      ...budgets.map((budget, idx) => ({
        text: getFormattedCurrency(budget.mainBudgetAmount),
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: ------ SUB ------
    [
      {
        rowSpan: 2,
        text: 'SUB',
        bold: true,
        alignment: 'center',
      },
      {
        colSpan: 2,
        text: 'BUDGET CODE',
        bold: true,
        borderColor: [clrBlack300, 'default', 'default', clrBlack300],
      },
      '',
      ...budgets.map((budget, idx) => ({
        text: budget.subBudgetCode,
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', clrBlack300] // last row
            : [clrBlack300, 'default', 'default', clrBlack300], // left, top, right, bottom
      })),
    ],
    [
      '',
      {
        colSpan: 2,
        columns: [
          {
            text: 'BUDGET AMOUNT',
            bold: true,
          },
        ],
        borderColor: [clrBlack300, 'default', 'default', 'default'],
      },
      '',
      ...budgets.map((budget, idx) => ({
        text: getFormattedCurrency(budget.subBudgetAmount),
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: ------ DOMAIN ------
    [
      {
        rowSpan: 3,
        text: domain === DOMAINS.PURCHASE_ORDER ? 'PO.' : 'PR.',
        bold: true,
        alignment: 'center',
      },
      {
        rowSpan: 2,
        text: 'WAITING FOR PO.',
        bold: true,
        borderColor: [clrBlack300, 'black', clrBlack300, clrBlack300],
      },
      {
        columns: [
          {
            width: '*',
            text: 'PR. PENDING',
            bold: true,
          },
          {
            width: 'auto',
            text: '(B)',
            bold: true,
            alignment: 'right',
          },
        ],
        borderColor: [clrBlack300, 'black', clrBlack300, clrBlack300],
      },
      ...budgets.map((budget, idx) => ({
        columns: [
          {
            width: 'auto',
            text: `(${budget.numOfPendingAmount || '0'})`,
          },
          {
            width: '*',
            text: getFormattedCurrency(budget.pendingAmount) || '0.00 ฿',
            alignment: 'right',
          },
        ],
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', clrBlack300] // last row
            : [clrBlack300, 'default', 'default', clrBlack300], // left, top, right, bottom
      })),
    ],
    [
      '',
      '',
      {
        columns: [
          {
            width: '*',
            text: 'PR. APPROVE',
            bold: true,
          },
          {
            width: 'auto',
            text: '(C)',
            bold: true,
            alignment: 'right',
          },
        ],
        borderColor: [clrBlack300, 'black', clrBlack300, clrBlack300],
      },
      ...budgets.map((budget, idx) => ({
        columns: [
          {
            width: 'auto',
            text: `(${budget.numOfApproveAmount || '0'})`,
          },
          {
            width: '*',
            text: getFormattedCurrency(budget.approveAmount) || '0.00 ฿',
            alignment: 'right',
          },
        ],
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', clrBlack300] // last row
            : [clrBlack300, 'default', 'default', clrBlack300], // left, top, right, bottom
      })),
    ],
    [
      '',
      {
        colSpan: 2,
        columns: [
          {
            width: '*',
            text: 'AMOUNT OF "THIS ORDER"',
            bold: true,
          },
          {
            width: 'auto',
            text: '(D)',
            bold: true,
            alignment: 'right',
          },
        ],
        borderColor: [clrBlack300, 'default', 'default', 'black'],
      },
      '',
      ...budgets.map((budget, idx) => ({
        text: getFormattedCurrency(budget.thisOrderAmount) || '0.00 ฿',
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: LATEST ACCUMULATE PO. ISSUE
    [
      {
        colSpan: 3,
        columns: [
          {
            width: '*',
            text: 'LATEST ACCUMULATE PO. ISSUE',
            bold: true,
          },
          {
            width: 'auto',
            text: '(E)',
            bold: true,
            alignment: 'right',
          },
        ],
      },
      '',
      '',
      ...budgets.map((budget, idx) => ({
        text: getFormattedCurrency(budget.purchaseOrderAmount) || '0.00 ฿',
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: BUDGET REMAIN
    [
      {
        colSpan: 3,
        columns: [
          {
            width: 'auto',
            text: 'BUDGET REMAIN',
            bold: true,
          },
          {
            width: '*',
            text: 'F=A-(B+C+D+E)',
            bold: true,
            alignment: 'right',
          },
        ],
      },
      '',
      '',
      ...budgets.map((budget, idx) => ({
        text: getFormattedCurrency(budget.budgetRemain) || '0.00 ฿',
        alignment: 'right',
        borderColor:
          idx === budgets.length - 1
            ? [clrBlack300, 'black', 'black', 'black'] // last row
            : [clrBlack300, 'default', 'default', 'black'], // left, top, right, bottom
      })),
    ],
    // NOTE: REMARK
    [
      {
        colSpan: 3,
        text: 'REMARK',
        bold: true,
        borderColor: ['default', 'default', clrBlack300, 'black'],
      },
      '',
      '',
      {
        colSpan: budgets.length,
        text: bcsRemark,
      },
      ...Array(budgets.length - 1).fill(''), // Additional empty strings for remark content
    ],
    // NOTE: PRINT DATE
    [
      {
        colSpan: 3 + budgets.length,
        border: [0, 0, 0, 0],
        margin: [-5, 0, -5, 0],
        columns: [
          {
            width: 'auto',
            text: 'REMARK: PLEASE EXPLAIN DETAIL IN OVER BUDGET CASE (CANNOT EXCEED THE BUDGET 10% OF BUDGET AMOUNT (A), MAXIMUM 500,000 THB) ',
            fontSize: 6,
          },
          {
            width: '*',
            text: [
              { text: 'Print Date: ', bold: true },
              { text: formatDisplayDate(dayjs().toDate()) },
            ],
            fontSize: 6,
            alignment: 'right',
          },
        ],
      },
      '',
      '',
      ...budgets.map(() => ''),
    ],
  ]
}

export default createBCSTableSection
