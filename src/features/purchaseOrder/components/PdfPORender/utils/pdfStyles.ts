import { StyleSheet } from '@react-pdf/renderer'

import { clrBlack200, clrPdfBlue, clrWhite, clrWhite700 } from 'styles/theme'

import { TEXT_CONFIG } from './pdfConfig'

// Create and export the styles for PDF rendering
export const createPdfStyles = () =>
  StyleSheet.create({
    page: {
      fontFamily: 'Sarabun',
      fontSize: 10,
      padding: '20px 20px 40px 20px',
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      width: '100%',
    },
    textXS: {
      fontSize: TEXT_CONFIG.fontSize.xs,
    },
    textSM: {
      fontSize: TEXT_CONFIG.fontSize.sm,
    },
    textMD: {
      fontSize: TEXT_CONFIG.fontSize.md,
    },
    textLG: {
      fontSize: TEXT_CONFIG.fontSize.lg,
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    sectionBox: {
      padding: 10,
      margin: '5px 20px 0px 20px',
      border: ` 1 solid ${clrBlack200}`,
      borderRadius: 5,
    },
    pageMargin: {
      margin: '5px 20px 0px 20px',
    },
    tableCell: {
      fontSize: 7,
      fontWeight: 800,
      padding: 5,
      border: `1 solid ${clrBlack200}`,
      marginLeft: -1,
      textAlign: 'center',
    },
    tableContentCell: {
      borderLeft: `1 solid ${clrBlack200}`,
      borderRight: `1 solid ${clrBlack200}`,
      fontSize: 7,
      fontWeight: 800,
      padding: '3px 3px',
      marginLeft: -1,
      textAlign: 'center',
    },
    formValue: {
      flexGrow: 1,
      backgroundColor: clrWhite700,
      padding: '2px 5px',
      borderRadius: 2,
      minHeight: 15,
    },
    headerText: {
      width: '100%',
      backgroundColor: clrPdfBlue,
      borderRadius: '5px',
      padding: '2px 5px',
      color: clrWhite,
      textAlign: 'center',
      fontWeight: 800,
    },
  })
