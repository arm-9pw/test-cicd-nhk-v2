import { Styles, Text, View } from '@react-pdf/renderer'

import { clrPrimary, clrWhite } from 'styles/theme'

import { PurchaseRequisitionRespType } from 'api/prApi.types'

import KeyValueText from 'components/PdfComponents/KeyValueText'

type PdfPRDetailProps = {
  styles: Styles
  prData: PurchaseRequisitionRespType
}

const PdfPRDetail = ({ styles, prData }: PdfPRDetailProps) => {
  const getMainBudgetCode = () => {
    return (
      prData.purchaseRequisitionBudgetControlSheets
        .map((item) => item.mainBudgetCode)
        .filter(Boolean)
        .join(', ') || '-'
    )
  }

  const getSubBudgetCode = () => {
    return (
      prData.purchaseRequisitionBudgetControlSheets
        .map((item) => item.subBudgetCode)
        .filter(Boolean)
        .join(', ') || '-'
    )
  }

  return (
    <View fixed style={{ marginTop: '5px' }}>
      <View style={[styles.textMD, { backgroundColor: clrPrimary, borderRadius: '2px' }]}>
        <Text style={{ textAlign: 'center', color: clrWhite, fontWeight: 800 }}>
          PURCHASE REQUISITION {`#${prData.prNo}`}
        </Text>
      </View>

      {/* LINE 1 */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '2px' }}>
        <KeyValueText
          styles={styles}
          label="Name"
          value={prData.requesterName || '-'}
          labelWidth="69px"
          valueWidth="160px"
        />
        <KeyValueText
          styles={styles}
          label="Budget Type"
          value={prData.budgetTypeName || '-'}
          labelWidth="90px"
          valueWidth="100px"
        />
        <View style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          <View style={{ width: '70px' }}>
            <Text style={[styles.textXS, { fontWeight: 800 }]}>Budget Year :</Text>
          </View>
          <View style={{ width: '50px' }}>
            <Text style={[styles.textXS, { textAlign: 'right' }]}>{prData.budgetYear || '-'}</Text>
          </View>
        </View>
      </View>

      {/* LINE 2 */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '2px' }}>
        <KeyValueText styles={styles} label="Section" value={prData.requesterSection || '-'} />
        <KeyValueText
          styles={styles}
          label="Asset Type"
          value={prData.assetType || '-'}
          labelWidth="90px"
          valueWidth="230px"
        />
      </View>

      {/* LINE 3 */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '2px' }}>
        <KeyValueText styles={styles} label="Line" value={prData.line || '-'} />
        <KeyValueText
          styles={styles}
          label="Main Budget No."
          value={getMainBudgetCode()}
          labelWidth="90px"
          valueWidth="230px"
        />
      </View>

      {/* LINE 4 */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '2px' }}>
        <KeyValueText styles={styles} label="Site" value={prData.requesterSite || '-'} />
        <KeyValueText
          styles={styles}
          label="Sub Budget No."
          value={getSubBudgetCode()}
          labelWidth="90px"
          valueWidth="230px"
        />
      </View>

      {/* LINE 5 */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '2px' }}>
        <KeyValueText styles={styles} label="Main Group" value={prData.mainGroupName || '-'} />
        <KeyValueText
          styles={styles}
          label="Budget Desc."
          value={prData.budgetDescription || '-'}
          labelWidth="90px"
          valueWidth="230px"
        />
      </View>

      {/* LINE 6 */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '2px' }}>
        <KeyValueText styles={styles} label="Purpose" value={prData.purpose || '-'} />
        <KeyValueText
          styles={styles}
          label="Jobs Name"
          value={prData.jobName || '-'}
          labelWidth="90px"
          valueWidth="230px"
        />
      </View>
    </View>
  )
}

export default PdfPRDetail
