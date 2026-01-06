export const calculateNetTotal = (
  qty: number = 0,
  unitPrice: number = 0,
  unitDiscount: number = 0,
) => {
  return qty * (unitPrice - unitDiscount)
}
