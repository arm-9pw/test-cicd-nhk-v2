import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
  },
})

type Props = {
  label: string
}

const LabelWithCheckbox = ({ label }: Props) => (
  <View style={styles.row}>
    <View style={styles.checkbox} />
    <Text>{label} </Text>
  </View>
)

export default LabelWithCheckbox
