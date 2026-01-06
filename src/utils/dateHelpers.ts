import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

// Extend Day.js with the UTC and Timezone plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// Date Format
export const UTC_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]'
export const LOCAL_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export const DISPLAY_DATE_FORMAT = 'DD/MMM/YYYY'
export const DISPLAY_DATE_TIME_FORMAT = 'DD/MMM/YYYY HH:mm:ss'

export const getCurrentYear = () => {
  return dayjs().year()
}

const formatDate = (date: Date | string | number | undefined, format: string): string => {
  if (!date) {
    return ''
  }
  return dayjs(date).format(format)
}

/**
 * Formats a UTC date to Asia/Bangkok time
 * @param {Date|string|number} date - The input UTC date
 * @param {string} format - Optional format string (defaults to DISPLAY_DATE_TIME_FORMAT)
 * @returns {string} Formatted date string in Asia/Bangkok time
 */
export const formatUTCToBangkokDisplayDateTime = (
  date: Date | string | number | undefined,
  format: string = DISPLAY_DATE_TIME_FORMAT,
): string => {
  if (!date) return ''
  return dayjs.utc(date).tz('Asia/Bangkok').format(format)
}

/**
 * Formats a local date to UTC in the format "YYYY-MM-DDTHH:mm:ssZ"
 * @param {Date|string|number} date - The input date (local time)
 * @returns {string} Formatted UTC date string
 */
export const formatLocalToUTC = (date: Date | string | number | undefined): string => {
  return formatDate(date, UTC_DATE_FORMAT)
}

/**
 * Formats a date to local time in the format "YYYY-MM-DDTHH:mm:ss"
 * @param {Date|string|number} date - The input date
 * @returns {string} Formatted local date string
 */
export const formatToLocalDateTime = (date: Date | string | number | undefined): string => {
  return formatDate(date, LOCAL_DATE_FORMAT)
}

/**
 * Formats a date to a display format
 * @param {Date|string|number} date - The input date
 * @param {string} format - Optional format string (defaults to "DD/MMM/YYYY")
 * @returns {string} Formatted display date string
 */
export const formatDisplayDate = (
  date: Date | string | number | undefined,
  format: string = DISPLAY_DATE_FORMAT,
): string => {
  return formatDate(date, format)
}

export const formatDisplayDateTime = (date: Date | string | number | undefined): string => {
  return formatDate(date, DISPLAY_DATE_TIME_FORMAT)
}

/**
 * Converts a date string to a dayjs object
 * @param {string} dateString - The date string to convert
 * @param {string} format - The format of the input date string (optional)
 * @returns {dayjs.Dayjs | null} Dayjs object or null if invalid
 */
export const getDateFromString = (
  dateString: string | null | undefined,
  format?: string,
): dayjs.Dayjs | null => {
  if (!dateString) {
    return null
  }

  const parsedDate = format ? dayjs(dateString, format) : dayjs(dateString)
  return parsedDate.isValid() ? parsedDate : null
}
