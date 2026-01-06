/**
 * Certificate status response from GET /user/certificate/status
 */
export type CertificateStatusDTO = {
  /** Whether the employee has a certificate */
  hasCertificate: boolean
  /** The certificate ID if one exists */
  certificateId?: number
  /** Whether the certificate is active */
  active?: boolean
  /** Whether the certificate has expired */
  expired: boolean
  /** Whether the certificate is expiring soon (within 5 days) */
  expiring: boolean
  /** Number of days until certificate expires (0 if expired) */
  daysUntilExpiry: number
  /** Certificate validity start date (ISO 8601 format) */
  validFrom?: string
  /** Certificate validity end date (ISO 8601 format) */
  validUntil?: string
  /** Informational message about the status */
  message: string
}

/**
 * Success response for passcode operations
 */
export type PasscodeSuccessResponse = {
  message: string
}

/**
 * Error response format
 */
export type CertificateErrorResponse = {
  error: string
}