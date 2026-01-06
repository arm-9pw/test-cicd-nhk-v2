import { Image, Styles, Text, View } from '@react-pdf/renderer'

import nhkLogo from 'assets/images/nhk-logo.png'
import qrCode from 'assets/images/nhk-pr_qrcode.png'
import { clrErrorRed } from 'styles/theme'

import { formatDisplayDate } from 'utils/dateHelpers'

type PdfBcsPageHeaderProps = {
  styles: Styles
  prNo: string
  prDate: string
}

const PdfBcsPageHeader = ({ styles, prNo, prDate }: PdfBcsPageHeaderProps) => {
  return (
    <View style={styles.header}>
      <View>
        <Image src={nhkLogo} style={{ height: '1.5cm' }} />
      </View>
      <View style={{ flexGrow: 1 }}>
        <View style={{ margin: '0 auto' }}>
          <Text style={[styles.textMD, { margin: '8px auto 0 auto' }]}>
            บริษัท เอ็นเอชเค สปริง (ประเทศไทย) จำกัด{' '}
          </Text>
          <Text style={[styles.textMD, { fontWeight: 800, margin: '0 auto' }]}>
            NHK SPRING (THAILAND) CO.,LTD.
          </Text>
        </View>
      </View>
      <View style={{ position: 'relative' }}>
        <Text style={[styles.textXS, { position: 'absolute', top: -11, right: 2 }]}>
          ต้นฉบับ / Original
        </Text>
        <Text style={[styles.textMD, { fontWeight: 800, color: clrErrorRed, marginLeft: 'auto' }]}>
          {prNo}
        </Text>
        <Text style={[styles.textXS, { fontWeight: 800, marginLeft: 'auto' }]}>
          Date: {formatDisplayDate(prDate)}
        </Text>
        <View style={{ marginLeft: 'auto' }}>
          <Image src={qrCode} style={{ height: '2cm', width: '2cm' }} />
        </View>
      </View>
    </View>
  )
}

export default PdfBcsPageHeader
