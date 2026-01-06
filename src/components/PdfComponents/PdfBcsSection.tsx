import { Styles, Text, View } from '@react-pdf/renderer'

import { clrPrimary, clrWhite } from 'styles/theme'

import { BudgetControlSheetRespType } from 'api/poApi.types'

import PdfBcsTable from './PdfBcsTable'

type Props = {
  domain: 'PURCHASE_ORDER' | 'PURCHASE_REQUISITION'
  budgetTypeName: string | null
  budgets: BudgetControlSheetRespType[]
  styles: Styles
  bcsRemark: string | null
}

/**
 * Splits an array into chunks of specified size
 * @param array The array to split
 * @param chunkSize Maximum size of each chunk
 * @returns Array of chunks
 */
const splitArrayIntoChunks = <T,>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = []

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }

  return chunks
}

const PdfBcsSection = ({ domain, styles, budgets, budgetTypeName, bcsRemark }: Props) => {
  // Split budgets into chunks of maximum 3 budgets per table
  const budgetChunks = splitArrayIntoChunks(budgets, 3)

  return (
    <View style={{ marginTop: '10px' }}>
      <View
        style={[
          styles.textMD,
          { backgroundColor: clrPrimary, borderRadius: '2px', padding: '2px 5px' },
        ]}
      >
        <Text style={{ textAlign: 'center', color: clrWhite, fontWeight: 800 }}>
          BUDGET CONTROL SHEET/เอกสารควบคุมงบประมาณ
        </Text>
      </View>

      {budgetChunks.map((budgetChunk, index) => (
        <View key={index}>
          <PdfBcsTable
            domain={domain}
            styles={styles}
            budgets={budgetChunk}
            budgetTypeName={budgetTypeName}
            bcsRemark={index === budgetChunks.length - 1 ? bcsRemark : null}
          />
        </View>
      ))}
    </View>
  )
}

export default PdfBcsSection
