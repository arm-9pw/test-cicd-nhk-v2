import { clrBlack200, clrPrimary, clrWhite } from 'styles/theme'

const createItemsTableHeader = () => {
  return [
    {
      text: 'NO.',
      fillColor: clrPrimary,
      color: clrWhite,
      bold: true,
      alignment: 'center',
      border: [1, 1, 1, 0],
      borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
    },
    {
      text: 'DESCRIPTION',
      fillColor: clrPrimary,
      color: clrWhite,
      bold: true,
      alignment: 'center',
      border: [1, 1, 1, 0],
      borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
    },
    {
      text: 'QTY',
      fillColor: clrPrimary,
      color: clrWhite,
      bold: true,
      alignment: 'center',
      border: [1, 1, 1, 0],
      borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
    },
    {
      text: 'UNIT',
      fillColor: clrPrimary,
      color: clrWhite,
      bold: true,
      alignment: 'center',
      border: [1, 1, 1, 0],
      borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
    },
    {
      text: 'UNIT PRICE',
      fillColor: clrPrimary,
      color: clrWhite,
      bold: true,
      alignment: 'center',
      border: [1, 1, 1, 0],
      borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
    },
    {
      text: 'UNIT DISCOUNT',
      fillColor: clrPrimary,
      color: clrWhite,
      bold: true,
      alignment: 'center',
      border: [1, 1, 1, 0],
      borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
    },
    {
      text: 'TOTAL',
      fillColor: clrPrimary,
      color: clrWhite,
      bold: true,
      alignment: 'center',
      border: [1, 1, 1, 0],
      borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
    },
  ]
}

export default createItemsTableHeader
