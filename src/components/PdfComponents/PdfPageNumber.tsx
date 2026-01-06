import { Styles, Text, View } from '@react-pdf/renderer'

type PdfPageFooterProps = {
  styles: Styles
  pageNumber: number
  totalPages: number
}

const PdfPageNumber = ({ styles, pageNumber, totalPages }: PdfPageFooterProps) => {
  return (
    <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
      <Text style={[styles.textXS, { fontWeight: 800 }]}>
        Page {pageNumber}/{totalPages}
      </Text>
    </View>
  )
}

export default PdfPageNumber
