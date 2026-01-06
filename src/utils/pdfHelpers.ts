import { clrBlack200 } from 'styles/theme'

import { PrItemTypeWOKey } from 'api/prApi.types.js'

import { CURRENCY_NAMES_EN } from 'constants/currencies'
import toWords, { toThaiCurrencyWords } from 'utils/toWordsHelper'

import { CustomTableLayout } from 'pdfmake/interfaces'

import { formatNumber, formatNumberMax3Decimal, unitPriceNumberFormatter } from './generalHelpers'

export interface TableCellStyles {
  borderColor: string[]
  borderWidth: number[]
  border?: number[]
  alignment?: 'left' | 'center' | 'right'
  fillColor?: string
  color?: string
  bold?: boolean
  margin?: number[]
}

export interface ItemRowData {
  item: PrItemTypeWOKey
  index: number
  isLastRow: boolean
  styles: TableCellStyles
  currencySymbol: string
}

export const formatDescription = (item: PrItemTypeWOKey) => {
  const parts = [item.name]

  if (item.brand) {
    parts.push(`Brand ${item.brand}`)
  }

  if (item.model) {
    parts.push(`Model ${item.model}`)
  }

  if (item.detail) {
    parts.push(item.detail)
  }

  return parts.join(', ')
}

/**
 * Gets the full currency name from a currency code
 * @param currencyName The currency code (e.g., 'THB')
 * @returns The full currency name (e.g., 'Thai Baht')
 */
export const getFullCurrencyName = (currencyName: string | undefined): string => {
  return currencyName && Object.keys(CURRENCY_NAMES_EN).includes(currencyName)
    ? CURRENCY_NAMES_EN[currencyName as keyof typeof CURRENCY_NAMES_EN]
    : 'Baht'
}

/**
 * Converts a number to words and appends the currency name
 * @param amount The amount to convert
 * @param currencyName The currency code
 * @returns The amount in words with the currency name
 */
export const getAmountInWords = (amount: number, currencyName: string | undefined): string => {
  const fullCurrencyName = getFullCurrencyName(currencyName)

  if (currencyName === 'THB') return `${toThaiCurrencyWords(amount)}`
  else return `${toWords.convert(amount)} ${fullCurrencyName}`
}

export const commonItemCellStyles: TableCellStyles = {
  borderColor: [clrBlack200, clrBlack200, clrBlack200, clrBlack200],
  borderWidth: [1, 0, 1, 1],
}

export const createItemRow = ({ item, index, isLastRow, styles, currencySymbol }: ItemRowData) => {
  return [
    {
      text: `${item.matCode?.toUpperCase().includes('DUMMY') ? '*' : ''}` + (index + 1),
      ...styles,
      border: [true, false, true, isLastRow],
      alignment: 'center',
    },
    {
      text: formatDescription(item) || '',
      ...styles,
      border: [true, false, true, isLastRow],
    },
    {
      text: formatNumberMax3Decimal(item.qty),
      ...styles,
      border: [true, false, true, isLastRow],
      alignment: 'right',
    },
    {
      text: item.unit,
      ...styles,
      border: [true, false, true, isLastRow],
      alignment: 'center',
    },
    {
      text: unitPriceNumberFormatter(item.unitPrice),
      ...styles,
      border: [true, false, true, isLastRow],
      alignment: 'right',
    },
    {
      text: formatNumber(item.unitDiscount),
      ...styles,
      border: [true, false, true, isLastRow],
      alignment: 'right',
    },
    {
      text: `${formatNumber(item.netTotal)} ${currencySymbol}`,
      ...styles,
      border: [true, false, true, isLastRow],
      alignment: 'right',
    },
  ]
}

export function createTableLayout({ footerHeight }: { footerHeight: number }): CustomTableLayout {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let targetNode: any

  return {
    paddingBottom: function (rowIndex, node) {
      const DEFAULT_PADDING = 2

      // @ts-expect-error - positions property exists at runtime but not in type definition
      const _loopedNode = node.positions[node.positions.length - 1]

      if (rowIndex === node.table.body.length - 1) {
        // NOTE: Let it find the last node and store it in targetNode

        targetNode = _loopedNode
      }

      if (rowIndex === node.table.body.length - 2) {
        // NOTE: Apply padding to the second last row
        if (targetNode) {
          if (targetNode.pageInnerHeight - targetNode.top < footerHeight) {
            // NOTE: If footer cannot fit in the page, then return the space

            return targetNode.pageInnerHeight - targetNode.top
          }

          // NOTE: Calculate the padding bottom
          const paddingBottom = targetNode.pageInnerHeight - targetNode.top - footerHeight

          if (paddingBottom < 0) {
            // NOTE: If the padding bottom is less than 0, then return 0

            return 0
          }

          return paddingBottom
        }
      }
      // NOTE: If the row is not the second last row, then return the default padding
      return DEFAULT_PADDING
    },
  }
}
