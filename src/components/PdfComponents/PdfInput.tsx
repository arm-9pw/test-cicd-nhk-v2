import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

import { clrWhite700 } from 'styles/theme'

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  formlabel: {
    fontWeight: 800,
    // textTransform: 'uppercase',
    fontSize: '8px',
  },
  formValue: {
    flexGrow: 1,
    backgroundColor: clrWhite700,
    padding: '2px 5px',
    borderRadius: '2px',
    minHeight: '20px',
  },
})

type PdfInputProps = {
  label: string
  value?: string | React.ReactNode
  customStyles?: object
  minHeight?: string
  isShowBudgetYear?: boolean
}

const PdfInput = ({
  label,
  value = '',
  customStyles,
  minHeight,
  isShowBudgetYear = false,
}: PdfInputProps) => {
  return (
    <View style={[styles.flexRow, { ...customStyles }]}>
      <Text style={[styles.formlabel]}>{label}</Text>
      <View style={[styles.formValue, styles.flexRow, { minHeight }]}>
        <Text>{value}</Text>
        {isShowBudgetYear && (
          <Text style={{ paddingLeft: '5px' }}>
            <Text style={{ fontWeight: 'bold', fontSize: '8px' }}>
              BUDGET YEAR
            </Text>{' '}
            2024
          </Text>
        )}
      </View>
    </View>
  )
}

export default PdfInput
