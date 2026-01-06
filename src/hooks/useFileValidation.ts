import { Upload } from 'antd'
import { RcFile } from 'antd/es/upload'

import {
  FileValidationOptions,
  getFileUploadHint,
  validateFile as validateFileUtil,
} from '../utils/fileValidation'

import { useGlobalModal } from './useGlobalModal'

/**
 * Hook that provides file validation functionality using the notification context
 * @param options File validation options
 * @returns Object containing file validation functions and helpers
 */
export const useFileValidation = (options?: Omit<FileValidationOptions, 'notificationFn'>) => {
  const { openModal } = useGlobalModal()

  /**
   * Validates a file and shows notifications for validation errors
   * @param file The file to validate
   * @returns Upload.LIST_IGNORE if validation fails, false otherwise
   */
  const validateFile = (file: RcFile): false | typeof Upload.LIST_IGNORE => {
    return validateFileUtil(file, {
      ...options,
      notificationFn: ({ title, description }) => {
        openModal('error', {
          title,
          content: description,
          okText: 'OK',
        })
      },
    })
  }

  /**
   * Returns a formatted file type and size limit hint
   * @returns Formatted hint string
   */
  const fileUploadHint = getFileUploadHint(options?.maxSizeMB)

  return {
    validateFile,
    fileUploadHint,
  }
}
