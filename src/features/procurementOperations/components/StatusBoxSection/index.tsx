import { Col, Row, Spin } from 'antd'

import { ProcurementStatus } from 'api/procurementApi.types'
import { ProcurementContext } from 'api/procurementApi.types'

import StatusBox from 'components/StatusBox'
import { STATUS_CONFIGS } from 'features/procurementOperations/hooks/procurementConfig'

const SPAN = {}

type StatusBoxSectionProps = {
  isLoadingCounts: boolean
  context: ProcurementContext
  onChangeStatus: (status: ProcurementStatus) => void
  selectedStatus: ProcurementStatus | null
  statusCounts: Record<ProcurementStatus, number>
}

const StatusBoxSection = ({
  isLoadingCounts,
  context,
  onChangeStatus,
  selectedStatus,
  statusCounts,
}: StatusBoxSectionProps) => {
  const statusConfigs = STATUS_CONFIGS[context]

  return (
    <Spin spinning={isLoadingCounts}>
      <Row gutter={[16, 16]}>
        {statusConfigs.map((config) => (
          <Col key={config.status} {...SPAN}>
            <StatusBox
              number={statusCounts[config.status] || 0}
              status={config.status}
              text={config.text}
              color={config.color}
              icon={config.icon}
              onClick={onChangeStatus}
              isActive={selectedStatus === config.status}
            />
          </Col>
        ))}
      </Row>
    </Spin>
  )
}

export default StatusBoxSection
