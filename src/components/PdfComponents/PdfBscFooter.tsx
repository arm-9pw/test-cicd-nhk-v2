import { Text, View } from '@react-pdf/renderer'

import dayjs from 'dayjs'
import { formatDisplayDate } from 'utils/dateHelpers'

const PdfBscFooter = () => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '5px',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: 6,
        marginTop: '2px',
      }}
    >
      <Text>
        {`REMARK: PLEASE EXPLAIN DETAIL IN OVER BUDGET CASE (CANNOT EXCEED THE BUDGET 10% OF BUDGET AMOUNT (A), MAXIMUM 500,000 THB)`}
      </Text>
      <Text style={{ fontSize: 8 }}>
        <Text style={{ fontWeight: 800 }}>Print Date: </Text>
        {formatDisplayDate(dayjs().toDate())}
      </Text>
    </View>
  )
}

export default PdfBscFooter
