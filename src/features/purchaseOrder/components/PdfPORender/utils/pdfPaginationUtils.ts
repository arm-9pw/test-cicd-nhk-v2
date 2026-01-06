import { PurchaseOrderItemRespType } from 'api/poApi.types'

import { COMPONENT_HEIGHTS } from './pdfConfig'
import { calculateRowHeight } from './pdfMeasurementUtils'

// Define interface for page layout plan
export interface PageLayoutPlan {
  itemPages: PurchaseOrderItemRespType[][]
  summaryOnFirstPage: boolean
  tableFooterOnFirstPage: boolean
  pageFooterOnFirstPage: boolean
  needsStandalonePageFooterPage: boolean
  totalPages: number
}

// Calculate maximum rows that can fit in available space based on actual content heights
export const calculateMaxRowsFromItems = (
  items: PurchaseOrderItemRespType[],
  availableHeight: number,
  startIndex: number = 0,
  maxItems: number = items.length,
) => {
  // Standard row height for header row
  const headerRowHeight = 20

  // Calculate content-based height for actual items
  let totalContentHeight = headerRowHeight // Start with header row height
  let itemsProcessed = 0

  const endIndex = Math.min(startIndex + maxItems, items.length)

  for (let i = startIndex; i < endIndex; i++) {
    const item = items[i]
    const itemHeight = calculateRowHeight(item)
    if (totalContentHeight + itemHeight <= availableHeight) {
      totalContentHeight += itemHeight
      itemsProcessed++
    } else {
      break
    }
  }

  // Calculate remaining space for standard rows (18px height)
  const remainingSpace = availableHeight - totalContentHeight
  const additionalStandardRows = Math.floor(remainingSpace / COMPONENT_HEIGHTS.standardRowHeight)

  return itemsProcessed + additionalStandardRows
}

// Plan the optimal PDF layout based on content and available space
export const planPdfLayout = (
  items: PurchaseOrderItemRespType[],
  firstPageAvailableHeight: number,
  subsequentPageAvailableHeight: number,
  summaryHeight: number,
  tableFooterHeight: number,
  pageFooterHeight: number,
): PageLayoutPlan => {
  // If no items, return simple layout
  if (items.length === 0) {
    return {
      itemPages: [[]],
      summaryOnFirstPage: true,
      tableFooterOnFirstPage: true,
      pageFooterOnFirstPage: true,
      needsStandalonePageFooterPage: false,
      totalPages: 2, // One page for items + summary + footer, plus one for BCS page
    }
  }

  // Standard row height for header row
  const headerRowHeight = 20 // FIXME: move to pdfConfig

  // Calculate total height needed for all items
  let totalItemsHeight = headerRowHeight // Start with header row height

  // Calculate total height by iterating through items
  const itemHeights = items.map((item) => calculateRowHeight(item))
  for (const height of itemHeights) {
    totalItemsHeight += height
  }

  // Scenario 1: Everything fits on the first page
  if (
    totalItemsHeight +
      COMPONENT_HEIGHTS.remarkLine +
      COMPONENT_HEIGHTS.tableFooter +
      COMPONENT_HEIGHTS.signature <=
    firstPageAvailableHeight
  ) {
    return {
      itemPages: [items],
      summaryOnFirstPage: true,
      tableFooterOnFirstPage: true,
      pageFooterOnFirstPage: true,
      needsStandalonePageFooterPage: false,
      totalPages: 2, // One page for items + summary + footer, plus one for BCS page
    }
  }

  // Scenario 2 & 3: Items fit on first page, but not with summary and/or footer
  if (totalItemsHeight <= firstPageAvailableHeight) {
    // Always ensure at least one item is on the page with the summary
    const remainingSpaceAfterItems = firstPageAvailableHeight - totalItemsHeight

    // Check if summary and table footer fit with items on first page
    const summaryAndTableFooterFitWithItems =
      remainingSpaceAfterItems >= summaryHeight + tableFooterHeight

    if (!summaryAndTableFooterFitWithItems && items.length > 1) {
      // Move the last item to a new page to keep summary and table footer with items
      const lastItem = items[items.length - 1]
      const itemsWithoutLast = items.slice(0, -1)

      return {
        itemPages: [itemsWithoutLast, [lastItem]],
        summaryOnFirstPage: false,
        tableFooterOnFirstPage: false, // Table footer goes to second page with the last item
        pageFooterOnFirstPage: false, // Page footer also goes to the second page
        needsStandalonePageFooterPage: false,
        totalPages: 3, // Two item pages + BCS page
      }
    }

    // Check if page footer fits with items, summary, and table footer
    const pageFooterFitsWithItemsAndSummary =
      remainingSpaceAfterItems >= tableFooterHeight + pageFooterHeight

    if (pageFooterFitsWithItemsAndSummary) {
      // Everything fits on first page
      return {
        itemPages: [items],
        summaryOnFirstPage: true,
        tableFooterOnFirstPage: true,
        pageFooterOnFirstPage: true,
        needsStandalonePageFooterPage: false,
        totalPages: 2, // One page for items + summary + footer, plus one for BCS page
      }
    } else {
      // Items + summary + table footer fit, but page footer needs its own page
      return {
        itemPages: [items],
        summaryOnFirstPage: true,
        tableFooterOnFirstPage: true,
        pageFooterOnFirstPage: false,
        needsStandalonePageFooterPage: true,
        totalPages: 3, // One page for items + summary + table footer, one for page footer, plus one for BCS page
      }
    }
  }

  // Scenario 4 & 5: Items span multiple pages
  // First, distribute items across pages based only on their heights
  const itemDistribution = distributeItemsAcrossPages(
    items,
    itemHeights,
    firstPageAvailableHeight,
    subsequentPageAvailableHeight,
  )

  // Check if the last page has enough space for summary, table footer, and page footer
  const lastPageItems = itemDistribution[itemDistribution.length - 1]
  let lastPageItemsHeight = headerRowHeight // Start with header row height

  lastPageItems.forEach((item) => {
    const itemIndex = items.findIndex((i) => i === item)
    lastPageItemsHeight += itemHeights[itemIndex]
  })

  const remainingSpaceOnLastPage = subsequentPageAvailableHeight - lastPageItemsHeight

  const everythingFitsOnLastPage =
    remainingSpaceOnLastPage >= summaryHeight + tableFooterHeight + pageFooterHeight

  return {
    itemPages: itemDistribution,
    summaryOnFirstPage: false,
    tableFooterOnFirstPage: false,
    pageFooterOnFirstPage: false,
    needsStandalonePageFooterPage: !everythingFitsOnLastPage,
    totalPages: itemDistribution.length + (everythingFitsOnLastPage ? 0 : 1) + 1, // Item pages + page footer page (if needed) + BCS page
  }
}

