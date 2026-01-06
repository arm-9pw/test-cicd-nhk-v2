import { Styles, Text, View } from '@react-pdf/renderer'

const KeyValueText = ({
  styles,
  label,
  value,
  labelWidth = '70px',
  valueWidth = '160px',
}: {
  styles: Styles
  label: string
  value: string
  labelWidth?: string
  valueWidth?: string
}) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
      <View style={{ width: labelWidth }}>
        <Text style={[styles.textXS, { fontWeight: 800 }]}>{label} :</Text>
      </View>
      <View style={{ width: valueWidth }}>
        <Text style={[styles.textXS]}>{`${value} `}</Text>
      </View>
    </View>
  )
}

export default KeyValueText
