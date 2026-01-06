import { Document, Font, Page, View } from '@react-pdf/renderer'

import SarabunBold from 'fonts/Sarabun-Bold.ttf'
import SarabunMed from 'fonts/Sarabun-Medium.ttf'
import Sarabun from 'fonts/Sarabun-Regular.ttf'

import { PurchaseRequisitionRespType } from 'api/prApi.types'

import PdfBcsSection from 'components/PdfComponents/PdfBcsSection'
import PdfBscFooter from 'components/PdfComponents/PdfBscFooter'
import PdfPageNumber from 'components/PdfComponents/PdfPageNumber'

import { formatDisplayDate } from 'utils/dateHelpers'

import PdfBcsPageHeader from './PdfBcsPageHeader'
import PdfPRDetail from './PdfPRDetail'
import PdfPRHeader from './PdfPRHeader'
import PdfPRItems from './PdfPRItems'
import PdfPRSignatureSection from './PdfPRSignatureSection'
import { getAmountInWords } from './utils/pdfCurrencyUtils'
import { calculatePdfLayout } from './utils/pdfLayoutCalculator'
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

const PdfPRRender = ({ prData }: { prData: PurchaseRequisitionRespType }) => {
  // Generate grand total in words using our utility function
  const grandTotalInWords = getAmountInWords(prData.itemGrandTotal, prData.currencyName)

  // Calculate layout using the centralized layout calculator
  const {
    layoutPlan,
    maxRowsFirstPage,
    maxRowsSubsequentWithSignature,
    maxRowsFullPage,
    cumulativeIndices,
  } = calculatePdfLayout(prData.purchaseRequisitionItems, grandTotalInWords)

  return (
    <Document>
      {/* First page - always has header and details */}
      <Page size="A4" style={[styles.page, { position: 'relative' }]}>
        <PdfPRHeader
          styles={styles}
          requiredDate={formatDisplayDate(prData.requireDate)}
          prDate={formatDisplayDate(prData.prDate)}
        />
        <PdfPRDetail styles={styles} prData={prData} />

        {layoutPlan.itemPages.length > 0 && (
          <PdfPRItems
            mainStyles={styles}
            currencyName={prData.currencyName}
            prItems={layoutPlan.itemPages[0]}
            itemGrandTotal={prData.itemGrandTotal}
            grandTotalInWords={grandTotalInWords}
            itemRemark={prData.remarkItem}
            budgetControlSheet={prData.purchaseRequisitionBudgetControlSheets}
            showSummary={layoutPlan.summaryOnFirstPage}
            fillEmptyRows={layoutPlan.signatureOnFirstPage}
            maxRows={maxRowsFirstPage}
          />
        )}

        {layoutPlan.signatureOnFirstPage && <PdfPRSignatureSection styles={styles} fixed={true} />}

        <PdfPageNumber styles={styles} pageNumber={1} totalPages={layoutPlan.totalPages} />
      </Page>

      {/* Subsequent pages with items */}
      {layoutPlan.itemPages.slice(1).map((pageItems, index) => {
        const pageNumber = index + 2
        const isLastItemsPage = pageNumber === layoutPlan.itemPages.length
        const showSignature = isLastItemsPage && !layoutPlan.needsStandaloneSignaturePage
        const showSummary = isLastItemsPage && !layoutPlan.summaryOnFirstPage
        const maxRows = showSignature ? maxRowsSubsequentWithSignature : maxRowsFullPage

        // Calculate continuous item numbering
        const startItemNumber = cumulativeIndices[index + 1] + 1

        return (
          <Page
            key={`items-page-${index + 1}`}
            size="A4"
            style={[styles.page, { position: 'relative' }]}
          >
            <PdfPRHeader
              styles={styles}
              requiredDate={formatDisplayDate(prData.requireDate)}
              prDate={formatDisplayDate(prData.prDate)}
            />
            <PdfPRDetail styles={styles} prData={prData} />

            <PdfPRItems
              mainStyles={styles}
              currencyName={prData.currencyName}
              prItems={pageItems}
              itemGrandTotal={prData.itemGrandTotal}
              grandTotalInWords={grandTotalInWords}
              itemRemark={prData.remarkItem}
              budgetControlSheet={prData.purchaseRequisitionBudgetControlSheets}
              showSummary={showSummary}
              startItemNumber={startItemNumber}
              fillEmptyRows={showSignature}
              maxRows={maxRows}
            />

            {showSignature && <PdfPRSignatureSection styles={styles} fixed={true} />}

            <PdfPageNumber
              styles={styles}
              pageNumber={pageNumber}
              totalPages={layoutPlan.totalPages}
            />
          </Page>
        )
      })}

      {/* Standalone signature page if needed */}
      {layoutPlan.needsStandaloneSignaturePage && (
        <Page size="A4" style={[styles.page, { position: 'relative' }]}>
          <View style={{ marginTop: 20 }}>
            <PdfPRSignatureSection styles={styles} fixed={false} />
          </View>

          <PdfPageNumber
            styles={styles}
            pageNumber={layoutPlan.itemPages.length + 1}
            totalPages={layoutPlan.totalPages}
          />
        </Page>
      )}

      {/* BCS page */}
      <Page size="A4" style={[styles.page, { position: 'relative' }]}>
        <PdfBcsPageHeader styles={styles} prNo={prData.prNo} prDate={prData.prDate} />
        <PdfBcsSection
          domain={'PURCHASE_REQUISITION'}
          styles={styles}
          budgetTypeName={prData.budgetTypeName}
          budgets={prData.purchaseRequisitionBudgetControlSheets.map((b) => ({
            ...b,
            budgetStatus: '',
            id: '',
          }))}
          bcsRemark={prData.budgetControlSheetRemark}
        />
        <PdfBscFooter />
        <PdfPageNumber
          styles={styles}
          pageNumber={layoutPlan.totalPages}
          totalPages={layoutPlan.totalPages}
        />
      </Page>
    </Document>
  )
}

export default PdfPRRender
