import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { clrWhite700 } from 'styles/theme'

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  formlabel: {
    fontWeight: 800,
    fontSize: 8,
    textTransform: 'uppercase',
  },
  formValue: {
    flexGrow: 1,
    backgroundColor: clrWhite700,
    padding: '2px 5px',
    borderRadius: 2,
    minHeight: 20,
  },
})

type PdfTextAreaProps = {
  label: string
  value?: string
}

const PdfTextArea = ({ label, value = '' }: PdfTextAreaProps) => {
  return (
    <View style={[styles.flexRow]}>
      <Text style={[styles.formlabel]}>{label}</Text>
      <Text style={[styles.formValue]}>{value}</Text>
    </View>
  )
}

export default PdfTextArea
