import { useGetUserInfoQuery } from 'api/authApi'
import { UserInfoType } from 'api/authApi.types'

interface UseUserInfoReturn {
  userInfo: UserInfoType | null
  isLoading: boolean
  isError: boolean
  error: unknown
}

const useUserInfo = (shouldFetch: boolean = true): UseUserInfoReturn => {
  const { data, isLoading, isError, error } = useGetUserInfoQuery(undefined, {
    skip: !shouldFetch,
  })

  return {
    userInfo: data || null,
    isLoading,
    isError,
    error,
  }
}

export default useUserInfo
