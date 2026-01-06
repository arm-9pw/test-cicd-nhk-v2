import { ColumnsType } from 'antd/es/table'

import { WorkflowManagemantType } from 'api/workflowManangement.types'

const getWorkflowTypeDisplay = (text: string): string => {
  const typeMapping: Record<string, string> = {
    PR: 'PR.',
    PO: 'PO.',
    SHARED: 'Share PR. & PO.',
    RECEIVE_PR: 'Receive PR.',
  }
  return typeMapping[text] || text
}

export const columns: ColumnsType<WorkflowManagemantType> = [
  {
    title: 'Site Code',
    dataIndex: 'siteCode',
    key: 'siteCode',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Department Name',
    dataIndex: 'organizationName',
    key: 'organizationName',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
  },
  {
    title: 'Workflow Type',
    dataIndex: 'workflowType',
    key: 'workflowType',
    align: 'center',
    render: (text) => <div style={{ textAlign: 'left' }}>{getWorkflowTypeDisplay(text)}</div>,
  },
]
 