import { apiSlice } from 'api/apiSlice'

import {
  ImportBudgetRequest,
  ImportBudgetResponse,
  ImportEmployeeRequest,
  ImportEmployeeResponse,
  ListBudgetResponse,
} from './importDataApiType'

export const importDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadEmployee: builder.mutation<ImportEmployeeResponse, ImportEmployeeRequest>({
      query: ({ file, password }) => {
        const formData = new FormData()

        // Add file
        formData.append('file', file)

        // Add metadata as JSON string
        const metadata = {
          password,
        }
        formData.append('metadata', JSON.stringify(metadata))

        return {
          url: '/api/uploadEmployee',
          method: 'POST',
          body: formData,
          formData: true,
        }
      },
    }),
    uploadBudget: builder.mutation<ImportBudgetResponse, ImportBudgetRequest>({
      query: ({ file, budgetType }) => {
        const formData = new FormData()

        // Add file
        formData.append('file', file)

        // Add budgetType as Text field (JSON string)
        const budgetTypeStr = JSON.stringify(budgetType)
        formData.append('budgetType', budgetTypeStr)

        return {
          url: '/api/budgets/import',
          method: 'POST',
          body: formData,
          formData: true,
        }
      },
    }),
    getBudgetResponse: builder.query<ListBudgetResponse[], void>({
      query: () => ({
        url: '/api/budgets/import',
        method: 'GET',
      }),
    }),
  }),
})

export const { useUploadEmployeeMutation, useUploadBudgetMutation, useGetBudgetResponseQuery } =
  importDataApi
