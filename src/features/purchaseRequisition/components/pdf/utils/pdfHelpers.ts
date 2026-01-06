import { clrBlack200, clrErrorRed, clrPrimary, clrWhite } from 'styles/theme'

import { PurchaseRequisitionRespType } from 'api/prApi.types.js'

import { formatNumber } from 'utils/generalHelpers'
import { commonItemCellStyles, getAmountInWords } from 'utils/pdfHelpers'

export const getBudgetStatus = (
  budgetControlSheets: PurchaseRequisitionRespType['purchaseRequisitionBudgetControlSheets'],
) => {
  const overBudgets = budgetControlSheets.filter((bcs) => bcs.isOverBudget)
  return overBudgets.length > 0 ? `Over Budget(${overBudgets.length})` : 'On Budget'
}

type CreateGrandTotalRowProps = {
  grandTotal: number
  currencyName: string
}

export const createGrandTotalRow = ({ grandTotal, currencyName }: CreateGrandTotalRowProps) => {
  return [
    {
      colSpan: 4,
      text: getAmountInWords(grandTotal, currencyName),
      bold: true,
      alignment: 'left',
      fillColor: clrBlack200,
      ...commonItemCellStyles,
      border: [1, 0, 1, 1],
    },
    '',
    '',
    '',
    {
      text: 'GRAND TOTAL',
      bold: true,
      alignment: 'center',
      ...commonItemCellStyles,
      border: [1, 0, 1, 1],
    },
    {
      colSpan: 2,
      text: `${formatNumber(grandTotal)} ${currencyName}`,
      bold: true,
      alignment: 'right',
      fillColor: clrPrimary,
      color: clrWhite,
      borderColor: ['default', 'default', 'default', clrBlack200],
      border: [0, 0, 1, 0],
    },
    '',
  ]
}

export const createSummaryRow = (remark: string, budgetStatus: string) => {
  return [
    {
      colSpan: 4,
      text: [{ text: 'REMARK : ', bold: true }, { text: remark || '-' }],
      alignment: 'left',
      border: [0, 0, 0, 0],
      margin: [0, 0, 0, 10],
    },
    '',
    '',
    '',
    {
      text: 'BUDGET STATUS :',
      bold: true,
      alignment: 'center',
      border: [0, 0, 0, 0],
      margin: [0, 0, 0, 10],
    },
    {
      colSpan: 2,
      text: budgetStatus,
      bold: true,
      alignment: 'center',
      color: budgetStatus.includes('Over') ? clrErrorRed : undefined,
      border: [0, 0, 0, 0],
      margin: [0, 0, 0, 10],
    },
    '',
  ]
}
