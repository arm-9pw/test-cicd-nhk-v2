import { PrItemTypeWOKey, PurchaseRequisitionRespType } from 'api/prApi.types.js'

import createItemsTableHeader from 'components/pdf/ItemsTableHeader'

import { CURRENCIES } from 'constants/currencies'
import { commonItemCellStyles, createItemRow } from 'utils/pdfHelpers'

const createItemsTableSection = (prData: PurchaseRequisitionRespType) => {
  const currencyName = prData.currencyName

  const currencySymbol =
    currencyName && Object.keys(CURRENCIES).includes(currencyName)
      ? CURRENCIES[currencyName as keyof typeof CURRENCIES]
      : '฿'

  const getItemContent = (items: PrItemTypeWOKey[]) => {
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
    ...getItemContent(prData.purchaseRequisitionItems),
    // NOTE: MOVE THESE ROWS TO SIGNATURE SECTION
    // createGrandTotalRow(prData.itemGrandTotal, prData.currencyName),
    // createSummaryRow(prData.remarkItem, budgetStatus),
  ]
}

export default createItemsTableSection
