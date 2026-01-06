import { PurchaseOrderRespType } from 'api/poApi.types'

import { createGrandTotalRow } from './utils/pdfHelpers'

const CHECK_BOX_WIDTH = 10
const CHECK_BOX_HEIGHT = 10
const REMARK_FONT_SIZE = 7

const createSignatureSection = (poData: PurchaseOrderRespType) => {
  const totalUnitPrice = () => {
    return poData.purchaseOrderItems.reduce((acc, item) => acc + item.unitPrice * item.qty, 0)
  }

  const totalUnitDiscount = () => {
    return poData.purchaseOrderItems.reduce((acc, item) => acc + item.unitDiscount * item.qty, 0)
  }

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
              ...createGrandTotalRow({
                total: totalUnitPrice(),
                totalDiscount: totalUnitDiscount(),
                grandTotal: poData.itemGrandTotal,
                currencyName: poData.currencyName,
              }),
            ],
          },
        },
        poData.isImport
          ? {
              margin: [0, 5, 0, 0],
              text: [
                {
                  text: '**INCOTERM : ',
                  bold: true,
                },
                {
                  text: poData.incoterm || '-',
                },
              ],
            }
          : {
              margin: [0, 5, 0, 0],
              columns: [
                {
                  width: 'auto',
                  text: 'ผู้รับใบสั่งซื้อ : ........................................................ วันที่รับ : ................................',
                },
                {
                  margin: [20, 2, 5, 0],
                  width: 'auto',
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: CHECK_BOX_WIDTH,
                      h: CHECK_BOX_HEIGHT,
                      lineWidth: 1,
                      lineColor: '#333',
                    },
                  ],
                },
                {
                  width: 'auto',
                  text: 'ส่งได้ตามกำหนด | ',
                },
                {
                  margin: [10, 2, 5, 0],
                  width: 'auto',
                  canvas: [
                    {
                      type: 'rect',
                      x: -5,
                      y: -3,
                      w: CHECK_BOX_WIDTH,
                      h: CHECK_BOX_HEIGHT,
                      lineWidth: 1,
                      lineColor: '#333',
                    },
                  ],
                },
                {
                  width: 'auto',
                  text: 'ส่งได้ไม่ตามกำหนด สามารถส่งได้วันที่ : ................................',
                },
              ],
            },
        {
          margin: [0, 5, 0, 0],
          text: [
            {
              text: 'REMARK : ',
              bold: true,
            },
            {
              text: poData.remarkItem || '-',
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            poData.isImport
              ? {
                  margin: [0, 122, 0, 0],
                  width: '50%',
                  columns: [
                    {
                      stack: [
                        {
                          text: '........................................................',
                          alignment: 'center',
                        },
                        {
                          text: '(Overseas)',
                          alignment: 'center',
                        },
                      ],
                    },
                    {
                      stack: [
                        {
                          text: '........................................................',
                          alignment: 'center',
                        },
                        {
                          text: '(Overseas MGR)',
                          alignment: 'center',
                        },
                      ],
                    },
                  ],
                }
              : {
                  margin: [0, 60, 0, 0],
                  width: '50%',
                  stack: [
                    {
                      fontSize: REMARK_FONT_SIZE,
                      text: [
                        {
                          text: 'หมายเหตุ',
                          decoration: 'underline',
                        },
                        { text: ' :' },
                      ],
                    },
                    {
                      fontSize: REMARK_FONT_SIZE,
                      text: '- การส่งสินค้า โปรดส่งต้นฉบับใบกำกับภาษี หรือใบแจ้งหนี้พร้อมสำเนารวม 3 ฉบับ (ประทับตราบริษัทรับรองสำเนาถูกต้อง)',
                    },
                    {
                      fontSize: REMARK_FONT_SIZE,
                      text: '- ใบกำกับภาษี หรือใบแจ้งหนี้กรุณาอ้างอิงที่อยู่ตาม Address Invoice พร้อมกับ Tax ID 13 หลัก และรหัสสาขา',
                    },
                    {
                      fontSize: REMARK_FONT_SIZE,
                      text: '- กรุณาอ้างอิงเลขที่ใบสั่งซื้อ และวันที่ใบสั่งซื้อ และใบส่งของด้วยทุกครั้ง',
                    },
                    {
                      fontSize: REMARK_FONT_SIZE,
                      text: '- การวางบิล ให้มาวางบิลตามรอบการวางบิลของฝ่ายบัญชีและการเงิน (สำนักงานใหญ่)',
                    },
                    {
                      fontSize: REMARK_FONT_SIZE,
                      text: '- ปิดรับ Invoice ทุกวันที่ 25 ของทุกเดือน กรณีตรงวันหยุดให้เลื่อนเข้า (ยกเว้นกรณีพิเศษ)',
                    },
                    {
                      fontSize: REMARK_FONT_SIZE,
                      text: [
                        {
                          text: '*ห้าม',
                          decoration: 'underline',
                        },
                        {
                          text: 'ส่งสินค้าเกินวันที่กำหนดโดยเด็ดขาด ',
                        },
                        {
                          text: 'ยกเว้น',
                          decoration: 'underline',
                        },
                        {
                          text: 'เหตุสุดวิสัยโดยให้แจ้งผ่านฝ่ายจัดซื้อทุกครั้ง',
                        },
                      ],
                    },
                  ],
                },
            {
              margin: [0, 40, 0, 0],
              width: '50%',
              stack: [
                {
                  text: '.............................................................................................................................',
                  alignment: 'center',
                },
                {
                  text: '(Purchaser)',
                  alignment: 'center',
                },
                {
                  margin: [0, 20, 0, 0],
                  columns: [
                    {
                      stack: [
                        {
                          text: '........................................................',
                          alignment: 'center',
                        },
                        {
                          text: '(MGR)',
                          alignment: 'center',
                        },
                      ],
                    },
                    {
                      stack: [
                        {
                          text: '........................................................',
                          alignment: 'center',
                        },
                        {
                          text: '(DGM/GM)',
                          alignment: 'center',
                        },
                      ],
                    },
                  ],
                },
                {
                  margin: [0, 20, 0, 0],
                  columns: [
                    {
                      stack: [
                        {
                          text: '........................................................',
                          alignment: 'center',
                        },
                        {
                          text: '(FGM/SD)',
                          alignment: 'center',
                        },
                      ],
                    },
                    {
                      stack: [
                        {
                          text: '........................................................',
                          alignment: 'center',
                        },
                        {
                          text: '(VP/EVP)',
                          alignment: 'center',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}

export default createSignatureSection
