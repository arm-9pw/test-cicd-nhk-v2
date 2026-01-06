// import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// import { TBudgetSummary } from 'api/prApi.types'

// interface PurchaseRequisitionItem {
//   key: string
//   budgetCode: string
//   name: string
//   model: string
//   brand: string
//   detail: string
//   qty: number
//   unit: string
//   unitPrice: number
//   unitDiscount: number
//   netTotal: number
// }

// interface FileItem {
//   key: string
//   fileName: string
//   size: string
//   file: {
//     uid: string
//   }
// }

// export type TPurchaseRequisitionState = {
//   budgets: TBudgetSummary[]
//   grandTotal: number
//   projectName: string
//   mainGroup: {
//     label: string
//     value: number
//     key: number
//   }
//   requiredDate: string
//   budgetType: {
//     label: string
//     value: number
//     key: number
//   }
//   budgetCode: string
//   line: string
//   purpose: string
//   currency: {
//     label: string
//     value: number
//     key: number
//   }
//   exchangeRateSource: number
//   exchangeRateDestination: number
//   exchangeRate: string
//   quotationNo: string
//   quotationDate: string
//   supplier: string
//   upload?: unknown
//   purchaseInchargeSection: {
//     label: string
//     value: number
//     key: number
//   }
//   isMultipleBudget: boolean
//   items: PurchaseRequisitionItem[]
//   files: FileItem[]
// }

// const initialState: TPurchaseRequisitionState = {
//   budgets: [],
//   grandTotal: 0,
//   projectName: '',
//   mainGroup: {
//     label: '',
//     value: 0,
//     key: 0,
//   },
//   requiredDate: '',
//   budgetType: {
//     label: '',
//     value: 0,
//     key: 0,
//   },
//   budgetCode: '',
//   line: '',
//   purpose: '',
//   currency: {
//     label: '',
//     value: 0,
//     key: 0,
//   },
//   exchangeRateSource: 0,
//   exchangeRateDestination: 0,
//   exchangeRate: '',
//   quotationNo: '',
//   quotationDate: '',
//   supplier: '',
//   upload: {
//     file: { uid: '' },
//     fileList: [],
//   },
//   purchaseInchargeSection: {
//     label: '',
//     value: 0,
//     key: 0,
//   },
//   isMultipleBudget: false,
//   items: [],
//   files: [],
// }

// const purchaseRequisitionSlice = createSlice({
//   name: 'purchaseRequisition',
//   initialState,
//   reducers: {
//     setPurchaseRequisition: (
//       state,
//       action: PayloadAction<TPurchaseRequisitionState>,
//     ) => {
//       return { ...state, ...action.payload }
//     },
//     resetPurchaseRequisition: () => {
//       return initialState
//     },
//   },
// })

// export const { setPurchaseRequisition, resetPurchaseRequisition } =
//   purchaseRequisitionSlice.actions

// export default purchaseRequisitionSlice.reducer
