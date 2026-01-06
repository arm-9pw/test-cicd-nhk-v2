import { PurchaseOrderItemRespType } from 'api/poApi.types'

import { COMPONENT_HEIGHTS, TEXT_CONFIG } from './pdfConfig'

// Calculate available page width (accounting for margins)
export const calculateAvailableWidth = (margins = { left: 20, right: 20 }) => {
  return 595.28 - margins.left - margins.right // A4_WIDTH - margins
}

// Calculate available page height (accounting for margins)
export const calculateAvailableHeight = (margins = { top: 20, bottom: 20 }) => {
  return 841.89 - margins.top - margins.bottom // A4_HEIGHT - margins
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
  return height + 3
}

// Calculate the height of a row based on its content
export const calculateRowHeight = (item: PurchaseOrderItemRespType) => {
  // Get the description text
  const description = formatDescription(item)

  // Calculate the height of the description text
  const descriptionHeight = estimateTextHeight(
    description,
    TEXT_CONFIG.fontSize.xs,
    TEXT_CONFIG.lineHeight,
    TEXT_CONFIG.widthUnitsPerLine.standard,
  )

  // Return the maximum of the description height and the standard row height
  return Math.max(descriptionHeight, COMPONENT_HEIGHTS.standardRowHeight)
}

// Format description by concatenating name, brand, and model
export const formatDescription = (item: PurchaseOrderItemRespType) => {
  const parts = [item.name]

  if (item.brand) {
    parts.push(`Brand ${item.brand}`)
  }

  if (item.model) {
    parts.push(`Model ${item.model}`)
  }

  return parts.join(', ')
}
