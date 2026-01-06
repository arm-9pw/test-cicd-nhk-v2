import { Styles, Text, View } from '@react-pdf/renderer'

import { clrErrorRed } from 'styles/theme'

import PdfInput from 'components/PdfComponents/PdfInput'

import { formatNumber } from 'utils/generalHelpers'
import { toThaiCurrencyWords } from 'utils/toWordsHelper'

type PdfPRItemsSummaryProps = {
  grandTotal: number
  styles: Styles
}

const PdfPRItemsSummary = ({ styles, grandTotal }: PdfPRItemsSummaryProps) => {
  return (
    <View style={[styles.pageMargin, styles.textXS]}>
      <View style={[styles.flexRow]}>
        <View style={{ width: '330px' }}>
          <Text style={[styles.formValue]}>{toThaiCurrencyWords(grandTotal)}</Text>
        </View>
        <View style={[styles.flexRow, { gap: '5px' }]}>
          <Text style={[{ fontWeight: 800, width: '105px', textAlign: 'right' }]}>Grand Total</Text>
          <Text style={{ width: '55px', textAlign: 'right' }}>{formatNumber(grandTotal)}</Text>
          <Text>BAHT.</Text>
        </View>
      </View>
      <View style={[styles.flexRow, { marginTop: '5px' }]}>
        <View style={{ width: '330px' }}>
          <PdfInput label="Remark" value="" minHeight="15px" />
        </View>
        <View style={[styles.flexRow, { gap: '5px' }]}>
          <Text style={[{ fontWeight: 800, width: '105px', textAlign: 'right' }]}>
            Budget Status
          </Text>
          <Text style={{ width: '55px', textAlign: 'right', color: clrErrorRed }}>Over Budget</Text>
        </View>
      </View>
    </View>
  )
}

export default PdfPRItemsSummary
