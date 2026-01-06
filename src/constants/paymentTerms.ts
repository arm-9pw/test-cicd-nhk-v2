export const SPECIAL_PAYMENT_TERMS = ['Separate Payment', 'Other Payment']

/**
 * Checks if a payment term is a special type (Separate Payment or Other Payment)
 * that requires additional description
 * 
 * @param paymentTermName The payment term name to check
 * @returns true if the payment term requires description
 */
export const isSpecialPaymentTerm = (paymentTermName?: string): boolean => {
  if (!paymentTermName) return false
  return SPECIAL_PAYMENT_TERMS.some(term => paymentTermName.includes(term))
} 