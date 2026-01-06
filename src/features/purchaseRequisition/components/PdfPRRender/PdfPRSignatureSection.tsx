import { Styles, Text, View } from '@react-pdf/renderer'

import { clrPrimary, clrWhite } from 'styles/theme'

import SignBox from './components/SignBox'

type Props = {
  styles: Styles
  fixed?: boolean
}

const PdfPRSignatureSection = ({ styles, fixed = false }: Props) => {
  return (
    <View
      style={[
        styles.textXS,
        {
          marginTop: '5px',
          position: fixed ? 'absolute' : 'relative',
          bottom: fixed ? 20 : undefined,
        },
      ]}
    >
      <View style={[styles.textMD, { backgroundColor: clrPrimary, borderRadius: '2px' }]}>
        <Text style={{ margin: 'auto', color: clrWhite, fontWeight: 800 }}>REQUESTER DIVISION</Text>
      </View>
      <View
        style={[styles.flexRow, { gap: '1px', justifyContent: 'space-between', marginTop: '2px' }]}
      >
        <SignBox label="REQUESTER/CHIEF" />
        <SignBox label="MANAGER/DGM" />
        <SignBox label="GM." />
        <SignBox label="FGM." />
        <SignBox label="SDC./EMC./SD." />
        <SignBox label="VP./SVP./EVP." />
      </View>
      <View
        style={[
          styles.textMD,
          { backgroundColor: clrPrimary, borderRadius: '2px', marginTop: '5px' },
        ]}
      >
        <Text style={{ margin: 'auto', color: clrWhite, fontWeight: 800 }}>PURCHASE DIVISION</Text>
      </View>
      <View
        style={[styles.flexRow, { gap: '1px', justifyContent: 'space-between', marginTop: '2px' }]}
      >
        <SignBox label="RECEIVER" />
        <SignBox label="CHIEF.FACT." />
        <SignBox label="MANAGER" />
        <SignBox label="RECEIVER HO." />
        <SignBox label="CHIEF HO." />
        <SignBox label="MANAGER" />
      </View>
      <View style={{ fontSize: 6 }}>
        <Text>
          {`REMARK: MANAGER < 5,000 ฿, DEPUTY GENERAL MANAGER < 10,000 ฿, GENERAL MANAGER/FACTORY GENERAL MANAGER/SENIOR DIRECTOR < 50,000 ฿, `}
        </Text>
        <Text>{`VICE PRESIDENT/SENIOR VICE PRESIDENT/EXECUTIVE VICE PRESIDENT > 50,000 ฿ `}</Text>
      </View>
    </View>
  )
}

export default PdfPRSignatureSection
