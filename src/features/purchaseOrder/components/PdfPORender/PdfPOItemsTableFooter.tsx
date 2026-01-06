import { StyleSheet, Styles, Text, View } from '@react-pdf/renderer'

import KeyValueText from 'components/PdfComponents/KeyValueText'
import LabelWithCheckbox from 'components/PdfComponents/LabelWithCheckbox'
import LabelWithDottedUnderline from 'components/PdfComponents/LabelWithDottedUnderline'

type Props = {
  isImport: boolean
  incoterm: string | null
  itemRemark: string | null
  mainStyles: Styles
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
  },
})

const PdfPOItemsTableFooter = ({ mainStyles, isImport, incoterm, itemRemark }: Props) => {
  return (
    <View style={[mainStyles.textXS, { marginTop: '5px' }]}>
      {isImport ? (
        <View style={[styles.row]}>
          {/* Incoterm */}
          <KeyValueText
            styles={mainStyles}
            label="**INCOTERM"
            value={incoterm || '-'}
            labelWidth="60px"
            valueWidth="490px"
          />
        </View>
      ) : (
        <View
          style={[
            mainStyles.textXS,
            {
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              justifyContent: 'space-between',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', gap: 2, justifyContent: 'space-evenly' }}>
            <LabelWithDottedUnderline label="ผู้รับใบสั่งซื้อ" />
            <LabelWithDottedUnderline label="วันที่รับ" />
          </View>
          <View style={{ flexDirection: 'row', gap: 2, justifyContent: 'space-evenly' }}>
            <LabelWithCheckbox label="ส่งได้ตามกำหนด" />
            <Text> | </Text>
            <LabelWithCheckbox label="ส่งได้ไม่ตามกำหนด" />
            <LabelWithDottedUnderline label="สามารถส่งได้วันที่" dotted="...................." />
          </View>
        </View>
      )}
      {/* Remarks */}
      <View style={[styles.row, { marginTop: -1 }]}>
        <KeyValueText
          styles={mainStyles}
          label="REMARK"
          value={itemRemark || '-'}
          labelWidth="50px"
          valueWidth="500px"
        />
      </View>
    </View>
  )
}

export default PdfPOItemsTableFooter
