import { useAppSelector } from 'app/hook'
import { selectLoading } from 'app/slices/loadingSlice'

import LoadingPage from './LoadingPage'

const GlobalLoading = () => {
  const { isLoading, message } = useAppSelector(selectLoading)

  return isLoading && <LoadingPage message={message ? message : 'Loading...'} />
}

export default GlobalLoading
