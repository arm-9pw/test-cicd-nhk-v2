import { clrPrimary, clrWhite } from 'styles/theme'

import { PurchaseRequisitionRespType } from 'api/prApi.types.js'

import { insertZWS } from 'utils/thaiSegmenter'

const LEFT_TOPIC_WIDTH = 50
const RIGHT_TOPIC_WIDTH = 65

const createPRInfoSection = (prData: PurchaseRequisitionRespType) => {
  const getMainBudgetCode = () => {
    return (
      prData.purchaseRequisitionBudgetControlSheets
        .map((item) => item.mainBudgetCode)
        .filter(Boolean)
        .join(', ') || '-'
    )
  }

  const getSubBudgetCode = () => {
    return (
      prData.purchaseRequisitionBudgetControlSheets
        .map((item) => item.subBudgetCode)
        .filter(Boolean)
        .join(', ') || '-'
    )
  }

  return [
    // NOTE: ------ HEADER ------
    [
      {
        colSpan: 7,
        text: `PURCHASE REQUISITION #${prData.prNo}`,
        fillColor: clrPrimary,
        alignment: 'center',
        color: clrWhite,
        bold: true,
        margin: [0, -2, 0, -2],
        fontSize: 10,
      },
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    // NOTE: ------ HEADER ------
    [
      {
        colSpan: 7,
        columns: [
          {
            width: '50%',
            stack: [
              {
                columns: [
                  { text: 'Name :', width: LEFT_TOPIC_WIDTH, bold: true },
                  { text: prData.requesterName || '-', width: '*' },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Section :', width: LEFT_TOPIC_WIDTH, bold: true },
                  { text: prData.requesterSection || '-', width: '*' },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Line :', width: LEFT_TOPIC_WIDTH, bold: true },
                  { text: prData.line || '-', width: '*' },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Site :', width: LEFT_TOPIC_WIDTH, bold: true },
                  {
                    text: prData.requesterSite || '-',
                    width: '*',
                  },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Main Group :', width: LEFT_TOPIC_WIDTH, bold: true },
                  { text: prData.mainGroupName || '-', width: '*' },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Purpose :', width: LEFT_TOPIC_WIDTH, bold: true },
                  {
                    text: insertZWS(prData.purpose || '') || '-',
                    width: '*',
                  },
                ],
                columnGap: 10,
              },
            ],
          },
          {
            width: '50%',
            stack: [
              {
                columns: [
                  {
                    columns: [
                      { text: 'Budget Type :', width: RIGHT_TOPIC_WIDTH, bold: true },
                      { text: prData.budgetTypeName || '-', width: '*' },
                      {
                        text: 'Budget Year :',
                        bold: true,
                        margin: [5, 0, 0, 0],
                        width: 'auto',
                      },
                      { text: prData.budgetYear || '-', alignment: 'right', width: 'auto' },
                    ],
                  },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Asset Type :', width: RIGHT_TOPIC_WIDTH, bold: true },
                  { text: prData.assetType || '-', width: '*' },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Main Budget No. :', width: RIGHT_TOPIC_WIDTH, bold: true },
                  { text: getMainBudgetCode(), width: '*' },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Sub Budget No. :', width: RIGHT_TOPIC_WIDTH, bold: true },
                  {
                    text: getSubBudgetCode(),
                    width: '*',
                  },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Budget Desc. :', width: RIGHT_TOPIC_WIDTH, bold: true },
                  {
                    text: insertZWS(prData.budgetDescription || '') || '-',
                    width: '*',
                  },
                ],
                columnGap: 10,
              },
              {
                columns: [
                  { text: 'Jobs Name :', width: RIGHT_TOPIC_WIDTH, bold: true },
                  {
                    text: insertZWS(prData.jobName || '') || '-',
                    width: '*',
                  },
                ],
                columnGap: 10,
              },
            ],
          },
        ],
        columnGap: 10,
        margin: [0, 0, 0, 5],
      },
      '',
      '',
      '',
      '',
      '',
      '', // Empty cells for colSpan],
    ],
  ]
}

export default createPRInfoSection
