import { PrItemTypeWOKey } from 'api/prApi.types'

import { calculateRowHeight } from './pdfMeasurementUtils'

// Define interface for page layout plan
export interface PageLayoutPlan {
  itemPages: PrItemTypeWOKey[][]
  signatureOnFirstPage: boolean
  summaryOnFirstPage: boolean
  needsStandaloneSignaturePage: boolean
  totalPages: number
}

// Calculate maximum rows that can fit in available space based on actual content heights
export const calculateMaxRowsFromItems = (
  items: PrItemTypeWOKey[],
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
  const additionalStandardRows = Math.floor(remainingSpace / 18)

  return itemsProcessed + additionalStandardRows
}

// Plan the optimal PDF layout based on content and available space
export const planPdfLayout = (
  items: PrItemTypeWOKey[],
  firstPageAvailableHeight: number,
  subsequentPageAvailableHeight: number,
  summaryHeight: number,
  signatureHeight: number,
): PageLayoutPlan => {
  // If no items, return simple layout
  if (items.length === 0) {
    return {
      itemPages: [[]],
      signatureOnFirstPage: true,
      summaryOnFirstPage: true,
      needsStandaloneSignaturePage: false,
      totalPages: 2, // One page for items + summary + signature, plus one for BCS page
    }
  }

  // Standard row height for header row
  const headerRowHeight = 20

  // Calculate total height needed for all items
  let totalItemsHeight = headerRowHeight // Start with header row height

  // Calculate total height by iterating through items
  for (const item of items) {
    totalItemsHeight += calculateRowHeight(item)
  }

  // Scenario 1: Everything fits on the first page
  if (totalItemsHeight + summaryHeight + signatureHeight <= firstPageAvailableHeight) {
    return {
      itemPages: [items],
      signatureOnFirstPage: true,
      summaryOnFirstPage: true,
      needsStandaloneSignaturePage: false,
      totalPages: 2, // One page for items + summary + signature, plus one for BCS page
    }
  }

  // Distribute items across pages without reserving space for signature yet
  const itemDistribution = distributeItemsBasedOnHeight(
    items,
    firstPageAvailableHeight,
    subsequentPageAvailableHeight,
  )

  // Scenario 2 & 3: Items fit on first page, but not with summary and/or signature
  if (itemDistribution.length === 1) {
    // Always ensure at least one item is on the page with the summary
    const remainingSpaceAfterItems = firstPageAvailableHeight - totalItemsHeight

    // Check if summary fits with items on first page
    const summaryFitsWithItems = remainingSpaceAfterItems >= summaryHeight

    if (!summaryFitsWithItems && items.length > 1) {
      // Simply move the last item to a new page
      const lastItem = items[items.length - 1]
      const itemsWithoutLast = items.slice(0, -1)

      return {
        itemPages: [itemsWithoutLast, [lastItem]],
        signatureOnFirstPage: false,
        summaryOnFirstPage: false, // Summary goes to second page with the last item
        needsStandaloneSignaturePage: false, // Signature also goes to the second page
        totalPages: itemDistribution.length + 1 + 1, // Item pages + BCS page
      }
    }

    // At this point, either summary fits with all items on first page,
    // or we have only one item so we keep it with the summary

    // Check if signature also fits
    const signatureFitsWithItemsAndSummary =
      remainingSpaceAfterItems >= summaryHeight + signatureHeight

    if (signatureFitsWithItemsAndSummary) {
      // Everything fits on first page
      return {
        itemPages: [items],
        signatureOnFirstPage: true,
        summaryOnFirstPage: true,
        needsStandaloneSignaturePage: false,
        totalPages: 1 + 1, // One page for items + summary + signature, plus one for BCS page
      }
    } else {
      // Items + summary fit, but signature needs its own page
      return {
        itemPages: [items],
        signatureOnFirstPage: false,
        summaryOnFirstPage: true,
        needsStandaloneSignaturePage: true,
        totalPages: itemDistribution.length + 1 + 1, // Item pages + signature page + BCS page
      }
    }
  }

  // Scenario 4 & 5: Items span multiple pages
  // Check if the last page has enough space for summary and signature
  const lastPageItems = itemDistribution[itemDistribution.length - 1]
  let lastPageItemsHeight = headerRowHeight // Start with header row height

  lastPageItems.forEach((item) => {
    lastPageItemsHeight += calculateRowHeight(item)
  })

  const remainingSpaceOnLastPage = subsequentPageAvailableHeight - lastPageItemsHeight
  const summaryAndSignatureFitOnLastPage =
    remainingSpaceOnLastPage >= summaryHeight + signatureHeight

  return {
    itemPages: itemDistribution,
    signatureOnFirstPage: false,
    summaryOnFirstPage: false,
    needsStandaloneSignaturePage: !summaryAndSignatureFitOnLastPage,
    totalPages: itemDistribution.length + (summaryAndSignatureFitOnLastPage ? 0 : 1) + 1, // Item pages + signature page (if needed) + BCS page
  }
}

