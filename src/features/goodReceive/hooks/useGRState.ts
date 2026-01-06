import { useMemo } from 'react'

import { requesterInfoType } from 'api/grApi.types'
import { useAppSelector } from 'app/hook'

import { selectUser } from 'features/auth/authSlice'

type UseGRStateProps = {
  selectedRequester: requesterInfoType
}

export function useGRState({ selectedRequester }: UseGRStateProps) {
  const user = useAppSelector(selectUser)
  const isRequester = useMemo(
    () => selectedRequester?.requesterId === user?.employeeId,
    [selectedRequester, user],
  )
  const isSameDepartment = useMemo(
    () => selectedRequester?.requesterSectionId === user?.currentDepartmentId,
    [selectedRequester, user],
  )
  const isNotBoth = useMemo(
    () => !isRequester && !isSameDepartment,
    [isRequester, isSameDepartment],
  )

  const isDisabledAllForm = useMemo(() => {
    return isNotBoth
  }, [isNotBoth])

  return { isRequester, isSameDepartment, isNotBoth, isDisabledAllForm }
}
