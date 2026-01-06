import { clrBlack200 } from 'styles/theme'

import { formatNumber } from 'utils/generalHelpers'
import { commonItemCellStyles, getAmountInWords } from 'utils/pdfHelpers'

type GrandTotalRowProps = {
  total: number
  totalDiscount: number
  grandTotal: number
  currencyName: string
}

export const createGrandTotalRow = ({
  total,
  totalDiscount,
  grandTotal,
  currencyName,
}: GrandTotalRowProps) => {
  return [
    [
      {
        margin: [0, 4, 0, 0],
        rowSpan: 2,
        colSpan: 4,
        text: getAmountInWords(grandTotal, currencyName),
        bold: true,
        alignment: 'center',
        fillColor: clrBlack200,
        ...commonItemCellStyles,
        border: [1, 0, 1, 1],
      },
      '',
      '',
      '',
      {
        colSpan: 3,
        border: [0, 0, 1, 1],
        borderColor: ['default', 'default', clrBlack200, clrBlack200],
        columns: [
          {
            width: 70,
            bold: true,
            stack: [
              {
                text: 'TOTAL',
                alignment: 'center',
              },
              {
                text: 'TOTAL DISCOUNT',
                alignment: 'center',
              },
            ],
          },
          {
            width: '*',
            bold: true,
            stack: [
              {
                text: `${formatNumber(total)} ${currencyName}`,
                alignment: 'right',
              },
              {
                text: `${formatNumber(totalDiscount)} ${currencyName}`,
                alignment: 'right',
              },
            ],
          },
        ],
      },
      '',
      '',
    ],
    [
      '',
      '',
      '',
      '',
      {
        colSpan: 3,
        border: [0, 0, 1, 1],
        borderColor: ['default', 'default', clrBlack200, clrBlack200],
        columns: [
          {
            width: 70,
            bold: true,
            stack: [
              {
                text: 'GRAND TOTAL',
                alignment: 'center',
              },
              {
                text: '(EXCLUDE VAT)',
                alignment: 'center',
              },
            ],
          },
          {
            margin: [0, 4, 0, 0],
            width: '*',
            text: `${formatNumber(grandTotal)} ${currencyName}`,
            alignment: 'right',
            bold: true,
          },
        ],
      },
      '',
      '',
    ],
  ]
}
