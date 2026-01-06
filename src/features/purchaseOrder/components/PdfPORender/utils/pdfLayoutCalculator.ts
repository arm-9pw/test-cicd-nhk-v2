import { PurchaseOrderItemRespType } from 'api/poApi.types'

import { COMPONENT_HEIGHTS, MARGIN_ADJUSTMENTS, PAGE_HEIGHT } from './pdfConfig'
import { calculateRowHeight } from './pdfMeasurementUtils'
import { planPdfLayout } from './pdfPaginationUtils'

/**
 * Calculate the maximum number of rows that can fit on a page based on page type and content
 * Uses a content-aware approach to calculate row heights based on actual content
 */
export interface MaxRowsParams {
  pageType: 'firstPage' | 'subsequentWithFooter' | 'fullPage'
  headerHeight: number
  detailsHeight: number
  footerHeight: number
  tableHeaderHeight: number
  items: PurchaseOrderItemRespType[]
  startIndex?: number
  maxItems?: number
}

export const getMaxRowsForPageType = ({
  pageType,
  headerHeight,
  detailsHeight,
  footerHeight,
  tableHeaderHeight,
  items,
  startIndex = 0,
  maxItems = items.length - startIndex,
}: MaxRowsParams) => {
  // Calculate available height based on page type
  let availableHeight: number

  switch (pageType) {
    case 'firstPage':
      availableHeight =
        PAGE_HEIGHT -
        COMPONENT_HEIGHTS.header -
        COMPONENT_HEIGHTS.details -
        COMPONENT_HEIGHTS.remarkLine -
        COMPONENT_HEIGHTS.tableFooter -
        COMPONENT_HEIGHTS.signature -
        90
      break
    case 'subsequentWithFooter':
      availableHeight =
        PAGE_HEIGHT -
        COMPONENT_HEIGHTS.header -
        COMPONENT_HEIGHTS.details -
        COMPONENT_HEIGHTS.remarkLine -
        COMPONENT_HEIGHTS.tableFooter -
        COMPONENT_HEIGHTS.signature -
        40
      break
    case 'fullPage':
      availableHeight = PAGE_HEIGHT - COMPONENT_HEIGHTS.header - COMPONENT_HEIGHTS.details - 50
      break
    default:
      // Use the provided parameters for custom calculations if needed
      availableHeight =
        PAGE_HEIGHT -
        headerHeight -
        detailsHeight -
        footerHeight -
        MARGIN_ADJUSTMENTS.subsequentPage
  }

  // Subtract table header height
  availableHeight -= tableHeaderHeight

  // Calculate how many rows can fit based on content
  let totalHeight = 0
  let rowCount = 0

  // Process items starting from startIndex
  for (let i = startIndex; i < startIndex + maxItems && i < items.length; i++) {
    const item = items[i]
    const itemHeight = calculateRowHeight(item)

    if (totalHeight + itemHeight <= availableHeight) {
      totalHeight += itemHeight
      rowCount++
    } else {
      break
    }
  }

  // Calculate how many standard rows could fit in the remaining space
  const remainingSpace = availableHeight - totalHeight
  const additionalStandardRows = Math.floor(remainingSpace / COMPONENT_HEIGHTS.standardRowHeight)

  return rowCount + additionalStandardRows
}

/**
 * Calculates the layout for the PO PDF based on the provided data
 * This centralizes the layout calculations for better maintainability
 */
export const calculatePdfLayout = ({
  poItems: items,
  fileLineCount,
}: {
  poItems: PurchaseOrderItemRespType[]
  fileLineCount: number
}) => {
  // Calculate summary height
  const summaryHeight = COMPONENT_HEIGHTS.remarkLine

  // Calculate table footer height
  const tableFooterHeight = 32 // Approximate height for the PdfPOItemsTableFooter // FIXME: move this to pdfConfig ?

  // Calculate page footer height (signature section)
  const pageFooterHeight = COMPONENT_HEIGHTS.signature
  const totalFileHeight = fileLineCount > 1 ? fileLineCount * 14 : 0

  // Calculate available heights for different page types
  const firstPageAvailableHeight =
    PAGE_HEIGHT -
    COMPONENT_HEIGHTS.header -
    COMPONENT_HEIGHTS.details -
    MARGIN_ADJUSTMENTS.firstPage +
    totalFileHeight

  const subsequentPageAvailableHeight =
    PAGE_HEIGHT - COMPONENT_HEIGHTS.pageHeader - MARGIN_ADJUSTMENTS.subsequentPage + totalFileHeight

  // Plan the optimal PDF layout
  const layoutPlan = planPdfLayout(
    items,
    firstPageAvailableHeight,
    subsequentPageAvailableHeight,
    summaryHeight,
    tableFooterHeight,
    pageFooterHeight,
  )

  // Calculate maximum rows for different page types
  const maxRowsFirstPage = getMaxRowsForPageType({
    pageType: 'firstPage',
    headerHeight: COMPONENT_HEIGHTS.header,
    detailsHeight: COMPONENT_HEIGHTS.details + totalFileHeight,
    footerHeight: pageFooterHeight,
    tableHeaderHeight: COMPONENT_HEIGHTS.tableHeader,
    items,
  })

  // Calculate start indices for each page based on the itemPages from layoutPlan
  const itemPageLengths = layoutPlan.itemPages.map((page) => page.length)

  // Calculate cumulative indices (how many items are before each page)
  const cumulativeIndices = [0] // First page starts at index 0
  for (let i = 0; i < itemPageLengths.length; i++) {
    cumulativeIndices.push(cumulativeIndices[i] + itemPageLengths[i])
  }

  // For the last page, get the correct start index
  const lastPageIndex = Math.max(0, layoutPlan.itemPages.length - 1)
  const startIndexForLastPage = cumulativeIndices[lastPageIndex]

  // Calculate max rows for subsequent pages with footer (typically the last item page)
  const maxRowsSubsequentWithSignature = getMaxRowsForPageType({
    pageType: 'subsequentWithFooter',
    headerHeight: COMPONENT_HEIGHTS.pageHeader,
    detailsHeight: 0,
    footerHeight: pageFooterHeight,
    tableHeaderHeight: COMPONENT_HEIGHTS.tableHeader,
    items,
    startIndex: startIndexForLastPage,
  })

  // We no longer need maxRowsFullPage since we're not using it for dummy rows on middle pages

  return {
    layoutPlan,
    summaryHeight,
    tableFooterHeight,
    pageFooterHeight,
    startIndexForLastPage,
    cumulativeIndices,
    totalPages: layoutPlan.totalPages,
    maxRowsFirstPage,
    maxRowsSubsequentWithSignature,
  }
}
