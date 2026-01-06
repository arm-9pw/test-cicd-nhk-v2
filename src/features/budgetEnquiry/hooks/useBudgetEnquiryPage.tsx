import { Form, message } from "antd"
import { useLazyGetBudgetEnquiryQuery } from "api/enquiryApi"
import { budgetEnquiryQueryParams, budgetEnquiryResponse } from "api/enquiryApi.types"
import { useCallback, useEffect, useState } from "react"

const useBudgetEnquiryPage = () => {
    const [formRef] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [budgets, setBudgets] = useState<budgetEnquiryResponse[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [activeKey, setActiveKey] = useState<string[]>(['1'])
    const [budgetCode, setBudgetCode] = useState<string | null>(null)

    const [getBudgetsInquiry, { data, isSuccess, isError, error, reset }] = useLazyGetBudgetEnquiryQuery()

    const fetchBudgets = async (page = 0, size = 10) => {
        const values = await formRef.validateFields()
        const params:budgetEnquiryQueryParams = {
            budgetYear: values.budgetYear,
            siteCode: values.siteCode,
            budgetTypeId: values.budgetTypeId?.value,
            orgIds: values.sectionId && values.sectionId !== 'ALL' ? [values.sectionId] : undefined,
            budgetNo: budgetCode || undefined,
            page: page,
            sizePerPage: size,

        }
        setIsLoading(true)
        await getBudgetsInquiry(params)
    }

    useEffect(() => {
        if (isSuccess && data) {
            const formattedData = data.map((item, index) => ({
                ...item,
                no: index + 1 + currentPage * pageSize,
            }))
            setBudgets(formattedData)
            setIsLoading(false)
        }
    }, [isSuccess, data, currentPage, pageSize])

    useEffect(() => {
        if (isError && error) {
            console.error('Error fetching budgets:', error)
            setIsLoading(false)
        }
    }, [isError, error])

    const handleSearch = useCallback(async () => {
        try {
            reset()
            setCurrentPage(0)
            setBudgets([])
            setActiveKey([])

            await fetchBudgets(0, pageSize)
        } catch {
            message.error('Please check your search criteria.')
            setIsLoading(false)
        }
    }, [fetchBudgets, pageSize, reset])

    const handleReset = useCallback(() => {
        reset()

        formRef.resetFields()
        setBudgets([])
        setActiveKey(['1'])
        setCurrentPage(0)
        setIsLoading(false)
        setBudgetCode(null)
    }, [formRef, reset])

    const handleChangePage = useCallback(async (page: number, size: number) => {
        setCurrentPage(page - 1)
        setPageSize(size)
        await fetchBudgets(page - 1, size)
    }, [fetchBudgets])

    const handleCollapseChange = (key: string | string[]) => {
        setActiveKey(Array.isArray(key) ? key : [key])
    }

    return {
        formRef,
        isLoading,
        budgets,
        currentPage,
        pageSize,
        activeKey,
        handleSearch,
        handleReset,
        handleChangePage,
        handleCollapseChange,
        budgetCode,
        setBudgetCode,
    }
}
export default useBudgetEnquiryPage