// Helper function to distribute items based on height constraints
export const distributeItemsAcrossPages = (
  items: PurchaseOrderItemRespType[],
  itemHeights: number[],
  firstPageAvailableHeight: number,
  subsequentPageAvailableHeight: number,
): PurchaseOrderItemRespType[][] => {
  if (items.length === 0) {
    return []
  }

  const pages: PurchaseOrderItemRespType[][] = [[]]
  let currentPage = 0
  let currentPageHeight = 0
  let availableHeight = firstPageAvailableHeight

  // Standard row height for header row
  const headerRowHeight = 20

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const itemHeight = itemHeights[i]

    // For the first item on each page, account for the header row
    if (i === 0 || (pages[currentPage].length === 0 && currentPage > 0)) {
      currentPageHeight += headerRowHeight
    }

    // Check if this item would exceed the available height for the current page
    if (currentPageHeight + itemHeight > availableHeight) {
      // Start a new page
      pages.push([])
      currentPage++
      currentPageHeight = headerRowHeight // Start with header row height
      availableHeight = subsequentPageAvailableHeight
    }

    // Add the item to the current page
    pages[currentPage].push(item)
    currentPageHeight += itemHeight
  }

  return pages
}

// Calculate the total number of pages (including additional pages)
export const calculateTotalPages = (
  itemPages: PurchaseOrderItemRespType[][],
  additionalPages: number = 0,
): number => {
  return itemPages.length + additionalPages
}

// Get continuous item index across pages
export const getContinuousItemIndex = (
  pageIndex: number,
  itemIndex: number,
  itemPages: PurchaseOrderItemRespType[][],
): number => {
  let continuousIndex = itemIndex

  // Add counts from previous pages
  for (let i = 0; i < pageIndex; i++) {
    continuousIndex += itemPages[i].length
  }

  return continuousIndex + 1 // Add 1 for 1-based indexing
}
