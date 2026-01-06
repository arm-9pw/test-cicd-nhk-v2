import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { clrBlack } from 'styles/theme'

type Props = {
  label: string
}

const _styles = StyleSheet.create({
  signBox: {
    border: `1 solid ${clrBlack}`,
    width: '92px',
    height: '50px',
  },
})

const SignBox = ({ label }: Props) => {
  return (
    <View>
      <Text style={{ margin: 'auto' }}>{label}</Text>
      <View style={[_styles.signBox]} />
    </View>
  )
}

export default SignBox
