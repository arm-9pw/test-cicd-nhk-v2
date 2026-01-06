import { clrPrimary, clrWhite } from 'styles/theme'

import { PurchaseRequisitionRespType } from 'api/prApi.types'

import { createGrandTotalRow, createSummaryRow, getBudgetStatus } from './utils/pdfHelpers'

const SIGNATURE_BOX_WIDTH = 88

const createSignatureSection = (prData: PurchaseRequisitionRespType) => {
  const currencyName = prData.currencyName
  const budgetStatus = getBudgetStatus(prData.purchaseRequisitionBudgetControlSheets)

  return [
    {
      colSpan: 7,
      margin: [-5, -3, -5, 0],
      stack: [
        {
          layout: {
            defaultBorder: false,
          },
          table: {
            dontBreakRows: true,
            widths: [20, '*', 35, 40, 65, 60, 65],
            body: [
              createGrandTotalRow({
                grandTotal: prData.itemGrandTotal,
                currencyName,
              }),
              createSummaryRow(prData.remarkItem, budgetStatus),
            ],
          },
        },
        {
          layout: {
            defaultBorder: false,
          },
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              [
                {
                  colSpan: 6,
                  text: 'REQUESTER DIVISION',
                  bold: true,
                  alignment: 'center',
                  fillColor: clrPrimary,
                  color: clrWhite,
                  fontSize: 10,
                  margin: [0, -2, 0, -2],
                },
                '',
                '',
                '',
                '',
                '',
              ],
              // NOTE: ------ REQUESTER DIVISION ------
              [
                { text: 'REQUESTER/CHIEF', alignment: 'center' },
                { text: 'MANAGER/DGM', alignment: 'center' },
                { text: 'GM.', alignment: 'center' },
                { text: 'FGM.', alignment: 'center' },
                { text: 'SDC./EMC./SD.', alignment: 'center' },
                { text: 'VP./SVP./EVP.', alignment: 'center' },
              ],
              // NOTE: ------ REQUESTER DIVISION: SIGNATURES ------
              [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
              ],
              ['', '', '', '', '', ''],
              [
                {
                  colSpan: 6,
                  text: 'PURCHASER APPROVAL',
                  bold: true,
                  alignment: 'center',
                  fillColor: clrPrimary,
                  color: clrWhite,
                  fontSize: 10,
                  margin: [0, -2, 0, -2],
                },
                '',
                '',
                '',
                '',
                '',
              ],
              // NOTE: ------ PURCHASE DIVISION ------
              [
                { text: 'RECEIVER', alignment: 'center' },
                { text: 'CHIEF.FACT.', alignment: 'center' },
                { text: 'MANAGER', alignment: 'center' },
                { text: 'RECEIVER HO. ', alignment: 'center' },
                { text: 'CHIEF HO.', alignment: 'center' },
                { text: 'MANAGER', alignment: 'center' },
              ],
              // NOTE: ------ REQUESTER DIVISION: SIGNATURES ------
              [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: SIGNATURE_BOX_WIDTH,
                      h: 50,
                      lineWidth: 1,
                      lineColor: '#000',
                    },
                  ],
                },
              ],
            ],
          },
        },
        {
          text: `REMARK: MANAGER < 5,000 ฿, DEPUTY GENERAL MANAGER < 10,000 ฿, GENERAL MANAGER/FACTORY GENERAL MANAGER/SENIOR DIRECTOR < 50,000 ฿,
          VICE PRESIDENT/SENIOR VICE PRESIDENT/EXECUTIVE VICE PRESIDENT > 50,000 ฿`,
          alignment: 'left',
          fontSize: 6,
        },
      ],
    },
    '',
    '',
    '',
    '',
    '',
    '',
  ]
}

export default createSignatureSection
