export type PreviewDataType = {
  type: 'pdf' | 'image' | null
  url: string | null
  isLoading: boolean
  error: string | null
}

export type ActiveItemType = {
  id: string
  type: 'main' | 'attachment'
}
