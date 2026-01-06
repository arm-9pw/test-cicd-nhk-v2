import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Result } from 'antd'

import { DocumentType } from 'api/approvalApi.types'
import { useAppDispatch, useAppSelector } from 'app/hook'
import { clearCustomToken, selectCustomToken, setCustomToken } from 'app/slices/tokenSlice'

import LoadingPage from 'components/LoadingPage'

import DocumentDetail from './components/DocumentDetail'
import useUserInfo from './hooks/useUserInfo'

const EmailApproveSuccessPage = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isTokenReady, setIsTokenReady] = useState(false)

  // Get individual query params
  const token = searchParams.get('token')
  const documentId = searchParams.get('documentId')
  const documentType = searchParams.get('documentType')
  const routeId = searchParams.get('routeId')

  // Validate that all required params exist and create selectedItem
  const selectedItem = {
    documentId: documentId!,
    documentType: documentType! as DocumentType,
    routeId: routeId!,
  }

  // Get the token from Redux to verify it's been saved
  const customTokenInRedux = useAppSelector(selectCustomToken)

  // Set custom token in Redux when component mounts
  useEffect(() => {
    if (token) {
      dispatch(setCustomToken(token))
      // Mark token as ready after dispatch
      setIsTokenReady(true)
    }
  }, [token, dispatch])

  // Clear custom token when component unmounts (security)
  useEffect(() => {
    return () => {
      dispatch(clearCustomToken())
    }
  }, [dispatch])

  // Remove token from URL after saving to Redux (security)
  useEffect(() => {
    if (token && customTokenInRedux) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('token')
      setSearchParams(newParams, { replace: true })
    }
  }, [token, customTokenInRedux, searchParams, setSearchParams])

  // Only fetch user info after token is saved in Redux
  const shouldFetchUserInfo = isTokenReady && customTokenInRedux !== null
  const { userInfo, isLoading, isError } = useUserInfo(shouldFetchUserInfo)

  if (isLoading && !userInfo) {
    return <LoadingPage message="Loading user information..." />
  }

  if (isError || !userInfo) {
    return (
      <div>
        <Result
          status="error"
          title="Error Loading Document Details"
          subTitle="We couldn't retrieve the document information at this time."
          style={{ margin: '24px 0' }}
        />
      </div>
    )
  }

  return (
    <div style={{ margin: 24 }}>
      <DocumentDetail
        selectedItem={selectedItem}
        customToken={customTokenInRedux}
        userInfo={userInfo}
      />
    </div>
  )
}

export default EmailApproveSuccessPage
