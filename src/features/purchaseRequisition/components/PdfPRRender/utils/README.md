# PDF Rendering Utilities

This directory contains utility files for PDF rendering in the Purchase Requisition module. These files work together to provide a content-aware, dynamic pagination system for PDF generation.

## File Structure

### `pdfConfig.ts`
Contains all configuration constants used throughout the PDF rendering system, including:
- Page dimensions and margins
- Component heights
- Text configuration (font sizes, line heights)
- Table dimensions
- Column widths

### `pdfMeasurementUtils.ts`
Provides utilities for measuring text and calculating row heights:
- Character-width-aware text height estimation
- Functions to calculate maximum rows for different page types
- Content-aware row height calculations

### `pdfPaginationUtils.ts`
Handles the pagination logic:
- Distributes items across pages based on available height
- Ensures summary sections stay with their corresponding items
- Calculates total pages needed for the document

### `pdfLayoutCalculator.ts`
Centralizes layout calculations:
- Uses the measurement and pagination utilities
- Calculates available heights for different page types
- Plans the optimal PDF layout

### `pdfCurrencyUtils.ts`
Handles currency-related formatting:
- Gets full currency names from currency codes
- Converts amounts to words with appropriate currency names

### `pdfStyles.ts`
Centralizes all PDF styling:
- Creates consistent styles for all PDF components
- Uses configuration from `pdfConfig.ts`

## Key Features

1. **Content-Aware Text Height Estimation**
   - Categorizes characters into width groups (wide, normal, narrow)
   - Accurately estimates text wrapping and height requirements

2. **Dynamic Pagination**
   - Calculates how many items can fit on each page based on content
   - Ensures summary sections stay with their corresponding items
   - Properly distributes items across multiple pages

3. **Flexible Layout Planning**
   - Supports different page types (first page, subsequent pages, etc.)
   - Handles signature placement and summary sections

## Usage

The main component (`index.tsx`) uses these utilities to generate a multi-page PDF document with proper pagination. The process follows these steps:

1. Generate text for grand total in words using `pdfCurrencyUtils.ts`
2. Calculate the optimal layout using `pdfLayoutCalculator.ts`
3. Render pages based on the calculated layout

This approach ensures accurate pagination throughout the entire document, especially for content with variable-length descriptions like Thai text.
