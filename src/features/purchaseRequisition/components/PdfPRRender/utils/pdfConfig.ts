// PDF configuration constants for Purchase Requisition PDF rendering

// A4 page dimensions in points (72 points per inch)
export const A4_WIDTH = 595.28 // ~8.27 inches
export const A4_HEIGHT = 841.89 // ~11.69 inches
export const PAGE_HEIGHT = 842 // Used in index.tsx

// Default page margins
export const PAGE_MARGINS = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
}

// Component heights
export const COMPONENT_HEIGHTS = {
  // Header components
  header: 68, // Estimate height of PR header
  details: 115, // Estimate height of PR details
  pageHeader: 68 + 115, // Height of header on subsequent pages
  
  // Footer components
  footer: 0, // Estimate height of footer
  
  // Signature and summary components
  signature: 184, // Estimate height of signature section
  remarkLine: 15, // Height of remark line
  tableHeader: 20, // Height of table header
  
  // Standard heights
  standardRowHeight: 16, // Standard height for a row
}

// Text configuration
export const TEXT_CONFIG = {
  fontSize: {
    xs: 9,
    sm: 10,
    md: 12,
    lg: 14,
  },
  lineHeight: 1.52,
  widthUnitsPerLine: {
    standard: 46, // Standard width units per line for text
    summary: 74, // Width units per line for summary text
  },
}

// Table dimensions
export const TABLE_DIMENSIONS = {
  headerHeight: 20,
  rowBaseHeight: 15,
  cellPadding: 5,
}

// Margin adjustments used in calculations
export const MARGIN_ADJUSTMENTS = {
  firstPage: 80, // 40 is Margin top 20 and bottom 20
  subsequentPage: 100, // 40 is Margin top 20 and bottom 20
}

// Column widths for consistent use
export const COLUMN_WIDTHS = {
  number: 34,
  description: 193,
  quantity: 34,
  unit: 34,
  unitPrice: 68,
  discount: 68,
  total: 68,
}
