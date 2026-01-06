import { ColumnsType } from 'antd/es/table'

import { budgetEnquiryResponse } from 'api/enquiryApi.types'

import { formatNumber } from 'utils/generalHelpers'

export const columns = (data: budgetEnquiryResponse[]): ColumnsType<budgetEnquiryResponse> => {
    return [
        {
            title: 'NO.',
            dataIndex: 'no',
            key: 'no',
            align: 'center',
            fixed: 'left' as const,
        },
        {
            title: 'Budget Status',
            dataIndex: 'budgetStatus',
            key: 'budgetStatus',
            align: 'center',
            minWidth: 120,
            fixed: 'left' as const,
            render: (_, record) => {
                let status = '-'
                let isOverBudget = false
                //Main Budget
                if (record.typeRecord === 'M') {
                    isOverBudget = record.estMainBgRemain < 0
                    status = isOverBudget ? 'Over Budget' : 'On Budget'
                }
                //Sub Budget
                else if (record.typeRecord === 'S') {
                    isOverBudget = (record.estSubBgRemain ?? 0) < 0
                    status = isOverBudget ? 'Over Budget' : 'On Budget'
                }
                return (
                    <div style={isOverBudget ? { color: 'red', textAlign: 'left' } : { textAlign: 'left' }}>
                        {status}
                    </div>
                )
            },
        },
        {
            title: 'Main Budget No',
            dataIndex: 'mainBudgetNo',
            key: 'mainBudgetNo',
            align: 'center',
            minWidth: 230,
            fixed: 'left' as const,
            render: (text, record, index) => {
                const display = <div style={{ textAlign: text ? 'left' : 'center' }}>{text || '-'}</div>
                // ถ้าเป็น NO BUDGET ให้แสดงทุกแถว
                if (record.mainBudgetNo === 'NO BUDGET') {
                    return display
                }

                const prevRecord = index > 0 ? data[index - 1] : null
                const shouldShow = !prevRecord || prevRecord.mainBudgetNo !== record.mainBudgetNo

                if (!shouldShow) return null

                return display
            },
        },
        {
            title: 'Sub Budget No',
            dataIndex: 'subBudgetNo',
            key: 'subBudgetNo',
            align: 'center',
            minWidth: 230,
            render: (text) => <div style={{ textAlign: text ? 'left' : 'center' }}>{text || '-'}</div>,
        },
        {
            title: 'Budget Type',
            dataIndex: 'budgetTypeName',
            key: 'budgetTypeName',
            align: 'center',
            minWidth: 150,
            render: (text) => {
                return <div style={{ textAlign: 'left' }}>{text}</div>
            },
        },
        {
            title: 'Main Budget Amount',
            dataIndex: 'mainBudgetAmount',
            key: 'mainBudgetAmount',
            align: 'center',
            minWidth: 170,
            render: (text, record, index) => {
                const displayText = text !== null ? text : 0
                const display = <div style={{ textAlign: 'right' }}>{formatNumber(displayText, 2)}</div>
                // ถ้าเป็น NO BUDGET ให้แสดงทุกแถว
                if (record.mainBudgetNo === 'NO BUDGET') {
                    return display
                }

                const prevRecord = index > 0 ? data[index - 1] : null
                const shouldShow = !prevRecord || prevRecord.mainBudgetNo !== record.mainBudgetNo

                if (!shouldShow) return null

                return display
            },
        },
        {
            title: 'Sub Budget Amount',
            dataIndex: 'subBudgetAmount',
            key: 'subBudgetAmount',
            align: 'center',
            minWidth: 160,
            render: (text) => {
                const displayText = text !== null ? text : 0
                return <div style={{ textAlign: 'right' }}>{formatNumber(displayText, 2)}</div>
            },
        },
        {
            title: 'Waiting PO Amount',
            dataIndex: 'prWaitingPo',
            key: 'prWaitingPo',
            align: 'center',
            minWidth: 160,
            render: (text) => {
                const displayText = text !== null ? text : 0
                return <div style={{ textAlign: 'right' }}>{formatNumber(displayText, 2)}</div>
            },
        },
        {
            title: 'Final Amount',
            dataIndex: 'finalAmount',
            key: 'finalAmount',
            align: 'center',
            minWidth: 120,
            render: (text) => {
                const displayText = text !== null ? text : 0
                return <div style={{ textAlign: 'right' }}>{formatNumber(displayText, 2)}</div>
            },
        },
        {
            title: 'Main Budget Remain',
            dataIndex: 'estMainBgRemain',
            key: 'estMainBgRemain',
            align: 'center',
            minWidth: 160,
            render: (text, record, index) => {
                const displayText = text !== null ? text : 0
                const display = <div style={{ textAlign: 'right' }}>{formatNumber(displayText, 2)}</div>
                // ถ้าเป็น NO BUDGET ให้แสดงทุกแถว
                if (record.mainBudgetNo === 'NO BUDGET') {
                    return display
                }

                const prevRecord = index > 0 ? data[index - 1] : null
                const shouldShow = !prevRecord || prevRecord.mainBudgetNo !== record.mainBudgetNo

                if (!shouldShow) return null

                return display
            },
        },
        {
            title: 'Sub Budget Remain',
            dataIndex: 'estSubBgRemain',
            key: 'estSubBgRemain',
            align: 'center',
            minWidth: 150,
            render: (text) => {
                const displayText = text !== null ? text : 0
                return <div style={{ textAlign: 'right' }}>{formatNumber(displayText, 2)}</div>
            },
        },
        {
            title: 'Section Name',
            key: 'sectionName',
            align: 'center',
            minWidth: 150,
            render: (_, record) => {
                return (
                    <div style={{ textAlign: 'center' }}>
                        {[record.organizationName, record.siteCode].filter(Boolean).join('/') || '-'}
                    </div>
                )
            },
        },
    ]
}
