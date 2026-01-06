import { PrItemTypeWOKey } from 'api/prApi.types'

import { COMPONENT_HEIGHTS, MARGIN_ADJUSTMENTS, PAGE_HEIGHT, TEXT_CONFIG } from './pdfConfig'
import { estimateTextHeight, getMaxRowsForPageType } from './pdfMeasurementUtils'
import { planPdfLayout } from './pdfPaginationUtils'

/**
 * Calculates the layout for the PDF based on the provided data
 * This centralizes the layout calculations without changing the logic
 */
export const calculatePdfLayout = (items: PrItemTypeWOKey[], grandTotalInWords: string) => {
  // Calculate the height needed for the grand total in words
  const summaryWordsHeight = Math.max(
    estimateTextHeight(
      grandTotalInWords,
      TEXT_CONFIG.fontSize.sm,
      TEXT_CONFIG.lineHeight,
      TEXT_CONFIG.widthUnitsPerLine.summary,
    ),
    COMPONENT_HEIGHTS.standardRowHeight,
  )

  // Calculate summary height (exactly as in the original code)
  const summaryHeight = COMPONENT_HEIGHTS.remarkLine + summaryWordsHeight

  // Calculate available heights for different page types (exactly as in the original code)
  const firstPageAvailableHeight =
    PAGE_HEIGHT -
    COMPONENT_HEIGHTS.header -
    COMPONENT_HEIGHTS.details -
    COMPONENT_HEIGHTS.footer -
    MARGIN_ADJUSTMENTS.firstPage

  const subsequentPageAvailableHeight =
    PAGE_HEIGHT -
    COMPONENT_HEIGHTS.pageHeader -
    COMPONENT_HEIGHTS.footer -
    MARGIN_ADJUSTMENTS.subsequentPage

  // Plan the optimal PDF layout (same function call as in the original code)
  const layoutPlan = planPdfLayout(
    items,
    firstPageAvailableHeight,
    subsequentPageAvailableHeight,
    summaryHeight,
    COMPONENT_HEIGHTS.signature,
  )

  // Calculate maximum rows for different page types (same as in the original code)
  const maxRowsFirstPage = getMaxRowsForPageType(
    'firstWithSignature',
    COMPONENT_HEIGHTS.header,
    COMPONENT_HEIGHTS.details,
    COMPONENT_HEIGHTS.signature,
    COMPONENT_HEIGHTS.remarkLine + COMPONENT_HEIGHTS.tableHeader,
    items, // Pass the items to calculate content-aware row height
  )

  // Calculate start indices for each page based on the itemPages from layoutPlan
  const itemPageLengths = layoutPlan.itemPages.map((page) => page.length)

  // Calculate cumulative indices (how many items are before each page)
  const cumulativeIndices = [0] // First page starts at index 0
  for (let i = 0; i < itemPageLengths.length; i++) {
    cumulativeIndices.push(cumulativeIndices[i] + itemPageLengths[i])
  }

  // For the last page, get the correct start index
  const lastPageIndex = layoutPlan.itemPages.length - 1
  const startIndexForLastPage = cumulativeIndices[lastPageIndex]

  // Calculate max rows for subsequent pages with signature (typically the last item page)
  const maxRowsSubsequentWithSignature = getMaxRowsForPageType(
    'subsequentWithSignature',
    COMPONENT_HEIGHTS.pageHeader,
    0,
    COMPONENT_HEIGHTS.signature,
    COMPONENT_HEIGHTS.remarkLine + COMPONENT_HEIGHTS.tableHeader,
    items,
    startIndexForLastPage, // Use the start index for the last page
  )

  // Calculate max rows for full pages (pages without signature or summary)
  const maxRowsFullPage = getMaxRowsForPageType(
    'fullPage',
    COMPONENT_HEIGHTS.pageHeader,
    0,
    0,
    COMPONENT_HEIGHTS.remarkLine + COMPONENT_HEIGHTS.tableHeader,
    items,
    startIndexForLastPage, // Use the start index for the last page
  )

  return {
    layoutPlan,
    maxRowsFirstPage,
    maxRowsSubsequentWithSignature,
    maxRowsFullPage,
    startIndexForLastPage,
    cumulativeIndices,
  }
}
