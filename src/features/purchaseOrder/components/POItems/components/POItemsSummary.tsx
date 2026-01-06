import { useMemo } from 'react'

import { Col, Row, Select, Typography } from 'antd'

import { DropdownValueType } from 'features/purchaseRequisition/PurchaseRequisitionPage.types'

import {
  calculateGrandTotalWithVat,
  calculateVatBaht,
  convertCurrencyToBaht,
  formatNumber,
} from 'utils/generalHelpers'
import { toThaiCurrencyWords } from 'utils/toWordsHelper'

import ThaiBahtText from 'thai-baht-text'

const { Text } = Typography

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px',
}

type Props = {
  isDisabledAllForm: boolean
  poItemsGrandTotal: number
  selectedCurrency: DropdownValueType | undefined
  exchangeRateSource: number | null
  exchangeRateDestination: number | null
  vatPercentage: number
  setVatPercentage: React.Dispatch<React.SetStateAction<number>>
}

const ItemsSummary = ({
  isDisabledAllForm,
  poItemsGrandTotal,
  selectedCurrency,
  exchangeRateSource,
  exchangeRateDestination,
  vatPercentage,
  setVatPercentage,
}: Props) => {
  const isRequiredExchangeRate = !!selectedCurrency
  const hasValidExchangeRate = !!exchangeRateSource && !!exchangeRateDestination

  const monetaryBaht = useMemo(() => {
    if (!isRequiredExchangeRate) return poItemsGrandTotal
    if (!hasValidExchangeRate) return 0

    return convertCurrencyToBaht({
      amount: poItemsGrandTotal,
      exchangeRateSource,
      exchangeRateDestination,
    })
  }, [
    poItemsGrandTotal,
    exchangeRateSource,
    exchangeRateDestination,
    isRequiredExchangeRate,
    hasValidExchangeRate,
  ])

  const vatBaht = useMemo(() => {
    if (poItemsGrandTotal) {
      const vatBaht = calculateVatBaht(monetaryBaht, vatPercentage)
      return vatBaht
    }
    return 0.0
  }, [monetaryBaht, vatPercentage, poItemsGrandTotal])

  const formatMonetaryBaht = (amount: number): string => {
    if (!isRequiredExchangeRate) return formatNumber(amount) + ' THB'
    if (!hasValidExchangeRate) return 'Need valid exchange rate'

    return `${formatNumber(monetaryBaht)} THB`
  }

  const grandTotalWithVat = useMemo(() => {
    if (poItemsGrandTotal) {
      return calculateGrandTotalWithVat(monetaryBaht, vatBaht)
    }
    return 0.0
  }, [monetaryBaht, vatBaht, poItemsGrandTotal])

  return (
    <Row gutter={[8, 8]} justify="space-between" align="bottom">
      <Col
        xs={{ order: 2, span: 24 }}
        sm={{ order: 2, span: 24 }}
        md={{ order: 2, span: 24 }}
        lg={{ order: 1, span: 12 }}
        xl={{ order: 1, span: 12 }}
      >
        <Text style={{ display: 'block' }}>
          <Text strong>ENG :</Text>{' '}
          {grandTotalWithVat > 0 ? toThaiCurrencyWords(grandTotalWithVat) : ''}
        </Text>
        <Text style={{ display: 'block' }}>
          <Text strong>TH :</Text> {ThaiBahtText(grandTotalWithVat)}
        </Text>
      </Col>

      <Col
        xs={{ order: 1, span: 24 }}
        sm={{ order: 1, span: 24 }}
        md={{ order: 1, span: 24 }}
        lg={{ order: 2, span: 12 }}
        xl={{ order: 2, span: 12 }}
      >
        <Text style={boxStyle}>
          <Text strong>Grand Total/ยอดรวมสุทธิ :</Text>{' '}
          {`${formatNumber(poItemsGrandTotal)} ${selectedCurrency?.label || 'THB'}`}
        </Text>
        {selectedCurrency?.label !== 'THB' && (
          <Text style={boxStyle}>
            <Text strong>Monetary BAHT/ยอดรวมสุทธิ(บาท) :</Text>{' '}
            {formatMonetaryBaht(poItemsGrandTotal)}
          </Text>
        )}
        <div style={boxStyle}>
          <div>
            <Text strong>Vat/ภาษี </Text>{' '}
            <Select
              defaultValue={0}
              style={{ width: 70 }}
              onChange={(value) => {
                setVatPercentage(Number(value))
              }}
              disabled={isDisabledAllForm}
              options={[
                { value: 0, label: '0' },
                { value: 1, label: '1%' },
                { value: 3, label: '3%' },
                { value: 7, label: '7%' },
              ]}
            />{' '}
            <Text strong>: </Text>
          </div>
          {formatNumber(vatBaht)} THB
        </div>
        <Text style={boxStyle}>
          <Text strong>Grand Total/ยอดรวมสุทธิ(รวมภาษี) :</Text> {formatNumber(grandTotalWithVat)}{' '}
          THB
        </Text>
      </Col>
    </Row>
  )
}

export default ItemsSummary
