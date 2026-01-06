export const TAB_KEYS = {
  DELEGATE_TO: 'delegateTo',
  DELEGATOR: 'delegator',
} as const

export type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS]
