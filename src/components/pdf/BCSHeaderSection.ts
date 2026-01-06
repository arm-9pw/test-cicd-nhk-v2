import { mockQr } from 'assets/base64/mockQr'
import { nhkLogo } from 'assets/base64/nhkLogo'
import { clrErrorRed } from 'styles/theme'

type BCSHeaderSectionProps = {
  documentNo: string
  documentDate: string
}

const createBCSHeaderSection = ({ documentNo, documentDate }: BCSHeaderSectionProps) => {
  return [
    {
      columns: [
        {
          image: nhkLogo,
          width: 81,
          alignment: 'left',
          margin: [0, 30, 0, 0],
        },
        {
          margin: [0, 10, 0, 0],
          width: '*',
          stack: [
            {
              text: 'บริษัท เอ็นเอชเค สปริง (ประเทศไทย) จำกัด',
              alignment: 'center',
              margin: [0, 20, 0, 0],
              fontSize: 12,
            },
            {
              text: 'NHK SPRING (THAILAND) CO.,LTD.',
              alignment: 'center',
              bold: true,
              fontSize: 12,
            },
            // {
            //   text: [{ text: 'REQUIRE DATE : ', bold: true }, { text: '27/Jun/2025' }],
            //   margin: [0, 25, 0, 0],
            //   alignment: 'center',
            // },
          ],
          alignment: 'center',
        },
        {
          width: 90,
          stack: [
            { text: 'ต้นฉบับ / Original', alignment: 'right' },
            {
              text: documentNo,
              alignment: 'right',
              color: clrErrorRed,
              bold: true,
              fontSize: 10,
            },
            {
              image: mockQr,
              width: 60,
              alignment: 'right',
            },
            {
              text: [{ text: 'DATE : ', bold: true }, { text: documentDate }],
              alignment: 'right',
              noWrap: true,
            },
          ],
          alignment: 'right',
        },
      ],
      columnGap: 10,
    },
  ]
}

export default createBCSHeaderSection