// Helper function to distribute items based on height constraints
export const distributeItemsBasedOnHeight = (
  items: PrItemTypeWOKey[],
  firstPageAvailableHeight: number,
  subsequentPageAvailableHeight: number,
): PrItemTypeWOKey[][] => {
  // If no items, return empty array
  if (items.length === 0) {
    return [[]]
  }

  const pages: PrItemTypeWOKey[][] = []
  let currentPage: PrItemTypeWOKey[] = []
  let currentPageHeight = 0
  let currentPageAvailableHeight = firstPageAvailableHeight

  // Standard row height for header row
  const headerRowHeight = 20

  // Process each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    // Calculate the height of this item's row based on its content
    const itemRowHeight = calculateRowHeight(item)

    // For the first item on the first page, account for the header row
    if (i === 0 || (currentPage.length === 0 && pages.length > 0)) {
      currentPageHeight += headerRowHeight
    }

    // Check if adding this item would exceed the available height
    if (currentPageHeight + itemRowHeight > currentPageAvailableHeight) {
      // This item won't fit on the current page
      // Save the current page and start a new one
      if (currentPage.length > 0) {
        pages.push([...currentPage])
        currentPage = [item]
        currentPageHeight = headerRowHeight + itemRowHeight // Reset with header row + this item
        currentPageAvailableHeight = subsequentPageAvailableHeight // Use subsequent page height
      } else {
        // Edge case: item is too big for even an empty page
        // We'll put it on its own page anyway
        pages.push([item])
        currentPage = []
        currentPageHeight = 0
        currentPageAvailableHeight = subsequentPageAvailableHeight
      }
    } else {
      // This item fits on the current page
      currentPage.push(item)
      currentPageHeight += itemRowHeight
    }
  }

  // Add the last page if it has any items
  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

// Calculate how many items can fit on each page and distribute them accordingly
export const distributeItemsAcrossPages = (
  items: PrItemTypeWOKey[],
  firstPageAvailableHeight: number,
  subsequentPageAvailableHeight: number,
  summaryHeight: number,
): PrItemTypeWOKey[][] => {
  // If no items, return empty array
  if (items.length === 0) {
    return [[]]
  }

  const pages: PrItemTypeWOKey[][] = []
  let currentPage: PrItemTypeWOKey[] = []
  let currentPageHeight = 0
  let currentPageAvailableHeight = firstPageAvailableHeight

  // Standard row height for header row
  const headerRowHeight = 20

  // Process each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    // Calculate the height of this item's row based on its content
    const itemRowHeight = calculateRowHeight(item)

    // For the first item on the first page, account for the header row
    if (i === 0 || currentPage.length === 0) {
      currentPageHeight += headerRowHeight
    }

    // Always check if the current page plus this item plus the summary would fit
    // This ensures the summary always stays with its items
    const remainingItems = items.length - i
    const isLastItemOnPage =
      remainingItems === 1 ||
      currentPageHeight + itemRowHeight + summaryHeight > currentPageAvailableHeight

    // If this is potentially the last item on the page, check if it fits with summary
    if (isLastItemOnPage) {
      // If adding this item plus summary exceeds available height and we already have items on the page
      if (
        currentPageHeight + itemRowHeight + summaryHeight > currentPageAvailableHeight &&
        currentPage.length > 0
      ) {
        // Move this item to the next page to keep summary with items
        pages.push([...currentPage])
        currentPage = [item]
        currentPageHeight = headerRowHeight + itemRowHeight // Reset with header row + this item
        currentPageAvailableHeight = subsequentPageAvailableHeight // Use subsequent page height
      } else {
        // This item fits on the current page with the summary
        currentPage.push(item)
        currentPageHeight += itemRowHeight
      }
    } else {
      // Not the last item, check if it fits normally
      if (currentPageHeight + itemRowHeight > currentPageAvailableHeight) {
        // This item won't fit on the current page
        // Save the current page and start a new one
        if (currentPage.length > 0) {
          pages.push([...currentPage])
          currentPage = [item]
          currentPageHeight = headerRowHeight + itemRowHeight // Reset with header row + this item
          currentPageAvailableHeight = subsequentPageAvailableHeight // Use subsequent page height
        } else {
          // Edge case: item is too big for even an empty page
          // We'll put it on its own page anyway
          currentPage.push(item)
          currentPageHeight += itemRowHeight
        }
      } else {
        // This item fits on the current page
        currentPage.push(item)
        currentPageHeight += itemRowHeight
      }
    }
  }

  // Add the last page if it has any items
  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

// Calculate the total number of pages (including additional pages)
export const calculateTotalPages = (
  itemPages: PrItemTypeWOKey[][],
  additionalPages: number = 0,
): number => {
  return itemPages.length + additionalPages
}

// Calculate the maximum number of rows that can fit on a page based on content
export const calculateMaxRowsBasedOnContent = (
  items: PrItemTypeWOKey[],
  availableHeight: number,
  includeSummary: boolean = false,
  summaryHeight: number = 0,
): number => {
  // Standard row height for header row
  const headerRowHeight = 20

  let totalHeight = headerRowHeight // Start with header row
  let maxRows = 0

  // Add items until we exceed available height
  for (let i = 0; i < items.length; i++) {
    const itemRowHeight = calculateRowHeight(items[i])

    // Check if adding this item (and summary if it's the last one) would exceed available height
    const additionalHeightIfLast = includeSummary && i === items.length - 1 ? summaryHeight : 0

    if (totalHeight + itemRowHeight + additionalHeightIfLast <= availableHeight) {
      totalHeight += itemRowHeight
      maxRows++
    } else {
      break
    }
  }

  return maxRows
}

// Get continuous item index across pages
export const getContinuousItemIndex = (
  pageIndex: number,
  itemIndex: number,
  itemPages: PrItemTypeWOKey[][],
): number => {
  let continuousIndex = itemIndex

  // Add counts from previous pages
  for (let i = 0; i < pageIndex; i++) {
    continuousIndex += itemPages[i].length
  }

  return continuousIndex + 1 // Add 1 for 1-based indexing
}
