import React, { useState } from 'react'

import { Checkbox, Space, Typography } from 'antd'

import styled from 'styled-components'

import ContentCard from 'components/ContentCard'

const { Text } = Typography

const TitleText = styled(Text)`
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--clr-primary);
`
const NormalText = styled(Text)`
  color: var(--clr-primary);
`

type TWarningOptions = {
  overBudget: boolean
  ringiShoRequest: boolean
}

const WarningSection: React.FC = () => {
  const [warningOptions, setWarningOptions] = useState<TWarningOptions>({
    overBudget: false,
    ringiShoRequest: false,
  })

  const handleCheckboxChange = (option: keyof TWarningOptions) => {
    setWarningOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  return (
    <ContentCard>
      <Space size="middle">
        <TitleText>Warning/คำเตือน</TitleText>
        <Checkbox
          checked={warningOptions.overBudget}
          onChange={() => handleCheckboxChange('overBudget')}
        >
          <NormalText>Over Budget/วงเงินเกินงบประมาณ</NormalText>
        </Checkbox>
        <Checkbox
          checked={warningOptions.ringiShoRequest}
          onChange={() => handleCheckboxChange('ringiShoRequest')}
        >
          <NormalText>Ringi Sho Request/มีเอกสาร ริงงิ โช</NormalText>
        </Checkbox>
      </Space>
    </ContentCard>
  )
}

export default WarningSection
