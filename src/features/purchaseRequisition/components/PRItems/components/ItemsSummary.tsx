import { Col, Row, Typography } from 'antd'

import { clrErrorRed } from 'styles/theme'

import { DropdownValueType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import { convertCurrencyToBaht, formatNumber } from 'utils/generalHelpers'
import { toThaiCurrencyWords } from 'utils/toWordsHelper'

import ThaiBahtText from 'thai-baht-text'

const { Text } = Typography

type Props = {
  grandTotal: number
  selectedCurrency: DropdownValueType | undefined
  exchangeRateSource: number | null
  exchangeRateDestination: number | null
  extraContent?: React.ReactNode
}

const ItemsSummary = ({
  grandTotal,
  selectedCurrency,
  exchangeRateSource,
  exchangeRateDestination,
  extraContent,
}: Props) => {
  const isRequiredExchangeRate = !!selectedCurrency
  const hasValidExchangeRate = !!exchangeRateSource && !!exchangeRateDestination

  const convertToMonetaryBaht = (amount: number): number => {
    if (!isRequiredExchangeRate) return amount
    if (!hasValidExchangeRate) return 0

    return convertCurrencyToBaht({
      amount,
      exchangeRateSource,
      exchangeRateDestination,
    })
  }

  const formatMonetaryBaht = (amount: number): string => {
    if (!isRequiredExchangeRate) return formatNumber(amount) + ' THB'
    if (!hasValidExchangeRate) return 'Need valid exchange rate'

    return `${formatNumber(convertToMonetaryBaht(amount))} THB`
  }

  const renderAmount = (formatter: (amount: number) => string, useMonetary: boolean = false) => {
    if (isRequiredExchangeRate && !hasValidExchangeRate) {
      return (
        <span style={{ color: clrErrorRed }}>
          <i>Please fill in the exchange rate</i>
        </span>
      )
    }

    const amount = useMonetary ? convertToMonetaryBaht(grandTotal) : grandTotal
    return grandTotal ? formatter(amount) : '-'
  }

  const renderCurrencyAmount = (amount: number) => {
    return `${formatNumber(amount)} ${selectedCurrency?.label || 'THB'}`
  }

  return (
    <Row justify="space-between">
      <Col>
        <Text style={{ display: 'block' }}>
          <Text strong>ENG :</Text>{' '}
          {grandTotal > 0 ? toThaiCurrencyWords(convertToMonetaryBaht(grandTotal)) : ''}
        </Text>
        <Text style={{ display: 'block' }}>
          <Text strong>TH :</Text> {renderAmount(ThaiBahtText, true)}
        </Text>
      </Col>

      <Col>
        <Text style={{ display: 'block' }}>
          <Text strong>Grand Total/ยอดรวมสุทธิ :</Text> {renderAmount(renderCurrencyAmount)}
        </Text>
        {selectedCurrency?.label !== 'THB' && (
          <Text style={{ display: 'block' }}>
            <Text strong>Monetary THB/ยอดรวมสุทธิ(บาท) :</Text>{' '}
            {renderAmount((amount) => formatMonetaryBaht(amount))}
          </Text>
        )}
        {extraContent && <Col>{extraContent}</Col>}
      </Col>
    </Row>
  )
}

export default ItemsSummary
