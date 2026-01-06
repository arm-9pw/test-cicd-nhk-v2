import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  dottedLine: {
    flexGrow: 1,
    textDecoration: 'none', // Disable default underline
  },
})

type Props = {
  label: string
  dotted?: string
}

const LabelWithDottedUnderline = ({ label, dotted }: Props) => (
  <View style={styles.row}>
    <Text>{label} :</Text>
    <Text style={styles.dottedLine}>
      {' '}
      {dotted || '...................................'}
    </Text>
  </View>
)

export default LabelWithDottedUnderline
