import { ToWords } from 'to-words'

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
})

export const toThaiCurrencyWords = (amount: number): string => {
  if (isNaN(amount)) return ''
  
  // Split the amount into whole baht and satang parts
  const bahtPart = Math.floor(amount)
  const satangPart = Math.round((amount - bahtPart) * 100)
  
  // Convert baht part to words
  const bahtWords = toWords.convert(bahtPart)
  
  // Format the result based on whether there are satang or not
  if (satangPart > 0) {
    const satangWords = toWords.convert(satangPart)
    return `${bahtWords} Baht And ${satangWords} Satang`
  } else {
    return `${bahtWords} Baht`
  }
}

export default toWords
