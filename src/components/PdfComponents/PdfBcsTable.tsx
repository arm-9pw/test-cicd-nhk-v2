import { StyleSheet, Styles, Text, View } from '@react-pdf/renderer'

import { clrBlack, clrBlack200, clrBlack300, clrErrorRed } from 'styles/theme'

import { BudgetControlSheetRespType } from 'api/poApi.types'

import { DOMAINS } from 'constants/index'
import { getFormattedCurrency } from 'utils/generalHelpers'

const _styles = StyleSheet.create({
  subBoxWrapper: {
    alignItems: 'stretch',
  },
  subBox: {
    border: `1 solid ${clrBlack300}`,
    padding: '1px',
    marginLeft: -1,
  },
  mainBox: {
    border: `1 solid ${clrBlack}`,
  },
  valueBox: {
    minWidth: '127px',
    flexGrow: 1,
  },
  title: {
    fontWeight: 800,
  },
})

type Props = {
  domain: 'PURCHASE_ORDER' | 'PURCHASE_REQUISITION'
  budgetTypeName: string | null
  budgets: BudgetControlSheetRespType[]
  styles: Styles
  bcsRemark: string | null
}

const PdfBcsTable = ({ domain, styles, budgets, budgetTypeName, bcsRemark }: Props) => {
  // Calculate fixed width for each budget column based on number of budgets
  // This ensures all budget columns have exactly the same width
  const staticColumnWidth = 299 - 40 - 21 - 10 - 5 - 10 // Width of the left static column in points
  const budgetColumnWidth = budgets.length > 0 ? (595 - staticColumnWidth) / budgets.length : 0
  const subColumnWidth = 189 - 10
  const secondSubColumnWidth = 90
  const mainColumnWidth = 35

  // Create a consistent style for all budget columns
  const budgetColumnStyle = {
    ...(_styles.subBox as object),
    width: budgetColumnWidth,
    minWidth: '80px', // Minimum width to ensure readability
  }

  return (
    <View style={[styles.textXS]}>
      <View
        style={[
          {
            backgroundColor: clrBlack200,
            padding: '1px',
            border: `1px solid ${clrBlack}`,
            marginTop: '5px',
            borderTopLeftRadius: '2px',
            borderTopRightRadius: '2px',
          },
        ]}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 800,
          }}
        >
          BUDGET CONTROL SHEET
        </Text>
      </View>
      {/* Budget Type */}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: '100%', marginLeft: 0 }]}>
          <View style={[styles.flexRow]}>
            <Text style={[_styles.title]}>BUDGET TYPE</Text>
            <Text style={{ fontWeight: 400 }}>{budgetTypeName || ' '}</Text>
          </View>
        </View>
      </View>

      {/* Budget Year */}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: staticColumnWidth, marginLeft: 0 }]}>
          <Text style={[_styles.title]}>BUDGET YEAR</Text>
        </View>

        {budgets.map((budget, index) => {
          return (
            <View key={index} style={budgetColumnStyle}>
              <Text style={{ marginLeft: 'auto' }}>
                {budget.budgetYear ? budget.budgetYear : ' '}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Budget Status */}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: staticColumnWidth, marginLeft: 0 }]}>
          <Text style={[_styles.title]}>BUDGET STATUS</Text>
        </View>

        {budgets.map((budget, index) => {
          return (
            <View key={index} style={budgetColumnStyle}>
              {budget.isOverBudget ? (
                <Text style={{ marginLeft: 'auto', color: clrErrorRed, fontWeight: 800 }}>
                  OVER BUDGET
                </Text>
              ) : (
                <Text style={{ marginLeft: 'auto' }}>ON BUDGET</Text>
              )}
            </View>
          )
        })}
      </View>

      {/* Cost Center */}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: staticColumnWidth, marginLeft: 0 }]}>
          <Text style={[_styles.title]}>COST CENTER</Text>
        </View>

        {budgets.map((budget, index) => {
          return (
            <View key={index} style={budgetColumnStyle}>
              <Text style={{ marginLeft: 'auto' }}>
                {budget.budgetSiteName ? budget.budgetSiteName : ' '}
              </Text>
            </View>
          )
        })}
      </View>

      {/*---- BEGIN: MAIN ----*/}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: mainColumnWidth, marginLeft: 0 }]}>
          <Text style={[_styles.title, { margin: 'auto' }]}>MAIN</Text>
        </View>

        <View style={{ flexGrow: 1 }}>
          <View style={[styles.flexRow, _styles.subBoxWrapper, { gap: 0 }]}>
            <View style={[_styles.subBox, { width: subColumnWidth }]}>
              <Text style={[_styles.title]}>BUDGET CODE</Text>
            </View>
            {budgets.map((budget, index) => {
              return (
                <View key={index} style={budgetColumnStyle}>
                  <Text style={{ marginLeft: 'auto' }}>{budget.mainBudgetCode || ' '}</Text>
                </View>
              )
            })}
          </View>

          <View style={[styles.flexRow, _styles.subBoxWrapper, { gap: 0 }]}>
            <View
              style={[
                _styles.subBox,
                _styles.title,
                styles.flexRow,
                {
                  width: subColumnWidth,
                  justifyContent: 'space-between',
                  marginTop: -1,
                },
              ]}
            >
              <Text>BUDGET AMOUNT</Text>
              <Text>(A)</Text>
            </View>
            {budgets.map((budget, index) => {
              return (
                <View
                  key={index}
                  style={[
                    budgetColumnStyle,
                    {
                      marginTop: -1,
                    },
                  ]}
                >
                  <Text style={{ marginLeft: 'auto' }}>
                    {getFormattedCurrency(budget.mainBudgetAmount) || ' '}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
      {/*---- END: MAIN ----*/}
      {/*---- BEGIN: SUB ----*/}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: mainColumnWidth, marginLeft: 0 }]}>
          <Text style={[_styles.title, { margin: 'auto' }]}>SUB</Text>
        </View>

        <View style={{ flexGrow: 1 }}>
          <View style={[styles.flexRow, _styles.subBoxWrapper, { gap: 0 }]}>
            <View style={[_styles.subBox, { width: subColumnWidth }]}>
              <Text style={[_styles.title]}>BUDGET CODE</Text>
            </View>
            {budgets.map((budget, index) => {
              return (
                <View key={index} style={budgetColumnStyle}>
                  <Text style={{ marginLeft: 'auto' }}>{budget.subBudgetCode || ' '}</Text>
                </View>
              )
            })}
          </View>

          <View style={[styles.flexRow, _styles.subBoxWrapper, { gap: 0 }]}>
            <View style={[_styles.subBox, { width: subColumnWidth, marginTop: -1 }]}>
              <Text style={[_styles.title]}>BUDGET AMOUNT</Text>
            </View>
            {budgets.map((budget, index) => {
              return (
                <View
                  key={index}
                  style={[
                    budgetColumnStyle,
                    {
                      marginTop: -1,
                    },
                  ]}
                >
                  <Text style={{ marginLeft: 'auto' }}>
                    {getFormattedCurrency(budget.subBudgetAmount) || ' '}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
      {/*---- END: SUB ----*/}
      {/*---- BEGIN: DOMAIN ----*/}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: mainColumnWidth, marginLeft: 0 }]}>
          <Text style={[_styles.title, { margin: 'auto' }]}>
            {domain === DOMAINS.PURCHASE_ORDER ? 'PO.' : 'PR.'}
          </Text>
        </View>

        <View style={{ flexGrow: 1 }}>
          <View style={[styles.flexRow, { gap: 0, alignItems: 'stretch' }]}>
            <View style={[_styles.subBox, { width: '90px' }]}>
              <Text style={[_styles.title, { margin: 'auto 0' }]}>WAITING FOR PO.</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <View style={[styles.flexRow, _styles.subBoxWrapper, { gap: 0 }]}>
                <View
                  style={[
                    styles.flexRow,
                    _styles.subBox,
                    _styles.title,
                    { justifyContent: 'space-between', width: secondSubColumnWidth },
                  ]}
                >
                  <Text>PR. PENDING</Text>
                  <Text>(B)</Text>
                </View>
                {budgets.map((budget, index) => {
                  return (
                    <View key={index} style={budgetColumnStyle}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 10,
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text>({budget.numOfPendingAmount || '0'})</Text>
                        <Text style={{ marginLeft: 'auto' }}>
                          {getFormattedCurrency(budget.pendingAmount) ||  '0.00 ฿'}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
              <View style={[styles.flexRow, _styles.subBoxWrapper, { gap: 0, marginTop: -1 }]}>
                <View
                  style={[
                    styles.flexRow,
                    _styles.subBox,
                    _styles.title,
                    { justifyContent: 'space-between', width: secondSubColumnWidth },
                  ]}
                >
                  <Text>PR. APPROVE</Text>
                  <Text>(C)</Text>
                </View>
                {budgets.map((budget, index) => {
                  return (
                    <View key={index} style={budgetColumnStyle}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 10,
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text>({budget.numOfApproveAmount || '0'})</Text>
                        <Text style={{ marginLeft: 'auto' }}>
                          {getFormattedCurrency(budget.approveAmount) || '0.00 ฿'}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
          <View style={[styles.flexRow, { gap: 0 }]}>
            <View
              style={[
                styles.flexRow,
                _styles.subBox,
                _styles.title,
                {
                  justifyContent: 'space-between',
                  width: subColumnWidth,
                  marginTop: -1,
                },
              ]}
            >
              <Text>AMOUNT OF "THIS ORDER"</Text>
              <Text>(D)</Text>
            </View>
            {budgets.map((budget, index) => {
              return (
                <View key={index} style={[budgetColumnStyle, { marginTop: -1 }]}>
                  <Text style={{ marginLeft: 'auto' }}>
                    {getFormattedCurrency(budget.thisOrderAmount) || '0.00 ฿'}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
      {/*---- END: DOMAIN ----*/}
      {/*---- BEGIN: LATEST ----*/}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: staticColumnWidth, marginLeft: 0 }]}>
          <View style={[styles.flexRow, _styles.title, { justifyContent: 'space-between' }]}>
            <Text>LATEST ACCUMULATE PO. ISSUE</Text>
            <Text>(E)</Text>
          </View>
        </View>
        {budgets.map((budget, index) => {
          return (
            <View key={index} style={budgetColumnStyle}>
              <Text style={{ marginLeft: 'auto' }}>
                {getFormattedCurrency(budget.purchaseOrderAmount) || '0.00 ฿'}
              </Text>
            </View>
          )
        })}
      </View>
      {/*---- END: LATEST ----*/}
      {/*---- BEGIN: BUDGET ----*/}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: staticColumnWidth, marginLeft: 0 }]}>
          <View style={[styles.flexRow, _styles.title, { justifyContent: 'space-between' }]}>
            <Text>BUDGET REMAIN</Text>
            <Text>F=A-(B+C+D+E)</Text>
          </View>
        </View>
        {budgets.map((budget, index) => {
          return (
            <View key={index} style={budgetColumnStyle}>
              <Text style={{ marginLeft: 'auto' }}>
                {getFormattedCurrency(budget.budgetRemain) || '0.00 ฿'}
              </Text>
            </View>
          )
        })}
      </View>
      {/*---- ENG: BUDGET ----*/}

      {/* Remark */}
      <View
        style={[_styles.mainBox, styles.flexRow, { gap: 0, alignItems: 'stretch', marginTop: -1 }]}
      >
        <View style={[_styles.subBox, { width: staticColumnWidth, marginLeft: 0 }]}>
          <Text style={[_styles.title]}>REMARK</Text>
        </View>

        <View style={[_styles.subBox, { width: budgetColumnWidth * budgets.length }]}>
          <Text>{bcsRemark || ' '}</Text>
        </View>
      </View>
    </View>
  )
}

export default PdfBcsTable
