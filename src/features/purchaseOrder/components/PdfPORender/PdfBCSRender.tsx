import { Document, Font, Page } from '@react-pdf/renderer'

import SarabunBold from 'fonts/Sarabun-Bold.ttf'
import SarabunMed from 'fonts/Sarabun-Medium.ttf'
import Sarabun from 'fonts/Sarabun-Regular.ttf'

import { PurchaseOrderRespType } from 'api/poApi.types'

import PdfBcsSection from 'components/PdfComponents/PdfBcsSection'
import PdfBscFooter from 'components/PdfComponents/PdfBscFooter'
import PdfPageNumber from 'components/PdfComponents/PdfPageNumber'

import PdfBcsPageHeader from './PdfBcsPageHeader'
import { createPdfStyles } from './utils/pdfStyles'

Font.register({
  family: 'Sarabun',
  fonts: [
    { src: Sarabun }, // font-style: normal, font-weight: normal
    { src: SarabunMed, fontWeight: 500 },
    { src: SarabunBold, fontWeight: 800 },
  ],
})

// Create styles using our centralized style creator
const styles = createPdfStyles()

// Create Document Component
const PdfBCSRender = ({ poData }: { poData: PurchaseOrderRespType }) => {
  return (
    <Document>
      {/* BCS page (always the last page) */}
      <Page size="A4" style={[styles.page, { position: 'relative' }]}>
        <PdfBcsPageHeader styles={styles} poNo={poData.poNo} poDate={poData.poDate} />
        <PdfBcsSection
          domain={'PURCHASE_ORDER'}
          styles={styles}
          budgetTypeName={poData.budgetTypeName}
          budgets={poData.purchaseOrderBudgetControlSheets}
          bcsRemark={poData.remarkBudgetControlSheet}
        />
        <PdfBscFooter />
        <PdfPageNumber styles={styles} pageNumber={1} totalPages={1} />
      </Page>
    </Document>
  )
}

export default PdfBCSRender
