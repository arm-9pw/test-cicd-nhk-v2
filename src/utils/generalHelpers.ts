import { GENDER, GENDER_PREFIXES } from 'constants/index'

type DecimalPlaces =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20

export const getCSSValue = (varName: string): string => {
  const style = getComputedStyle(document.body)
  const value = style.getPropertyValue(varName)

  if (!value) {
    console.error(`CSS property "${varName}" not found.`)
  }

  return value
}

export const removePx = (value: string): number => {
  return Number(value.replace('px', ''))
}

export const unitPriceNumberFormatter = (value: number): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}

export const formatNumberMax3Decimal = (value: number, decimal: DecimalPlaces = 2): string => {
  if (value == null) return ''

  // Determine actual decimal places needed (max 3)
  const valueStr = value.toString()
  const decimalPart = valueStr.split('.')[1]
  const actualDecimals = decimalPart ? Math.min(decimalPart.length, 3) : 0

  // Use the larger of: default decimal or actual decimals (but never more than 3)
  const decimalsToUse = Math.min(Math.max(decimal, actualDecimals), 3)

  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimalsToUse,
    maximumFractionDigits: decimalsToUse,
  })
}

export const formatNumber = (value: number | bigint, decimal: DecimalPlaces = 2): string => {
  return value?.toLocaleString('en-US', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  })
}

export const formatNumber0FractionDigits = (value: number | bigint): string => {
  return value?.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export const getFormattedCurrency = (value: number | null | undefined) => {
  if (!value) return ''
  return `${formatNumber(value)} ฿`
}

/**
 * Rounds a number based on standard rounding rules (>= 5 up, < 5 down)
 * @param value - The number to round
 * @param decimals - Number of decimal places (default 2)
 */
export const roundNumber = (value: number, decimals: number = 2): number => {
  if (!value) return 0

  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Converts an amount from one currency to Thai Baht based on the provided exchange rates.
 * @param amount - The amount in the source currency to be converted.
 * @param exchangeRateSource - The exchange rate of the source currency to a base currency.
 * @param exchangeRateDestination - The exchange rate of the destination currency (Thai Baht) to the same base currency.
 * @returns The converted amount in Thai Baht, rounded to two decimal places.
 */
export const convertCurrencyToBaht = ({
  amount,
  exchangeRateSource,
  exchangeRateDestination,
}: {
  amount: number
  exchangeRateSource: number
  exchangeRateDestination: number
}): number => {
  return roundNumber(amount * (exchangeRateDestination / exchangeRateSource))
}

/**
 * Calculates the VAT amount in Baht based on a given amount and VAT percentage
 * @param amount - The base amount to calculate VAT on
 * @param vatPercentage - The VAT percentage (e.g., 7 for 7% VAT)
 * @returns The calculated VAT amount, rounded to the nearest number based on standard rounding rules
 * @example
 * calculateVatBaht(100, 7) // returns 7
 * calculateVatBaht(1000, 7) // returns 70
 */
export const calculateVatBaht = (amount: number, vatPercentage: number): number => {
  return roundNumber(amount * (vatPercentage / 100))
}

/**
 * Calculates the grand total by adding the monetary amount in Baht with the VAT amount
 * @param monetaryBaht - The base amount in Baht
 * @param vatBaht - The VAT amount in Baht
 * @returns The total amount including VAT, rounded to the nearest number based on standard rounding rules
 * @example
 * calculateGrandTotalWithVat(100, 7) // returns 107
 * calculateGrandTotalWithVat(1000, 70) // returns 1070
 */
export const calculateGrandTotalWithVat = (monetaryBaht: number, vatBaht: number): number => {
  return roundNumber(monetaryBaht + vatBaht)
}

/**
 * Formats file size from bytes to human-readable format
 * @param bytes - The file size in bytes (can be string or number)
 * @param decimals - Number of decimal places (default 1)
 * @returns Formatted file size string (e.g., "13.3 KB", "4.2 MB")
 * @example
 * formatFileSize("13264") // returns "13.0 KB"
 * formatFileSize(4200000) // returns "4.2 MB"
 * formatFileSize(1024) // returns "1.0 KB"
 */
export const formatFileSize = (bytes: string | number, decimals: number = 1): string => {
  const bytesNumber = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes

  if (bytesNumber === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytesNumber) / Math.log(k))

  return parseFloat((bytesNumber / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Transforms an array of label-value pairs into an object where values become keys and labels become values
 *
 * @param array - Array of objects containing label and value properties
 * @returns An object with value-label mappings
 *
 * @example
 * const input = [
 *   {"label": "Quotation", "value": "QUOTATION"},
 *   {"label": "Other", "value": "OTHER"}
 * ];
 * const result = transformArrayToObject(input);
 * // Returns: { "QUOTATION": "Quotation", "OTHER": "Other" }
 */
export const transformArrayToObject = (array: Array<{ label: string; value: string }>) => {
  return array.reduce(
    (acc, { value, label }) => {
      acc[value] = label
      return acc
    },
    {} as Record<string, string>,
  )
}

/**
 * Detects the gender of a person based on their name by checking for gender prefixes
 * @param name - The person's name to check
 * @returns GENDER.FEMALE if the name contains a female prefix, GENDER.MALE if it contains a male prefix, GENDER.UNKNOWN otherwise
 * @example
 * getGenderByName("Ms. John") // returns 'female'
 * getGenderByName("นาง John") // returns 'female'
 * getGenderByName("Mr. John") // returns 'male'
 * getGenderByName("นาย John") // returns 'male'
 * getGenderByName("John") // returns 'unknown'
 */
export const getGenderByName = (name: string = ''): (typeof GENDER)[keyof typeof GENDER] => {
  if (!name) return GENDER.UNKNOWN
  const lowerName = name.toLowerCase()

  if (GENDER_PREFIXES.FEMALE.some((prefix) => lowerName.includes(prefix))) {
    return GENDER.FEMALE
  }

  if (GENDER_PREFIXES.MALE.some((prefix) => lowerName.includes(prefix))) {
    return GENDER.MALE
  }

  return GENDER.UNKNOWN
}
