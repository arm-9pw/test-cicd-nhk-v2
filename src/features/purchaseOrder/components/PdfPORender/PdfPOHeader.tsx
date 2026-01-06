import { Image, Styles, Text, View } from '@react-pdf/renderer'

import nhkLogo from 'assets/images/nhk-logo.png'
import qrCode from 'assets/images/nhk-pr_qrcode.png'
import { clrErrorRed } from 'styles/theme'

import { SiteMasterType } from 'api/poApi.types'

import { formatDisplayDate } from 'utils/dateHelpers'

type Props = {
  styles: Styles
  poNo: string
  poDate: string
  isImport: boolean
  siteInvoice: SiteMasterType
}

const PdfPOHeader = ({ styles, poNo, poDate, isImport, siteInvoice }: Props) => {
  return (
    <View
      style={[
        styles.header,
        styles.flexRow,
        { justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' },
      ]}
    >
      {isImport && (
        <View style={{ position: 'absolute', bottom: '5px', left: '45%', width: '70px' }}>
          <Text style={[styles.textMD, { fontWeight: 800 }]}>(IMPORT)</Text>
        </View>
      )}
      <View>
        <View>
          <Image src={nhkLogo} style={{ height: '1.5cm', width: '3.5cm' }} />
        </View>
        <Text style={[styles.textMD, { fontWeight: 800, marginTop: '2px', lineHeight: 1 }]}>
          บริษัท เอ็นเอชเค สปริง (ประเทศไทย) จำกัด{' '}
        </Text>
        <Text style={[styles.textMD, { fontWeight: 800 }]}>NHK SPRING (THAILAND) CO.,LTD.</Text>
        <View style={[{ lineHeight: 1.2, fontSize: 8 }]}>
          <Text>
            <Text style={{ fontWeight: 800 }}>Tax ID : </Text>
            {siteInvoice.taxId || '-'}
            <Text style={{ fontWeight: 800 }}> Branch No. : </Text>
            {siteInvoice.siteBranchNo || '-'}
          </Text>
          <Text>
            <Text style={{ fontWeight: 800 }}>Address Invoice : </Text>
            {siteInvoice.addressEn}
          </Text>
          {siteInvoice.address2EN && <Text>{siteInvoice.address2EN}</Text>}
          <Text>
            {[siteInvoice.subDistrictEN, siteInvoice.districtEN, siteInvoice.provinceEn]
              .filter(Boolean)
              .join(', ')}
          </Text>
          <Text>{[siteInvoice.countryEN, siteInvoice.postalCode].filter(Boolean).join(', ')}</Text>
          <Text>Tel. {siteInvoice.tel || '-'},</Text>
          <Text>Fax. {siteInvoice.fax || '-'}</Text>
        </View>
      </View>
      <View>
        <Text style={[{ fontWeight: 800, fontSize: 18, textAlign: 'right' }]}>PURCHASE ORDER</Text>
        <Text style={[styles.textXS, { marginLeft: 'auto', marginTop: '10px' }]}>
          ต้นฉบับ / Original
        </Text>
        <Text style={[styles.textMD, { fontWeight: 800, color: clrErrorRed, marginLeft: 'auto' }]}>
          {poNo}
        </Text>
        <Text style={[styles.textXS, { fontWeight: 800, marginLeft: 'auto' }]}>
          Date: {formatDisplayDate(poDate)}
        </Text>
        <Image src={qrCode} style={{ height: '2.5cm', width: '2.5cm', marginLeft: 'auto' }} />
      </View>
    </View>
  )
}

export default PdfPOHeader
