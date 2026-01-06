import { clrBlack200, clrPrimary, clrWhite } from 'styles/theme'

import { PurchaseOrderRespType } from 'api/poApi.types.js'

import { formatDisplayDate } from 'utils/dateHelpers'

const customTableLayout = {
  hLineColor: function () {
    return clrBlack200
  },
  vLineColor: function () {
    return clrBlack200
  },
  // Optionally, you can set line width as well
  hLineWidth: function () {
    return 1
  },
  vLineWidth: function () {
    return 1
  },
}

const createPOInfoSection = (poData: PurchaseOrderRespType) => {
  const quotationFileList = () => {
    return (
      (poData?.documentAttachFiles &&
        poData?.documentAttachFiles?.filter(
          (file) => file.domain === 'PURCHASE_ORDER' && file.documentType.includes('QUOTATION'),
        )) ||
      []
    )
  }

  const getPaymentTerm = () => {
    return ['Separate Payment', 'Other Payment'].includes(poData?.paymentTermName || '')
      ? poData.paymentTermDescription || '-'
      : poData.paymentTermName || '-'
  }

  const getBudgetType = () => {
    if (poData.isReferPr) {
      let budgetTypeText = poData.isReferPr
        ? poData?.purchaseRequisitions[0]?.budgetTypeName || '-'
        : ''

      if (poData?.purchaseRequisitions[0]?.budgetYear) {
        budgetTypeText = budgetTypeText + `- ${poData?.purchaseRequisitions[0]?.budgetYear}`
      }
      return budgetTypeText
    } else {
      return poData.budgetTypeName || '-'
    }
  }

  const getMainBudgetCode = () => {
    return poData.purchaseOrderBudgetControlSheets
      .map((item) => item.mainBudgetCode)
      .filter(Boolean)
      .join(', ')
  }

  const getSubBudgetCode = () => {
    return (
      poData.purchaseOrderBudgetControlSheets
        .map((item) => item.subBudgetCode)
        .filter(Boolean)
        .join(', ') || '-'
    )
  }

  return [
    {
      colSpan: 7,
      margin: [-5, 0, -5, -4],
      layout: customTableLayout,
      table: {
        // headerRows: 1,
        // keepWithHeaderRows: 4,
        dontBreakRows: true,
        widths: ['*', '*', '*'],
        body: [
          [
            {
              text: 'REQUESTER INFORMATION',
              bold: true,
              fontSize: 10,
              fillColor: clrPrimary,
              color: clrWhite,
            },
            {
              text: 'VENDER INFORMATION',
              bold: true,
              fontSize: 10,
              fillColor: clrPrimary,
              color: clrWhite,
            },
            {
              text: 'PR. INFORMATION',
              bold: true,
              fontSize: 10,
              fillColor: clrPrimary,
              color: clrWhite,
            },
          ],
          [
            {
              stack: [
                {
                  text: [
                    { text: 'Delivery: ', bold: true },
                    { text: poData.siteDeliveryName || '-', bold: true },
                  ],
                },
                {
                  text: [
                    { text: 'Requester: ', bold: true },
                    {
                      text: poData.isReferPr
                        ? poData?.purchaseRequisitions[0]?.requesterName || '-'
                        : poData.purchaserName || '-',
                    },
                  ],
                },
                {
                  text: [
                    { text: 'Email: ', bold: true },
                    {
                      text: poData.isReferPr
                        ? poData?.purchaseRequisitions[0]?.requesterEmail || '-'
                        : poData.purchaserEmail || '-',
                    },
                  ],
                },
                {
                  text: [
                    { text: 'Section: ', bold: true },
                    {
                      text: poData.isReferPr
                        ? poData?.purchaseRequisitions[0]?.requesterSection || '-'
                        : poData.purchaserSection || '-',
                    },
                  ],
                },
                {
                  text: [
                    { text: 'Tel.: ', bold: true },
                    {
                      text: poData.isReferPr
                        ? poData?.purchaseRequisitions[0]?.requesterTel || '-'
                        : poData.purchaserTel || '-',
                    },
                  ],
                },
              ],
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Name: ', bold: true },
                    { text: poData.supplierName || '-', bold: true },
                  ],
                },
                {
                  text: [{ text: 'Attn: ', bold: true }, { text: poData.supplierAttention || '-' }],
                },
                {
                  text: [{ text: 'Tel: ', bold: true }, { text: poData.supplierTelephone || '-' }],
                },
                {
                  text: [{ text: 'Email: ', bold: true }, { text: poData.supplierEmail || '-' }],
                },
                {
                  text: [{ text: 'PaymentTerm: ', bold: true }, { text: getPaymentTerm() }],
                },
                {
                  text: [
                    { text: 'Vender Code: ', bold: true },
                    { text: poData.supplierCode || '-' },
                  ],
                },
                {
                  text: [{ text: 'Tax ID: ', bold: true }, { text: poData.supplierTaxId || '-' }],
                },
              ],
            },
            {
              stack: [
                {
                  text: [
                    { text: 'PR.No.: ', bold: true },
                    { text: poData.isReferPr ? poData?.purchaseRequisitions[0]?.prNo || '-' : '-' },
                  ],
                },
                {
                  text: [
                    { text: 'Date: ', bold: true },
                    {
                      text: poData.isReferPr
                        ? formatDisplayDate(poData?.purchaseRequisitions[0]?.prDate) || '-'
                        : '-',
                    },
                  ],
                },
                {
                  text: [
                    { text: 'Budget Type: ', bold: true },
                    {
                      text: getBudgetType(),
                    },
                  ],
                },
                {
                  text: [{ text: 'Main Budget No.: ', bold: true }, { text: getMainBudgetCode() }],
                },
                {
                  text: [{ text: 'Sub Budget No.: ', bold: true }, { text: getSubBudgetCode() }],
                },
              ],
            },
          ],
          [
            {
              text: 'DELIVERY DATE',
              bold: true,
              fontSize: 10,
              fillColor: clrPrimary,
              color: clrWhite,
              alignment: 'center',
            },
            {
              text: 'QUOTATION INFORMATION',
              bold: true,
              fontSize: 10,
              fillColor: clrPrimary,
              color: clrWhite,
              alignment: 'center',
            },
            {
              text: 'PURCHASE INFORMATION',
              bold: true,
              fontSize: 10,
              fillColor: clrPrimary,
              color: clrWhite,
              alignment: 'center',
            },
          ],
          [
            {
              text: formatDisplayDate(poData.deliveryDate) || '-',
              alignment: 'center',
            },
            {
              stack: quotationFileList().map((item) => {
                return {
                  text: [
                    { text: 'No.: ', bold: true },
                    { text: item.documentNo || '-' },
                    { text: '  Date: ', bold: true },
                    { text: formatDisplayDate(item.documentDate) || '-' },
                  ],
                  alignment: 'center',
                }
              }),
            },
            {
              text: poData.purchaserName || '-',
              alignment: 'center',
            },
          ],
        ],
      },
    },
  ]
}

export default createPOInfoSection
