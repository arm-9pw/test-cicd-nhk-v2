import { Upload } from 'antd'
import { RcFile } from 'antd/es/upload'

// Types
export type FileValidationOptions = {
  maxSizeMB?: number
  allowedTypes?: string[]
  notificationFn?: (params: {
    title: string
    description: string
    type?: 'success' | 'info' | 'warning' | 'error'
  }) => void
}

// Default values
const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

const getFileNameErrorMessage = (fileName: string): string | null => {
  if (fileName.length > 1000) {
    return 'ชื่อไฟล์มีความยาวได้สูงสุด 1000 ตัวอักษรเท่านั้น'
  }

  const validCharactersRegex = /^[a-zA-Z0-9._\-\s()\u0E00-\u0E7F]+$/
  if (!validCharactersRegex.test(fileName)) {
    return 'ชื่อไฟล์มีตัวอักษรที่ไม่ถูกต้อง อนุญาตให้ใช้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข ตัวอักษรไทย เว้นวรรค (), ".", "_" และ "-" เท่านั้น'
  }

  const lowerFileName = fileName.toLowerCase()
  if (
    lowerFileName.includes('../') ||
    lowerFileName.includes('..\\') ||
    lowerFileName.startsWith('.') ||
    lowerFileName.endsWith('.')
  ) {
    return 'ชื่อไฟล์มีตัวอักษรที่ไม่ถูกต้องหรือขึ้นต้น/ลงท้ายด้วย "." ซึ่งไม่อนุญาตด้วยเหตุผลด้านความปลอดภัย'
  }

  return null
}

/**
 * Validates a file's size and type
 * @param file The file to validate
 * @param options Validation options
 * @returns Upload.LIST_IGNORE if validation fails, false otherwise
 */
export const validateFile = (
  file: RcFile,
  options?: FileValidationOptions,
): false | typeof Upload.LIST_IGNORE => {
  const {
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    notificationFn,
  } = options || {}

  // Check filename
  const fileNameError = getFileNameErrorMessage(file.name)
  if (fileNameError) {
    if (notificationFn) {
      notificationFn({
        title: 'ชื่อไฟล์ไม่ถูกต้อง',
        description: fileNameError,
        type: 'error',
      })
    }
    return Upload.LIST_IGNORE
  }

  // Check file size
  const isValidSize = file.size / 1024 / 1024 < maxSizeMB
  if (!isValidSize) {
    const errorMessage = `ขนาดไฟล์ต้องน้อยกว่า ${maxSizeMB}MB`

    if (notificationFn) {
      notificationFn({
        title: 'ขนาดไฟล์ไม่ถูกต้อง',
        description: errorMessage,
        type: 'error',
      })
    }

    return Upload.LIST_IGNORE
  }

  // Check file type
  const isAllowedType = allowedTypes.includes(file.type)
  if (!isAllowedType) {
    const allowedExtensions = allowedTypes
      .map((type) => type.split('/')[1].toUpperCase())
      .join(', ')

    const errorMessage = `คุณสามารถอัปโหลดไฟล์เฉพาะ ${allowedExtensions} เท่านั้น`

    if (notificationFn) {
      notificationFn({
        title: 'ประเภทไฟล์ไม่ถูกต้อง',
        description: errorMessage,
        type: 'error',
      })
    }

    return Upload.LIST_IGNORE
  }

  return false
}

/**
 * Returns a formatted file type and size limit hint
 * @param maxSizeMB Maximum file size in MB
 * @returns Formatted hint string
 */
export const getFileUploadHint = (maxSizeMB = DEFAULT_MAX_SIZE_MB): string => {
  return `.jpg, .png, .pdf (ขนาดไม่เกิน ${maxSizeMB}MB)`
}
