import { useEffect, useMemo } from 'react'

// import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hook'
import { resetCurrentProgram, setCurrentProgram } from 'app/slices/currentProgramSlice'

import ErrorPage from 'components/ErrorPage'
import { selectPermissions } from 'features/auth/authSlice'

type TProtectedRouteProps = {
  element: React.ReactNode
  requiredPermission: string
}

const ProtectedRoute = ({ element, requiredPermission }: TProtectedRouteProps) => {
  // const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const permissions = useAppSelector(selectPermissions)

  const permission = useMemo(
    () => permissions?.find((permission) => permission.code === requiredPermission),
    [permissions, requiredPermission],
  )

  const hasPermission = useMemo(
    () => permissions?.some((permission) => permission.code === requiredPermission),
    [permissions, requiredPermission],
  )

  useEffect(() => {
    // NOTE: Set current program that being accessed
    dispatch(
      setCurrentProgram({
        code: permission?.code,
        elementAccessList: permission?.elementAccessList,
      }),
    )
    return () => {
      dispatch(resetCurrentProgram())
    }
  }, [dispatch, permission])

  // if (!isAuthenticated) return <Navigate to="/login" />

  if (!hasPermission) {
    return <ErrorPage status="403" title="403" errorMsg="คุณไม่มีสิทธิ์เข้าถึง" />
  }

  return element
}

export default ProtectedRoute
