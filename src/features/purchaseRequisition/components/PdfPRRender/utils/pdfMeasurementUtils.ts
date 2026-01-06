import { PrItemTypeWOKey } from 'api/prApi.types'

import { calculateMaxRowsFromItems } from './pdfPaginationUtils'

// A4 page dimensions in points (72 points per inch)
export const A4_WIDTH = 595.28 // ~8.27 inches
export const A4_HEIGHT = 841.89 // ~11.69 inches

// Default page margins
export const PAGE_MARGINS = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
}

// Table dimensions for backward compatibility
export const TABLE_DIMENSIONS = {
  headerHeight: 20,
  rowBaseHeight: 15,
  cellPadding: 5,
}

// Calculate available page width (accounting for margins)
export const calculateAvailableWidth = (margins = PAGE_MARGINS) => {
  return A4_WIDTH - margins.left - margins.right
}

// Calculate available page height (accounting for margins)
export const calculateAvailableHeight = (margins = PAGE_MARGINS) => {
  return A4_HEIGHT - margins.top - margins.bottom
}

// Calculate available height for items on the first page
export const calculateFirstPageAvailableHeight = (
  headerHeight: number,
  detailsHeight: number,
  footerHeight: number,
) => {
  const availableHeight = calculateAvailableHeight()
  return availableHeight - headerHeight - detailsHeight - footerHeight
}

// Calculate available height for items on subsequent pages
export const calculateSubsequentPageAvailableHeight = (
  headerHeight: number,
  footerHeight: number,
) => {
  const availableHeight = calculateAvailableHeight()
  return availableHeight - headerHeight - footerHeight
}

// Estimate the height of text based on its content with character width categories
export const estimateTextHeight = (
  text: string,
  fontSize: number,
  lineHeight: number,
  widthUnitsPerLine: number = 46,
) => {
  // If text is empty, return minimum height
  if (!text || text.trim() === '') {
    return fontSize * lineHeight
  }

  // Character width categories
  const wideChars = 'mwWM@QOGN%&ACDFGJKLTMNOPQRUVWXYZ023456789'
  const narrowChars = "ijl!|.,:;'`()-[]{}t1r"

  // Split text into words
  const words = text.split(' ')
  let lines = 1
  let currentLineWidthUnits = 0

  // Process each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    // Calculate width units for this word
    let wordWidthUnits = 0
    for (let j = 0; j < word.length; j++) {
      const char = word[j]
      if (wideChars.includes(char)) {
        wordWidthUnits += 1.4 // Wide character
      } else if (narrowChars.includes(char)) {
        wordWidthUnits += 0.7 // Narrow character
      } else {
        wordWidthUnits += 1.0 // Normal character
      }
    }

    // Add space width if not at the beginning of a line
    const spaceWidth = currentLineWidthUnits > 0 ? 0.4 : 0

    // If adding this word would exceed the line width limit
    if (currentLineWidthUnits + wordWidthUnits + spaceWidth > widthUnitsPerLine) {
      // Start a new line
      lines++
      currentLineWidthUnits = wordWidthUnits
    } else {
      // Add word to current line (plus space if not the first word on the line)
      currentLineWidthUnits += wordWidthUnits + spaceWidth
    }

    // Handle very long words that exceed the line limit on their own
    if (wordWidthUnits > widthUnitsPerLine) {
      // Add extra lines for the overflow
      const extraLines = Math.floor(wordWidthUnits / widthUnitsPerLine)
      lines += extraLines
    }
  }

  const height = fontSize * lineHeight * lines
  return height
}

// Calculate maximum rows that can fit on the first page (with header, details, and signature)
export const calculateMaxRowsForFirstPage = (
  rowHeight: number,
  headerHeight: number,
  detailsHeight: number,
  signatureHeight: number,
  footerHeight: number,
  safetyMargin: number = 5,
) => {
  const availableHeight = calculateAvailableHeight()
  const availableRowSpace =
    availableHeight - headerHeight - detailsHeight - signatureHeight - footerHeight - safetyMargin
  return Math.floor(availableRowSpace / rowHeight)
}

