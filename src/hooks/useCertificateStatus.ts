import { useAppSelector } from 'app/hook'
import {
  selectCertificateLastChecked,
  selectCertificateLoading,
  selectCertificateStatus,
  selectDaysUntilExpiry,
  selectHasCertificate,
  selectIsExpired,
  selectIsExpiring,
} from 'app/slices/certificateSlice'

/**
 * Hook to access certificate status from Redux state
 * Status is fetched once during app initialization by AuthProvider
 */
export const useCertificateStatus = () => {
  const status = useAppSelector(selectCertificateStatus)
  const isLoading = useAppSelector(selectCertificateLoading)
  const isExpiring = useAppSelector(selectIsExpiring)
  const isExpired = useAppSelector(selectIsExpired)
  const hasCertificate = useAppSelector(selectHasCertificate)
  const daysUntilExpiry = useAppSelector(selectDaysUntilExpiry)
  const lastChecked = useAppSelector(selectCertificateLastChecked)

  return {
    status,
    isLoading,
    isExpiring,
    isExpired,
    hasCertificate,
    daysUntilExpiry,
    lastChecked,
    message: status?.message ?? '',
    validFrom: status?.validFrom,
    validUntil: status?.validUntil,
    certificateId: status?.certificateId,
  }
}

export default useCertificateStatus
