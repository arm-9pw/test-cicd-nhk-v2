import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { clrBlack } from 'styles/theme'

const _styles = StyleSheet.create({
  signBox: {
    border: `1 solid ${clrBlack}`,
    width: '100%',
    height: '30px',
  },
})

type Props = {
  label: string
  customStyles?: object
}

const PdfSignBox = ({ label, customStyles }: Props) => {
  return (
    <View style={{ width: '16%', ...customStyles }}>
      <Text style={{ margin: 'auto', fontSize: 8 }}>{label}</Text>
      <View>
        <Text style={[_styles.signBox]}>{` `}</Text>
      </View>
    </View>
  )
}

export default PdfSignBox