// Calculate maximum rows that can fit on a subsequent page with signature section
export const calculateMaxRowsForSubsequentPageWithSignature = (
  rowHeight: number,
  headerHeight: number,
  signatureHeight: number,
  footerHeight: number,
  safetyMargin: number = 5,
) => {
  const availableHeight = calculateAvailableHeight()
  const availableRowSpace =
    availableHeight - headerHeight - signatureHeight - footerHeight - safetyMargin
  return Math.floor(availableRowSpace / rowHeight)
}

// Calculate maximum rows that can fit on a full page (no signature section)
export const calculateMaxRowsForFullPage = (
  rowHeight: number,
  headerHeight: number,
  footerHeight: number,
  safetyMargin: number = 5,
) => {
  const availableHeight = calculateAvailableHeight()
  const availableRowSpace = availableHeight - headerHeight - footerHeight - safetyMargin
  return Math.floor(availableRowSpace / rowHeight)
}

// Get standard row height for items table
export const getStandardRowHeight = () => {
  return 18 // Standard row height in points
}

// Calculate the average row height for a set of items
export const calculateAverageRowHeight = (items: PrItemTypeWOKey[]) => {
  if (items.length === 0) {
    return getStandardRowHeight()
  }

  const totalHeight = items.reduce((sum, item) => sum + calculateRowHeight(item), 0)
  return totalHeight / items.length
}

// Create a utility function to get max rows for different page types
export const getMaxRowsForPageType = (
  pageType: 'firstWithSignature' | 'subsequentWithSignature' | 'fullPage',
  headerHeight: number,
  detailsHeight: number,
  signatureHeight: number,
  footerHeight: number,
  items?: PrItemTypeWOKey[],
  startIndex: number = 0,
) => {
  // If no items are provided, use the standard approach with average row height
  if (!items || items.length === 0) {
    const rowHeight = getStandardRowHeight()

    switch (pageType) {
      case 'firstWithSignature':
        return calculateMaxRowsForFirstPage(
          rowHeight,
          headerHeight,
          detailsHeight,
          signatureHeight,
          footerHeight,
        )
      case 'subsequentWithSignature':
        return calculateMaxRowsForSubsequentPageWithSignature(
          rowHeight,
          headerHeight,
          signatureHeight,
          footerHeight,
        )
      case 'fullPage':
        return calculateMaxRowsForFullPage(rowHeight, headerHeight, footerHeight)
      default:
        return 20 // Default fallback value
    }
  }

  // For content-aware calculation, determine available height based on page type
  let availableHeight = 0
  const safetyMargin = 5

  switch (pageType) {
    case 'firstWithSignature':
      availableHeight =
        calculateAvailableHeight() -
        headerHeight -
        detailsHeight -
        signatureHeight -
        footerHeight -
        safetyMargin
      break
    case 'subsequentWithSignature':
      availableHeight =
        calculateAvailableHeight() - headerHeight - signatureHeight - footerHeight - safetyMargin
      break
    case 'fullPage':
      availableHeight = calculateAvailableHeight() - headerHeight - footerHeight - safetyMargin
      break
    default:
      return 20 // Default fallback value
  }

  // Use the optimized function to calculate max rows based on actual content heights
  return calculateMaxRowsFromItems(items, availableHeight, startIndex, items.length - startIndex)
}

// Define column widths object for consistent use
export const COLUMN_WIDTHS = {
  number: 34,
  description: 193,
  quantity: 39,
  unit: 58,
  unitPrice: 77,
  amount: 77,
  total: 77,
}

// Calculate the height of a table row based on its content
export const calculateRowHeight = (item: PrItemTypeWOKey) => {
  // FIXME: row height has to consider all the content in every column for example number might be 2 lines
  // Format description
  const description = formatDescription(item)

  // Calculate description height based on text length and column width
  const descriptionHeight = estimateTextHeight(
    description,
    9, // font size
    1.52, // line height
  )
  // Return the maximum of description height or base row height
  return Math.max(descriptionHeight, 18)
}

// Helper function to format description
export const formatDescription = (item: PrItemTypeWOKey) => {
  const parts = [item.name]

  if (item.brand) {
    parts.push(`Brand ${item.brand}`)
  }

  if (item.model) {
    parts.push(`Model ${item.model}`)
  }

  if (item.detail) {
    parts.push(item.detail)
  }

  return parts.join(', ')
}
