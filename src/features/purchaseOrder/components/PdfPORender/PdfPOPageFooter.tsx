import { StyleSheet, Styles, Text, View } from '@react-pdf/renderer'


type Props = {
  isImport: boolean
  mainStyles: Styles
  fixed?: boolean
}

const _styles = StyleSheet.create({
  signPosition: {
    margin: '0 auto',
    fontWeight: 800,
  },
})

const PdfPOPageFooter = ({ isImport, mainStyles, fixed = false }: Props) => {
  return (
    <View
      style={{
        display: 'flex',
        position: fixed ? 'absolute' : 'relative',
        bottom: fixed ? 30 : undefined,
        left: fixed ? 20 : undefined,
        right: fixed ? 20 : undefined,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {isImport ? (
          <View
            style={[
              mainStyles.textXS,
              { flex: 1, flexDirection: 'row', gap: '3px', justifyContent: 'space-between' },
            ]}
          >
            <View>
              <Text>.....................................................</Text>
              <Text style={[mainStyles.textXS, _styles.signPosition]}>(Overseas)</Text>
            </View>
            <View>
              <Text>.....................................................</Text>
              <Text style={[mainStyles.textXS, _styles.signPosition]}>(Overseas MGR)</Text>
            </View>
          </View>
        ) : (
          <View style={[mainStyles.textXS, { flex: 1, fontSize: 7 }]}>
            <Text>
              <Text style={{ textDecoration: 'underline' }}>หมายเหตุ</Text> :
            </Text>
            <Text>
              - การส่งสินค้าโปรดส่งต้นฉบับใบกำกับภาษีหรือใบแจ้งหนี้พร้อมสำเนารวม 3 ฉบับ&nbsp;
              (ประทับตราบริษัทรับรองสำเนาถูกต้อง)&nbsp;&nbsp;&nbsp;&nbsp;
            </Text>
            <Text>
              - ใบกำกับภาษีหรือใบแจ้งหนี้กรุณาอ้างอิงที่อยู่ตาม Address Invoice พร้อมกับ Tax ID 13
              หลัก และรหัสสาขา
            </Text>
            <Text>- กรุณาอ้างอิงเลขที่ใบสั่งซื้อ และวันที่ใบสั่งซื้อและใบส่งของด้วยทุกครั้ง</Text>
            <Text>- การวางบิลให้มาวางบิลตามรอบการวางบิลของฝ่ายบัญชีและการเงิน (สำนักงานใหญ่) </Text>
            <Text>
              - ปิดรับ Invoice ทุกวันที่ 25 ของทุกเดือน กรณีตรงวันหยุดให้เลื่อนเข้า
              (ยกเว้นกรณีพิเศษ)
            </Text>
            <Text>
              {/* <Text style={{ color: clrErrorRed, textDecoration: 'underline' }}>*ห้าม</Text> */}
              <Text style={{ textDecoration: 'underline' }}>*ห้าม</Text>
              ส่งสินค้าเกินวันที่กำหนดโดยเด็ดขาด&nbsp;{' '}
              {/* <Text style={{ color: clrErrorRed }}>
                <Text style={{ textDecoration: 'underline' }}>ยกเว้น</Text>
                เหตุสุดวิสัยโดยให้แจ้งผ่านฝ่ายจัดซื้อทุกครั้ง
              </Text> */}
              <Text>
                <Text style={{ textDecoration: 'underline' }}>ยกเว้น</Text>
                เหตุสุดวิสัยโดยให้แจ้งผ่านฝ่ายจัดซื้อทุกครั้ง
              </Text>
            </Text>
          </View>
        )}
        <View
          style={{
            // width: '45%',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            marginTop: '15px',
            flex: 1,
          }}
        >
          <View style={{ alignSelf: 'center' }}>
            <Text>
              ............................................................................................................
            </Text>
            <Text style={[mainStyles.textXS, _styles.signPosition]}>(Purchaser)</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '3px',
              justifyContent: 'space-between',
              marginTop: '15px',
            }}
          >
            <View>
              <Text>.................................................</Text>
              <Text style={[mainStyles.textXS, _styles.signPosition]}>(MGR)</Text>
            </View>
            <View>
              <Text>.................................................</Text>
              <Text style={[mainStyles.textXS, _styles.signPosition]}>(DGM/GM)</Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '3px',
              justifyContent: 'space-between',
              marginTop: '15px',
            }}
          >
            <View>
              <Text>.................................................</Text>
              <Text style={[mainStyles.textXS, _styles.signPosition]}>(FGM/SD)</Text>
            </View>
            <View>
              <Text>.................................................</Text>
              <Text style={[mainStyles.textXS, _styles.signPosition]}>(VP/EVP)</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PdfPOPageFooter
