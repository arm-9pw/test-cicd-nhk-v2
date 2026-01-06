import { Image, Styles, Text, View } from '@react-pdf/renderer'

import nhkLogo from 'assets/images/nhk-logo.png'
import qrCode from 'assets/images/nhk-pr_qrcode.png'

type PdfPRHeaderProps = {
  styles: Styles
  requiredDate: string
  prDate: string
}

const PdfPRHeader = ({ styles, requiredDate, prDate }: PdfPRHeaderProps) => {
  return (
    <View fixed style={styles.header}>
      <View>
        <Image src={nhkLogo} style={{ height: '1.5cm' }} />
      </View>
      <View style={{ flexGrow: 1 }}>
        <View style={{ margin: '0 auto' }}>
          <Text style={[styles.textMD, { margin: '10px auto 0 auto' }]}>
            บริษัท เอ็นเอชเค สปริง (ประเทศไทย) จำกัด{' '}
          </Text>
          <Text style={[styles.textMD, { fontWeight: 800, margin: '0 auto' }]}>
            NHK SPRING (THAILAND) CO.,LTD.
          </Text>
          <Text style={[styles.textXS, { margin: '13px auto 0 auto' }]}>
            <Text style={[styles.textXS, { fontWeight: 800 }]}>REQUIRE DATE : </Text> {requiredDate}
          </Text>
        </View>
      </View>
      <View style={{ position: 'relative' }}>
        <Text style={[styles.textXS, { position: 'absolute', top: -12, right: 3 }]}>
          ต้นฉบับ / Original
        </Text>
        <View style={{ marginLeft: 'auto' }}>
          <Image src={qrCode} style={{ height: '2cm', width: '2cm' }} />
        </View>
        <Text style={[styles.textXS]}>
          <Text style={[styles.textXS, { fontWeight: 800 }]}>PR. DATE : </Text> {prDate}
        </Text>
      </View>
    </View>
  )
}

export default PdfPRHeader
