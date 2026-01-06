import { StyleSheet, Styles, Text, View } from '@react-pdf/renderer'

import { clrBlack200, clrPrimary, clrWhite } from 'styles/theme'

import { DocumentAttachFileRespType, PurchaseOrderRespType } from 'api/poApi.types'

import { formatDisplayDate } from 'utils/dateHelpers'

// Define styles
const styles = StyleSheet.create({
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'stretch',
  },
  header: {
    backgroundColor: clrPrimary,
    color: clrWhite,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionCell: {
    width: 193,
    border: `1px solid ${clrBlack200}`,
    padding: '0px 1px 1px 1px',
    textAlign: 'left',
  },
})

type Props = {
  poData: PurchaseOrderRespType
  mainStyles: Styles
  quotationFileList: DocumentAttachFileRespType[]
}

const PdfPODetail = ({ mainStyles, poData, quotationFileList }: Props) => {
  const getPaymentTerm = () => {
    return ['Separate Payment', 'Other Payment'].includes(poData?.paymentTermName || '')
      ? poData.paymentTermDescription || '-'
      : poData.paymentTermName || '-'
  }

  const getBudgetType = () => {
    if (poData.isReferPr) {
      let budgetTypeText = poData.isReferPr
        ? poData?.purchaseRequisitions[0]?.budgetTypeName || '-'
        : ''

      if (poData?.purchaseRequisitions[0]?.budgetYear) {
        budgetTypeText = budgetTypeText + `- ${poData?.purchaseRequisitions[0]?.budgetYear}`
      }
      return budgetTypeText
    } else {
      return poData.budgetTypeName || '-'
    }
  }

  const getMainBudgetCode = () => {
    return poData.purchaseOrderBudgetControlSheets
      .map((item) => item.mainBudgetCode)
      .filter(Boolean)
      .join(', ')
  }

  const getSubBudgetCode = () => {
    return (
      poData.purchaseOrderBudgetControlSheets
        .map((item) => item.subBudgetCode)
        .filter(Boolean)
        .join(', ') || '-'
    )
  }

  return (
    <View style={{ marginTop: '5px' }}>
      <View style={[mainStyles.textXS, styles.table]}>
        {/* Header row */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.descriptionCell, { padding: '1px 3px' }]}>
            REQUESTER INFORMATION
          </Text>
          <Text style={[styles.descriptionCell, { padding: '1px 3px' }]}>VENDER INFORMATION</Text>
          <Text style={[styles.descriptionCell, { padding: '1px 3px' }]}>PR. INFORMATION</Text>
        </View>

        {/* Data rows */}
        <View style={[styles.row]}>
          <View style={[styles.descriptionCell]}>
            <Text style={{ fontWeight: 800 }}>Delivery: {poData.siteDeliveryName || '-'}</Text>
            <Text>
              Requester:{' '}
              {poData.isReferPr
                ? poData?.purchaseRequisitions[0]?.requesterName || '-'
                : poData.purchaserName || '-'}
            </Text>
            <Text>
              Email:{' '}
              {poData.isReferPr
                ? poData?.purchaseRequisitions[0]?.requesterEmail || '-'
                : poData.purchaserEmail || '-'}
            </Text>
            <Text>
              Section:{' '}
              {poData.isReferPr
                ? poData?.purchaseRequisitions[0]?.requesterSection || '-'
                : poData.purchaserSection || '-'}
            </Text>
            <Text>
              Tel.:{' '}
              {poData.isReferPr
                ? poData?.purchaseRequisitions[0]?.requesterTel || '-'
                : poData.purchaserTel || '-'}
            </Text>
          </View>
          <View style={[styles.descriptionCell]}>
            <Text style={{ fontWeight: 800 }}>Name: {poData.supplierName}</Text>
            <Text>Attn: {poData.supplierAttention || '-'}</Text>
            <Text>Tel: {poData.supplierTelephone || '-'}</Text>
            <Text>Email: {poData.supplierEmail || '-'}</Text>
            <Text>PaymentTerm: {getPaymentTerm()}</Text>
            <Text>Vender Code: {poData.supplierCode || '-'}</Text>
            <Text>Tax ID: {poData.supplierTaxId || '-'}</Text>
          </View>
          <View style={[styles.descriptionCell]}>
            <Text>
              PR.No.: {poData.isReferPr ? poData?.purchaseRequisitions[0]?.prNo || '-' : '-'}
            </Text>
            <Text>
              Date:{' '}
              {poData.isReferPr
                ? formatDisplayDate(poData?.purchaseRequisitions[0]?.prDate) || '-'
                : '-'}
            </Text>
            <Text>Budget Type: {getBudgetType()}</Text>
            <Text>
              Main Budget No.:{' '}
              {/* {poData.isReferPr ? poData?.purchaseRequisitions[0]?.budgetCode || '-' : ''} */}
              {getMainBudgetCode()}
            </Text>
            <Text>
              Sub Budget No.:{' '}
              {/* {poData.isReferPr ? poData?.purchaseRequisitions[0]?.subBudgetCode || '-' : ''} */}
              {getSubBudgetCode()}
            </Text>
          </View>
        </View>

        {/* Header row */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.descriptionCell, { textAlign: 'center' }]}>DELIVERY DATE</Text>
          <Text style={[styles.descriptionCell, { textAlign: 'center' }]}>
            QUOTATION INFORMATION
          </Text>
          <Text style={[styles.descriptionCell, { textAlign: 'center' }]}>
            PURCHASE INFORMATION
          </Text>
        </View>

        {/* Data rows */}
        <View style={[styles.row]}>
          <Text style={[styles.descriptionCell, { padding: '1px', textAlign: 'center' }]}>
            {formatDisplayDate(poData.deliveryDate) || '-'}
          </Text>
          <View
            style={[
              styles.descriptionCell,
              { padding: '1px', textAlign: 'center', flexDirection: 'column' },
            ]}
          >
            {quotationFileList.length > 0 ? (
              quotationFileList.map((item) => (
                <Text
                  key={item.id}
                >{`No.: ${item.documentNo || '-'} Date: ${formatDisplayDate(item.documentDate) || '-'}`}</Text>
              ))
            ) : (
              <Text>-</Text>
            )}
          </View>
          <Text style={[styles.descriptionCell, { padding: '1px', textAlign: 'center' }]}>
            {poData.purchaserName || '-'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PdfPODetail
