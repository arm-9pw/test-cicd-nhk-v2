import { CURRENCY_NAMES_EN } from 'constants/currencies'
import toWords, { toThaiCurrencyWords } from 'utils/toWordsHelper'

/**
 * Gets the full currency name from a currency code
 * @param currencyName The currency code (e.g., 'THB')
 * @returns The full currency name (e.g., 'Thai Baht')
 */
export const getFullCurrencyName = (currencyName: string | undefined): string => {
  return currencyName && Object.keys(CURRENCY_NAMES_EN).includes(currencyName)
    ? CURRENCY_NAMES_EN[currencyName as keyof typeof CURRENCY_NAMES_EN]
    : 'Baht'
}

/**
 * Converts a number to words and appends the currency name
 * @param amount The amount to convert
 * @param currencyName The currency code
 * @returns The amount in words with the currency name
 */
export const getAmountInWords = (amount: number, currencyName: string | undefined): string => {
  const fullCurrencyName = getFullCurrencyName(currencyName)

  if (currencyName === 'THB') return `${toThaiCurrencyWords(amount)}`
  else return `${toWords.convert(amount)} ${fullCurrencyName}`
}
