import { useCallback, useEffect, useState } from 'react'
import { Form, message } from 'antd'

import { useLazyGetPurchaseOrdersInquiryQuery } from 'api/enquiryApi'
import { poEnquiryQueryParams, poEnquiryResponse } from 'api/enquiryApi.types'

import { formatToLocalDateTime } from 'utils/dateHelpers'

const usePurchaseOrderEnquiryPage = () => {
  const [formRef] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [purchaseOrders, setPurchaseOrders] = useState<poEnquiryResponse[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [activeKey, setActiveKey] = useState<string[]>(['1'])

  const [getPurchaseOrdersInquiry, { data, isSuccess, isError, error, reset }] =
    useLazyGetPurchaseOrdersInquiryQuery()

  /** 🔵 แยก Format Search Params ฟังก์ชันเดียว ใช้ได้ทุกที่ */
  const formatSearchParams = useCallback(async (page: number, size: number): Promise<poEnquiryQueryParams> => {
    const values = await formRef.validateFields()

    const { poDate, poStatus, ...rest } = values
    const params: poEnquiryQueryParams = { ...rest }

    if (poDate && poDate.length === 2) {
      params.poStartDate = formatToLocalDateTime(poDate[0])
      params.poEndDate = formatToLocalDateTime(poDate[1])
    }

    if (poStatus) {
      params.purchaseStatus = [poStatus]
    }

    params.page = page
    params.sizePerPage = size

    return params
  }, [formRef])

  /** 🔵 ใช้โหลดข้อมูล */
  const fetchPurchaseOrders = useCallback(async (page = 0, size = 10) => {
    const params = await formatSearchParams(page, size)
    setIsLoading(true)
    await getPurchaseOrdersInquiry(params)
  }, [formatSearchParams, getPurchaseOrdersInquiry])

  useEffect(() => {
    if (isSuccess && data) {
      const formattedData = data.map((item, index) => ({
        ...item,
        key: item.id,
        no: index + 1 + currentPage * pageSize,
      }))
      setPurchaseOrders(formattedData)
      setIsLoading(false)
    }
  }, [isSuccess, data, currentPage, pageSize])

  useEffect(() => {
    if (isError && error) {
      message.error('Failed to fetch purchase orders')
      setIsLoading(false)
    }
  }, [isError, error])

  const handleSearch = useCallback(async () => {
    try {
      reset()
      setCurrentPage(0)
      setPurchaseOrders([])
      setActiveKey([])

      await fetchPurchaseOrders(0, pageSize)
    } catch {
      message.error('Please check your inputs and try again.')
      setIsLoading(false)
    }
  }, [pageSize, fetchPurchaseOrders, reset])

  const handleReset = useCallback(() => {
    // Reset RTK Query state
    reset()

    formRef.resetFields()
    setPurchaseOrders([])
    setActiveKey(['1'])
    setCurrentPage(0)
    setIsLoading(false)
  }, [formRef, reset])

  const handleChangePage = useCallback(async (page: number, size: number) => {
    try {
      await fetchPurchaseOrders(page - 1, size)
      setCurrentPage(page - 1)
      setPageSize(size)
    } catch {
      message.error('Please check your inputs and try again.')
    }
  }, [fetchPurchaseOrders])

  const handleCollapseChange = (key: string | string[]) => {
    setActiveKey(Array.isArray(key) ? key : [key])
  }

  return {
    formRef,
    isLoading,
    purchaseOrders,
    currentPage,
    pageSize,
    activeKey,
    handleCollapseChange,
    handleSearch,
    handleReset,
    handleChangePage,
  }
}

export default usePurchaseOrderEnquiryPage