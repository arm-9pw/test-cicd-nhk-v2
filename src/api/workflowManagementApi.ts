import { apiSlice } from './apiSlice'
import {
  ApproverPositionType,
  CreateStepRequest,
  CreateWorkflowRequest,
  EmployeeApproverType,
  WorkflowManagemantType,
  WorkflowStepType,
} from './workflowManangement.types'

export const workflowManangementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListWorkflows: builder.query<
      WorkflowManagemantType[],
      {
        page?: number
        sizePerPage?: number
        siteCode?: string
        organizationId?: string
      }
    >({
      query: (params) => ({
        url: '/api/workflow-templates',
        method: 'GET',
        params: { ...params, page: (params.page ?? 1) - 1 },
      }),
      providesTags: [{ type: 'Workflows', id: 'LIST' }],
    }),
    deleteWorkFlow: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/workflow-templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Workflows', id: 'LIST' }]
      },
    }),
    deleteApproveStep: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/workflow-steps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Workflows', id: 'LIST' }]
      },
    }),
    createWorkflow: builder.mutation<WorkflowManagemantType, CreateWorkflowRequest>({
      query: (data) => ({ url: '/api/workflow-templates', method: 'POST', body: data }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Workflows', id: 'LIST' }]
      },
    }),
    createApproveStep: builder.mutation<WorkflowStepType, CreateStepRequest>({
      query: (data) => ({
        url: `/api/workflow-templates/${data.templateId}/steps`,
        method: 'POST',
        templateId: data.templateId,
        body: data,
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Workflows', id: 'LIST' }]
      },
    }),
    updateWorkflowStep: builder.mutation<
      WorkflowStepType,
      {
        stepId: string
      } & CreateStepRequest
    >({
      query: (data) => ({
        url: `/api/workflow-steps/${data.stepId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, error) => {
        if (error) return []
        return [{ type: 'Workflows', id: 'LIST' }]
      },
    }),
    getListPositions: builder.query<ApproverPositionType[], void>({
      query: () => ({
        url: '/api/positions/approvers',
        method: 'GET',
      }),
    }),
    getListApproverName: builder.query<
      EmployeeApproverType[],
      { organizationId: string; positionId?: string }
    >({
      query: (params) => ({
        url: 'api/employees/approval-hierarchy',
        method: 'GET',
        params,
      }),
    }),
  }),
})

export const {
  useGetListWorkflowsQuery,
  useDeleteWorkFlowMutation,
  useDeleteApproveStepMutation,
  useCreateWorkflowMutation,
  useCreateApproveStepMutation,
  useGetListPositionsQuery,
  useGetListApproverNameQuery,
  useLazyGetListApproverNameQuery,
  useLazyGetListPositionsQuery,
  useUpdateWorkflowStepMutation,
} = workflowManangementApi
