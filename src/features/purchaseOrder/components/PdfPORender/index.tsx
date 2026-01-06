import { Document, Font, Page } from '@react-pdf/renderer'
import { useMemo } from 'react'

import SarabunBold from 'fonts/Sarabun-Bold.ttf'
import SarabunMed from 'fonts/Sarabun-Medium.ttf'
import Sarabun from 'fonts/Sarabun-Regular.ttf'

import { PurchaseOrderRespType } from 'api/poApi.types'

import PdfPageNumber from 'components/PdfComponents/PdfPageNumber'

import PdfPODetail from './PdfPODetail'
import PdfPOHeader from './PdfPOHeader'
import PdfPOItems from './PdfPOItems'
import PdfPOItemsTableFooter from './PdfPOItemsTableFooter'
import PdfPOPageFooter from './PdfPOPageFooter'
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

// Create Document Component
const PdfPORender = ({ poData }: { poData: PurchaseOrderRespType }) => {
  // Get the items or empty array if not available
  const poItems = useMemo(() => poData.purchaseOrderItems || [], [poData.purchaseOrderItems])
  const quotationFileList = useMemo(() => {
    return (
      (poData?.documentAttachFiles &&
        poData?.documentAttachFiles?.filter(
          (file) => file.domain === 'PURCHASE_ORDER' && file.documentType.includes('QUOTATION'),
        )) ||
      []
    )
  }, [poData])

  // Calculate the layout using our utility with the grand total in words
  const {
    layoutPlan,
    cumulativeIndices,
    totalPages,
    maxRowsFirstPage,
    maxRowsSubsequentWithSignature,
  } = calculatePdfLayout({ poItems, fileLineCount: quotationFileList.length })

  const totalUnitPrice = useMemo(() => {
    return poItems.reduce((acc, item) => acc + item.unitPrice * item.qty, 0)
  }, [poItems])

  const totalUnitDiscount = useMemo(() => {
    return poItems.reduce((acc, item) => acc + item.unitDiscount * item.qty, 0)
  }, [poItems])

  // Extract layout information
  const {
    itemPages,
    summaryOnFirstPage,
    tableFooterOnFirstPage,
    pageFooterOnFirstPage,
    needsStandalonePageFooterPage,
  } = layoutPlan

  // Calculate total pages including BCS page
  const totalPagesWithBcs = totalPages - 1 // NOTE: Not include BCS page (New requirement to separate them)

  return (
    <Document>
      {/* First page with items */}
      <Page size="A4" style={[styles.page, { position: 'relative' }]}>
        <PdfPOHeader
          styles={styles}
          poNo={poData.poNo}
          poDate={poData.poDate}
          isImport={poData.isImport}
          siteInvoice={poData.siteMaster}
        />
        <PdfPODetail mainStyles={styles} poData={poData} quotationFileList={quotationFileList} />

        {/* Render first page items */}
        {itemPages.length > 0 && (
          <PdfPOItems
            mainStyles={styles}
            poItems={itemPages[0]}
            currencyName={poData.currencyName}
            itemGrandTotal={poData.itemGrandTotal}
            totalUnitPrice={totalUnitPrice}
            totalUnitDiscount={totalUnitDiscount}
            showSummary={summaryOnFirstPage}
            emptyRowsCount={summaryOnFirstPage ? maxRowsFirstPage - itemPages[0].length : 0}
          />
        )}

        {/* Render table footer if it should be on first page */}
        {tableFooterOnFirstPage && (
          <PdfPOItemsTableFooter
            mainStyles={styles}
            isImport={poData.isImport}
            incoterm={poData.incoterm}
            itemRemark={poData.remarkItem}
          />
        )}

        {/* Render page footer if it should be on first page */}
        {pageFooterOnFirstPage && (
          <PdfPOPageFooter mainStyles={styles} isImport={poData.isImport} fixed={true} />
        )}

        <PdfPageNumber styles={styles} pageNumber={1} totalPages={totalPagesWithBcs} />
      </Page>

      {/* Render subsequent item pages if needed */}
      {itemPages.length > 1 &&
        itemPages.slice(1).map((pageItems, pageIndex) => {
          // Calculate the actual page index (pageIndex + 1 because we're starting from the second page)
          const actualPageIndex = pageIndex + 1
          // Determine if this is the last page of items
          const isLastItemPage = actualPageIndex === itemPages.length - 1
          const isFirstPage = actualPageIndex === 1

          return (
            <Page
              key={`item-page-${actualPageIndex}`}
              size="A4"
              style={[styles.page, { position: 'relative' }]}
            >
              <PdfPOHeader
                styles={styles}
                poNo={poData.poNo}
                poDate={poData.poDate}
                isImport={poData.isImport}
                siteInvoice={poData.siteMaster}
              />
              <PdfPODetail
                mainStyles={styles}
                poData={poData}
                quotationFileList={quotationFileList}
              />

              <PdfPOItems
                mainStyles={styles}
                poItems={pageItems}
                currencyName={poData.currencyName}
                itemGrandTotal={poData.itemGrandTotal}
                totalUnitPrice={totalUnitPrice}
                totalUnitDiscount={totalUnitDiscount}
                showSummary={isLastItemPage && !summaryOnFirstPage}
                startIndex={cumulativeIndices[actualPageIndex]}
                emptyRowsCount={
                  isFirstPage
                    ? maxRowsFirstPage - pageItems.length
                    : isLastItemPage && !summaryOnFirstPage
                      ? maxRowsSubsequentWithSignature - pageItems.length
                      : 0 // Middle pages don't need dummy rows
                }
              />

              {/* Render table footer on the last item page if not on first page */}
              {isLastItemPage && !tableFooterOnFirstPage && (
                <PdfPOItemsTableFooter
                  mainStyles={styles}
                  isImport={poData.isImport}
                  incoterm={poData.incoterm}
                  itemRemark={poData.remarkItem}
                />
              )}

              {/* Render page footer on the last item page if not on first page and doesn't need standalone page */}
              {isLastItemPage && !pageFooterOnFirstPage && !needsStandalonePageFooterPage && (
                <PdfPOPageFooter mainStyles={styles} isImport={poData.isImport} fixed={true} />
              )}

              <PdfPageNumber
                styles={styles}
                pageNumber={actualPageIndex + 1}
                totalPages={totalPagesWithBcs}
              />
            </Page>
          )
        })}

      {/* Standalone page footer page if needed */}
      {needsStandalonePageFooterPage && (
        <Page size="A4" style={[styles.page, { position: 'relative' }]}>
          <PdfPOPageFooter mainStyles={styles} isImport={poData.isImport} fixed={false} />
          <PdfPageNumber
            styles={styles}
            pageNumber={itemPages.length + 1}
            totalPages={totalPagesWithBcs}
          />
        </Page>
      )}
    </Document>
  )
}

export default PdfPORender
