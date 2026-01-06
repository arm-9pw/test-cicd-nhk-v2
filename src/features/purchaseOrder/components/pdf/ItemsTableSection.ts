import { PurchaseOrderItemRespType, PurchaseOrderRespType } from 'api/poApi.types'

import createItemsTableHeader from 'components/pdf/ItemsTableHeader'

import { CURRENCIES } from 'constants/currencies'
import { commonItemCellStyles, createItemRow } from 'utils/pdfHelpers'

const createItemsTableSection = (poData: PurchaseOrderRespType) => {
  const currencyName = poData.currencyName

  const currencySymbol =
    currencyName && Object.keys(CURRENCIES).includes(currencyName)
      ? CURRENCIES[currencyName as keyof typeof CURRENCIES]
      : '฿'

  const getItemContent = (items: PurchaseOrderItemRespType[]) => {
    return items.map((item, index) =>
      createItemRow({
        item,
        index,
        isLastRow: index === items.length - 1,
        styles: commonItemCellStyles,
        currencySymbol,
      }),
    )
  }

  return [
    createItemsTableHeader(),
    [
      { text: '', border: [true, false, true, false], ...commonItemCellStyles },
      { text: '', border: [true, false, true, false], ...commonItemCellStyles },
      { text: '', border: [true, false, true, false], ...commonItemCellStyles },
      { text: '', border: [true, false, true, false], ...commonItemCellStyles },
      { text: '', border: [true, false, true, false], ...commonItemCellStyles },
      { text: '', border: [true, false, true, false], ...commonItemCellStyles },
      { text: '', border: [true, false, true, false], ...commonItemCellStyles },
    ], // NOTE: Empty row for padding to calculate correctly
    // ['', '', '', '', '', '', ''], // NOTE: Empty row for padding to calculate correctly
    ...getItemContent(poData.purchaseOrderItems),
  ]
}

export default createItemsTableSection
