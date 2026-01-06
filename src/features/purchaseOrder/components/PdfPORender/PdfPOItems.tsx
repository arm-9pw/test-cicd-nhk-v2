import { StyleSheet, Styles, Text, View } from '@react-pdf/renderer'

import { clrBlack200, clrPrimary, clrWhite } from 'styles/theme'

import { PurchaseOrderItemRespType } from 'api/poApi.types'

import { getAmountInWords } from 'features/purchaseRequisition/components/PdfPRRender/utils/pdfCurrencyUtils'

import { CURRENCIES } from 'constants/currencies'
import { formatNumber, unitPriceNumberFormatter } from 'utils/generalHelpers'

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
    // border: `1px solid ${clrBlack200}`,
    padding: '2px 3px',
    fontWeight: 'bold',
    textAlign: 'right',
  },
})

// Format description by concatenating name, brand, and model
const formatDescription = (item: PurchaseOrderItemRespType) => {
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

type Props = {
  mainStyles: Styles
  currencyName: string
  poItems: PurchaseOrderItemRespType[]
  itemGrandTotal: number
  showSummary?: boolean
  startIndex?: number
  emptyRowsCount?: number
  totalUnitPrice: number
  totalUnitDiscount: number
}

const PdfPOItems = ({
  mainStyles,
  currencyName,
  poItems,
  itemGrandTotal,
  showSummary = true,
  startIndex = 0,
  emptyRowsCount = 0,
  totalUnitPrice,
  totalUnitDiscount,
}: Props) => {
  // Get currency symbol from the currency code (currencyName is already the code like 'THB')
  // Use type assertion to ensure TypeScript knows currencyName is a valid key in CURRENCIES
  const currencySymbol =
    currencyName && Object.keys(CURRENCIES).includes(currencyName)
      ? CURRENCIES[currencyName as keyof typeof CURRENCIES]
      : '฿'

  // Get full currency name from the currency code
  // const fullCurrencyName =
  //   currencyName && Object.keys(CURRENCY_NAMES_EN).includes(currencyName)
  //     ? CURRENCY_NAMES_EN[currencyName as keyof typeof CURRENCY_NAMES_EN]
  //     : 'Baht'

  // Convert grand total to words and append currency name
  const grandTotalInWords = getAmountInWords(itemGrandTotal, currencyName)

  return (
    <View style={[mainStyles.textXS, styles.table]}>
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
      {poItems.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.numberCell}>
            {(item.matCode?.toUpperCase().includes('DUMMY') ? '*' : '') + (startIndex + index + 1)}
          </Text>
          <Text style={styles.descriptionCell}>{formatDescription(item)}</Text>
          <Text style={styles.qtyCell}>{item.qty}</Text>
          <Text style={styles.unitCell}>{item.unit}</Text>
          <Text style={styles.priceCell}>{unitPriceNumberFormatter(item.unitPrice)}</Text>
          <Text style={styles.priceCell}>{formatNumber(item.unitDiscount)}</Text>
          <Text style={[styles.priceCell, { borderRight: `1px solid ${clrBlack200}` }]}>
            {formatNumber(item.netTotal)} {currencySymbol}
          </Text>
        </View>
      ))}

      {/* Dummy rows to fill space */}
      {Array.from({ length: emptyRowsCount }).map((_, index) => (
        <View key={`dummy-${index}`} style={styles.row}>
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

      {/* Only render summary if showSummary is true */}
      {showSummary && (
        <>
          {/* Summary row */}
          <View style={[styles.row]}>
            {/* First section: Grand total in words with grey background */}
            <View
              style={[
                styles.summaryGreyCell,
                styles.row,
                { width: 340, alignItems: 'center', justifyContent: 'center' },
              ]}
            >
              <Text>{grandTotalInWords}</Text>
            </View>

            {/* Second section: "GRAND TOTAL"  */}
            <View
              style={[
                styles.summaryCell,
                { width: 240, padding: '0', borderRight: `1px solid ${clrBlack200}` },
              ]}
            >
              <View
                style={[
                  mainStyles.flexRow,
                  {
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    borderBottom: `1px solid ${clrBlack200}`,
                  },
                ]}
              >
                <View style={{ width: '80px' }}>
                  <Text style={{ textAlign: 'center' }}>TOTAL</Text>
                  <Text style={{ textAlign: 'center' }}>TOTAL DISCOUNT</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(totalUnitPrice)}</Text>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(totalUnitDiscount)}</Text>
                </View>
                <View>
                  <Text style={{ textAlign: 'center' }}>{currencyName}</Text>
                  <Text style={{ textAlign: 'center' }}>{currencyName}</Text>
                </View>
              </View>
              <View
                style={[
                  mainStyles.flexRow,
                  {
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2px 3px',
                    borderBottom: `2px solid ${clrBlack200}`,
                  },
                ]}
              >
                <View style={{ width: '80px' }}>
                  <Text style={{ textAlign: 'center' }}>GRAND TOTAL</Text>
                  <Text style={{ textAlign: 'center' }}>(EXCLUDE VAT)</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(itemGrandTotal)}</Text>
                </View>
                <View>
                  <Text style={{ textAlign: 'center' }}>{currencyName}</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

export default PdfPOItems
