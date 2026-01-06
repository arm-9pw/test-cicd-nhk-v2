import { StyleSheet, Styles, Text, View } from '@react-pdf/renderer'

import PdfSignBox from 'components/PdfComponents/PdfSignBox'

type Props = {
  styles: Styles
}

const _styles = StyleSheet.create({
  signBoxWrapper: { gap: 1, justifyContent: 'space-evenly', marginTop: '5px' },
})

const PdfSignatureSection = ({ styles }: Props) => {
  return (
    <View style={[styles.pageMargin, { marginTop: '15px' }]}>
      <View>
        <Text style={[styles.headerText]}>REQESTER DIVISION</Text>
        <View style={[styles.flexRow, _styles.signBoxWrapper]}>
          <PdfSignBox label="REQUESTER/CHIEF" />
          <PdfSignBox label="MANAGER/DGM." />
          <PdfSignBox label="GM." />
          <PdfSignBox label="FGM." />
          <PdfSignBox label="SDC./EMC./SD." />
          <PdfSignBox label="VP./SVP./EVP." />
        </View>
      </View>
      <View style={{ marginTop: '5px' }}>
        <Text style={[styles.headerText]}>PURCHASE DIVISION</Text>
        <View style={[styles.flexRow, _styles.signBoxWrapper]}>
          <PdfSignBox label="RECEIVER FACT." />
          <PdfSignBox label="CHIEF.FACT." />
          <PdfSignBox label="MANAGER" />
          <PdfSignBox label="RECEIVER HO." />
          <PdfSignBox label="CHIEF HO." />
          <PdfSignBox label="MANAGER" />
        </View>
      </View>
    </View>
  )
}

export default PdfSignatureSection
