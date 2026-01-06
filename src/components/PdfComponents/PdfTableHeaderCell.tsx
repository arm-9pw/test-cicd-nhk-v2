import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { clrBlack200 } from 'styles/theme'

const styles = StyleSheet.create({
  tableCell: {
    fontSize: 7,
    fontWeight: 800,
    padding: 5,
    border: `1 solid ${clrBlack200}`,
    marginLeft: -1,
    textAlign: 'center',
  },
})

type PdfTableHeaderCellProps = {
  value: string
  width?: string
  textAlign?: 'center' | 'left' | 'right'
  customStyles?: object
}

const PdfTableHeaderCell = ({
  value,
  width = '50px',
  textAlign = 'center',
  customStyles,
}: PdfTableHeaderCellProps) => {
  return (
    <View style={[styles.tableCell, { width, textAlign, ...customStyles }]}>
      <Text style={{ margin: 'auto 0' }}>{value}</Text>
    </View>
  )
}

export default PdfTableHeaderCell
