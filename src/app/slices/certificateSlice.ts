import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { CertificateStatusDTO } from 'api/certificateApi.types'
import { RootState } from 'app/store'

export type CertificateStateType = {
  status: CertificateStatusDTO | null
  isLoading: boolean
  lastChecked: string | null
}

const initialState: CertificateStateType = {
  status: null,
  isLoading: false,
  lastChecked: null,
}

export const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    setCertificateStatus: (state, action: PayloadAction<CertificateStatusDTO>) => {
      state.status = action.payload
      state.lastChecked = new Date().toISOString()
    },
    setCertificateLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    clearCertificateStatus: (state) => {
      state.status = null
      state.lastChecked = null
    },
  },
})

export const { setCertificateStatus, setCertificateLoading, clearCertificateStatus } =
  certificateSlice.actions

export default certificateSlice.reducer

// Selectors
export const selectCertificateStatus = (state: RootState) => state.certificate.status
export const selectCertificateLoading = (state: RootState) => state.certificate.isLoading
export const selectCertificateLastChecked = (state: RootState) => state.certificate.lastChecked
export const selectIsExpiring = (state: RootState) => state.certificate.status?.expiring ?? false
export const selectIsExpired = (state: RootState) => state.certificate.status?.expired ?? false
export const selectHasCertificate = (state: RootState) =>
  state.certificate.status?.hasCertificate ?? false
export const selectDaysUntilExpiry = (state: RootState) =>
  state.certificate.status?.daysUntilExpiry ?? 0