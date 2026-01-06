import { mockQr } from 'assets/base64/mockQr.js'
import { nhkLogo } from 'assets/base64/nhkLogo.js'
import { clrErrorRed } from 'styles/theme'

import { PurchaseOrderRespType } from 'api/poApi.types'

import { formatDisplayDate } from 'utils/dateHelpers'

const createHeaderSection = (poData: PurchaseOrderRespType) => {
  return [
    {
      colSpan: 7,
      margin: [-4, -30, -4, -5],
      columns: [
        {
          width: 'auto',
          stack: [
            {
              image: nhkLogo,
              width: 81,
              alignment: 'left',
              margin: [0, 10, 0, 0],
            },
            {
              text: 'บริษัท เอ็นเอชเค สปริง (ประเทศไทย) จำกัด',
              bold: true,
              margin: [0, 5, 0, 0],
              fontSize: 10,
            },
            {
              text: 'NHK SPRING (THAILAND) CO.,LTD.',
              bold: true,
              fontSize: 10,
            },
            {
              text: [
                { text: 'Tax ID: ', bold: true },
                { text: poData.siteMaster.taxId || '-' },
                { text: ' Branch No.: ', bold: true },
                { text: poData.siteMaster.siteBranchNo || '-' },
              ],
              margin: [0, 2, 0, 0],
            },
            {
              text: [
                { text: 'Address Invoice: ', bold: true },
                { text: poData.siteMaster.addressEn },
              ],
            },
            {
              text: [{ text: poData.siteMaster.address2EN }],
            },
            {
              text: [
                poData.siteMaster.subDistrictEN,
                poData.siteMaster.districtEN,
                poData.siteMaster.provinceEn,
              ]
                .filter(Boolean)
                .join(', '),
            },
            {
              text: [poData.siteMaster.countryEN, poData.siteMaster.postalCode]
                .filter(Boolean)
                .join(', '),
            },
            {
              text: [{ text: 'Tel. ' + poData.siteMaster.tel || '-' }],
            },
            { text: [{ text: 'Fax. ' + poData.siteMaster.fax || '-' }] },
          ],
        },
        ...(poData.isImport
          ? [
              {
                margin: [40, 130, 0, 0],
                width: 'auto',
                stack: [{ text: '(IMPORT)', fontSize: 12, bold: true }],
              },
            ]
          : []),
        {
          width: '*',
          stack: [
            { text: 'PURCHASE ORDER', bold: true, fontSize: 18, margin: [0, 8, 0, 0] },
            { text: 'ต้นฉบับ / Original', alignment: 'right', margin: [0, 12, 0, 0] },
            {
              text: poData.poNo,
              bold: true,
              fontSize: 10,
              color: clrErrorRed,
              alignment: 'right',
            },
            {
              text: [{ text: 'DATE : ', bold: true }, { text: formatDisplayDate(poData.poDate) }],
              alignment: 'right',
              noWrap: true,
            },
            {
              image: mockQr,
              width: 70,
              alignment: 'right',
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
