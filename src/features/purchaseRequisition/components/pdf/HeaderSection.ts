import { mockQr } from 'assets/base64/mockQr.js'
import { nhkLogo } from 'assets/base64/nhkLogo.js'

import { PurchaseRequisitionRespType } from 'api/prApi.types.js'

import { formatDisplayDate } from 'utils/dateHelpers'

const createHeaderSection = (prData: PurchaseRequisitionRespType) => {
  return [
    {
      colSpan: 7,
      columns: [
        {
          image: nhkLogo,
          width: 81,
          alignment: 'left',
          margin: [0, 20, 0, 0],
        },
        {
          width: '*',
          stack: [
            {
              text: 'บริษัท เอ็นเอชเค สปริง (ประเทศไทย) จำกัด',
              alignment: 'center',
              margin: [0, 10, 0, 0],
              fontSize: 12,
            },
            {
              text: 'NHK SPRING (THAILAND) CO.,LTD.',
              alignment: 'center',
              bold: true,
              fontSize: 12,
            },
            {
              text: [
                { text: 'REQUIRE DATE : ', bold: true },
                { text: formatDisplayDate(prData.requireDate) },
              ],
              margin: [0, 25, 0, 0],
              alignment: 'center',
            },
          ],
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },
        {
          width: 'auto',
          stack: [
            { text: 'ต้นฉบับ / Original', alignment: 'right' },
            {
              image: mockQr,
              width: 60,
              alignment: 'right',
            },
            {
              text: [
                { text: 'PR. DATE : ', bold: true },
                { text: formatDisplayDate(prData.prDate) },
              ],
              alignment: 'right',
              noWrap: true,
            },
          ],
          alignment: 'right',
        },
      ],
      columnGap: 10,
    },
    '',
    '',
    '',
    '',
    '',
    '', // Empty cells for colSpan
  ]
}

export default createHeaderSection
