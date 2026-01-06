import { StyleSheet, Styles, Text, View } from '@react-pdf/renderer'

import { clrBlack200, clrErrorRed, clrPrimary, clrWhite } from 'styles/theme'

import { PrBudgetControlSheetTypeWOKey, PrItemTypeWOKey } from 'api/prApi.types'

import KeyValueText from 'components/PdfComponents/KeyValueText'

import { CURRENCIES, CURRENCY_NAMES_EN } from 'constants/currencies'
import { formatNumber } from 'utils/generalHelpers'

import { formatDescription } from './utils/pdfMeasurementUtils'

// Define styles
const styles = StyleSheet.create({
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderBottom: `1px solid ${clrBlack200}`,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  header: {
    backgroundColor: clrPrimary,
    color: clrWhite,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    width: 80,
    border: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    textAlign: 'center',
  },
  numberCell: {
    width: 34,
    borderLeft: `1px solid ${clrBlack200}`,
    // borderBottom: 'none',
    padding: '2px 3px',
    textAlign: 'center',
  },
  descriptionCell: {
    width: 193,
    borderLeft: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    textAlign: 'left',
  },
  qtyCell: {
    width: 39,
    borderLeft: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    textAlign: 'right',
  },
  unitCell: {
    width: 58,
    borderLeft: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    textAlign: 'center',
  },
  priceCell: {
    width: 77,
    borderLeft: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    textAlign: 'right',
  },
  // New styles for summary row
  summaryCell: {
    borderLeft: `1px solid ${clrBlack200}`,
    borderTop: `1px solid ${clrBlack200}`,
    borderBottom: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    fontWeight: 'bold',
  },
  summaryGreyCell: {
    backgroundColor: clrBlack200,
    borderLeft: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  summaryTotalCell: {
    backgroundColor: clrPrimary,
    color: clrWhite,
    // borderTop: `1px solid ${clrBlack200}`,
    // borderLeft: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    fontWeight: 'bold',
    textAlign: 'right',
  },
})

type Props = {
  mainStyles: Styles
  currencyName: string
  prItems: PrItemTypeWOKey[]
  itemGrandTotal: number
  itemRemark: string
  budgetControlSheet: PrBudgetControlSheetTypeWOKey[]
  grandTotalInWords: string
  showSummary?: boolean
  startItemNumber?: number
  fillEmptyRows?: boolean
  maxRows?: number
}

const PdfPRItems = ({
  mainStyles,
  currencyName,
  prItems,
  itemGrandTotal,
  budgetControlSheet,
  itemRemark,
  grandTotalInWords,
  showSummary = true,
  startItemNumber = 1,
  fillEmptyRows = false,
  maxRows = 10,
}: Props) => {
  // Get currency symbol from the currency code (currencyName is already the code like 'THB')
  // Use type assertion to ensure TypeScript knows currencyName is a valid key in CURRENCIES
  const currencySymbol =
    currencyName && Object.keys(CURRENCIES).includes(currencyName)
      ? CURRENCIES[currencyName as keyof typeof CURRENCIES]
      : '฿'

  // Get full currency name from the currency code
  const fullCurrencyName =
    currencyName && Object.keys(CURRENCY_NAMES_EN).includes(currencyName)
      ? CURRENCY_NAMES_EN[currencyName as keyof typeof CURRENCY_NAMES_EN]
      : 'Baht'

  const getBudgetStatus = () => {
    const overBudgets = budgetControlSheet.filter((bcs) => bcs.isOverBudget)
    if (overBudgets.length > 0) {
      return (
        <Text
          style={[mainStyles.textXS, { color: clrErrorRed, fontWeight: 800, textAlign: 'center' }]}
        >
          Over Budget({overBudgets.length})
        </Text>
      )
    } else {
      return (
        <Text style={[mainStyles.textXS, { fontWeight: 800, textAlign: 'center' }]}>On Budget</Text>
      )
    }
  }

  // Calculate number of empty rows to render
  const emptyRowsCount = fillEmptyRows ? Math.max(0, maxRows - prItems.length) : 0

  return (
    <View style={[mainStyles.textXS, { marginTop: '5px' }]}>
      <View style={styles.table}>
        {/* Header row */}
        <View style={[styles.row, styles.header]}>
          <Text style={styles.numberCell}>NO.</Text>
          <Text style={[styles.descriptionCell, { textAlign: 'center' }]}>DESCRIPTION</Text>
          <Text style={[styles.qtyCell, { textAlign: 'center' }]}>QTY</Text>
          <Text style={[styles.unitCell, { textAlign: 'center' }]}>UNIT</Text>
          <Text style={[styles.priceCell, { textAlign: 'center' }]}>UNIT PRICE</Text>
          <Text style={[styles.priceCell, { textAlign: 'center' }]}>UNIT DISCOUNT</Text>
          <Text
            style={[
              styles.priceCell,
              { textAlign: 'center', borderRight: `1px solid ${clrBlack200}` },
            ]}
          >
            TOTAL
          </Text>
        </View>

        {/* Data rows */}
        {prItems.map((item, index) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.numberCell}>
              {`${item.matCode?.toUpperCase().includes('DUMMY') ? '*' : ''}` +
                (startItemNumber + index)}
            </Text>
            <Text style={styles.descriptionCell}>{formatDescription(item)}</Text>
            <Text style={styles.qtyCell}>{item.qty}</Text>
            <Text style={styles.unitCell}>{item.unit}</Text>
            <Text style={styles.priceCell}>{formatNumber(item.unitPrice)}</Text>
            <Text style={styles.priceCell}>{formatNumber(item.unitDiscount)}</Text>
            <Text style={[styles.priceCell, { borderRight: `1px solid ${clrBlack200}` }]}>
              {formatNumber(item.netTotal)} {currencySymbol}
            </Text>
          </View>
        ))}

        {/* Empty rows to fill space if needed */}
        {emptyRowsCount > 0 &&
          Array.from({ length: emptyRowsCount }).map((_, index) => (
            <View key={`empty-row-${index}`} style={styles.row}>
              <Text style={styles.numberCell}>&nbsp;</Text>
              <Text style={styles.descriptionCell}>&nbsp;</Text>
              <Text style={styles.qtyCell}>&nbsp;</Text>
              <Text style={styles.unitCell}>&nbsp;</Text>
              <Text style={styles.priceCell}>&nbsp;</Text>
              <Text style={styles.priceCell}>&nbsp;</Text>
              <Text style={[styles.priceCell, { borderRight: `1px solid ${clrBlack200}` }]}>
                &nbsp;
              </Text>
            </View>
          ))}

        {/* Summary section - only shown when showSummary is true */}
        {showSummary && (
          <>
            {/* Summary row */}
            <View style={styles.row}>
              {/* First section: Grand total in words with grey background */}
              <View style={[{ width: 324 }, styles.summaryGreyCell]}>
                <Text>{grandTotalInWords}</Text>
              </View>

              {/* Second section: "GRAND TOTAL" in the UNIT PRICE column */}
              <View style={[{ width: 77 }, styles.summaryCell]}>
                <Text style={{ textAlign: 'center' }}>GRAND TOTAL</Text>
              </View>

              {/* Third section: Grand total value spanning from UNIT DISCOUNT to TOTAL with primary background and white text */}
              <View style={[{ width: 154 }, styles.summaryTotalCell]}>
                <Text>
                  {formatNumber(itemGrandTotal)} {fullCurrencyName}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
      {showSummary && (
        <>
          {/* Remark and Budget Status Row */}
          <View style={[styles.row, { marginTop: '2px' }]}>
            <KeyValueText
              styles={mainStyles}
              label="REMARK"
              value={itemRemark || '-'}
              labelWidth="50px"
              valueWidth="290px"
            />
            <View style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
              <View style={{ width: '80px' }}>
                <Text style={[mainStyles.textXS, { fontWeight: 800, textAlign: 'center' }]}>
                  BUDGET STATUS :
                </Text>
              </View>
              <View style={{ width: '160px' }}>{getBudgetStatus()}</View>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

export default PdfPRItems
