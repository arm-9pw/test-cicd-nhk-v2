// src/features/purchaseRequisitionsEnquiry/hooks/usePurchaseRequisitionEnquiry.ts
import { useEffect, useState } from 'react'

import { Form, message } from 'antd'
import dayjs from 'dayjs'

import { useLazyGetPurchaseRequisitionsInquiryQuery } from 'api/enquiryApi'
import { prEnquiryResponse, prEnquiryQueryParams } from 'api/enquiryApi.types'

import { formatToLocalDateTime } from 'utils/dateHelpers'

export const usePurchaseRequisitionEnquiry = () => {
  const [formRef] = Form.useForm()
  const [currentPage, setCurrentPage] = useState(1)
  const [tableData, setTableData] = useState<prEnquiryResponse[]>([])
  const [searchParams, setSearchParams] = useState<prEnquiryQueryParams>({
    page: 0,
    sizePerPage: 10,
  })
  const [activeKey, setActiveKey] = useState<string[]>(['1']) // สำหรับ Collapse

  const [getPurchaseRequisitions, { data: purchaseRequisitionsData, isLoading, error }] =
    useLazyGetPurchaseRequisitionsInquiryQuery()

  useEffect(() => {
    if (purchaseRequisitionsData) {
      const formattedData = purchaseRequisitionsData.map((item, index) => ({
        key: item.id || `row-${index}`,
        id: item.id || `row-${index}`,
        no: (searchParams.page || 0) * (searchParams.sizePerPage || 10) + index + 1,
        prNo: item.prNo || '',
        prDate: item.prDate ? dayjs(item.prDate).format('YYYY-MM-DD') : '',
        budgetCode: item.budgetCode || '',
        site: item.requesterSite || '',
        section: item.requesterSection || '',
        requester: item.requesterName || '',
        grandTotal: item.monetaryBaht || 0,
        status: item.purchaseStatus || '',
        purchaseStatus: item.purchaseStatus || '',
      }))
      setTableData(formattedData)
    } else {
      setTableData([])
    }
  }, [purchaseRequisitionsData, searchParams])

  useEffect(() => {
    if (error) {
      message.error('Failed to fetch purchase requisitions')
      console.error('API Error:', error)
    }
  }, [error])

  const handleSearch = async () => {
    try {
      const values = await formRef.validateFields()

      const { prDate, purchaseStatus, ...rest } = values
      const params: prEnquiryQueryParams = { ...rest }

      // ✅ Format Date Range
      if (prDate && prDate.length === 2) {
        params.prStartDate = formatToLocalDateTime(prDate[0])
        params.prEndDate = formatToLocalDateTime(prDate[1])
      }

      // ✅ สำคัญที่สุด! แปลง purchaseStatus => purchaseStates
      if (purchaseStatus) {
        params.purchaseStatus = [purchaseStatus] // <<<<<< ตรงนี้แหละหัวใจ
      }

      // ✅ ตั้งค่า default pagination
      params.page = 0
      params.sizePerPage = 10

      setCurrentPage(1)
      setSearchParams(params)
      getPurchaseRequisitions(params)
      setActiveKey([]) // ปิด collapse ตอน search
    } catch {
      message.error('Please check your inputs and try again.')
    }
  }
  const handleReset = () => {
    formRef.resetFields()
    setTableData([])
    setActiveKey(['1']) // ปิด collapse ตอน reset
  }

  const handleCollapseChange = (key: string | string[]) => {
    setActiveKey(Array.isArray(key) ? key : [key])
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    const params = {
      ...searchParams,
      page: page - 1,
      sizePerPage: pageSize,
    }
    setSearchParams(params)
    getPurchaseRequisitions(params)
  }

  return {
    formRef,
    tableData,
    isLoading,
    currentPage,
    activeKey,
    handleCollapseChange,
    handleSearch,
    handleReset,
    handlePageChange,
  }
}
