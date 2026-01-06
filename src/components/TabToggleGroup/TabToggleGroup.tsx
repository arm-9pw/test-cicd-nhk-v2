import type { ReactNode } from 'react'

import { Badge, Button, Col, Row } from 'antd'
import type { ButtonProps, ColProps, RowProps } from 'antd'

export type TabToggleOption = {
  key: string
  label: ReactNode
  disabled?: boolean
  ariaControls?: string
  buttonProps?: ButtonProps
  count?: number
}

export type TabToggleGroupProps = {
  activeKey: string
  tabs: TabToggleOption[]
  onChange: (key: string) => void
  size?: ButtonProps['size']
  activeType?: ButtonProps['type']
  inactiveType?: ButtonProps['type']
  rowProps?: RowProps
  colProps?: ColProps
  className?: string
  buttonClassName?: string
  isFullWidth?: boolean
}

const TabToggleGroup = ({
  activeKey,
  tabs,
  onChange,
  size = 'middle',
  activeType = 'primary',
  inactiveType = 'default',
  rowProps,
  colProps,
  className,
  buttonClassName,
  isFullWidth = true,
}: TabToggleGroupProps) => {
  return (
    <Row gutter={[12, 12]} className={className} {...rowProps}>
      {tabs.map(({ key, label, disabled, ariaControls, buttonProps, count }) => (
        <Col key={key} {...colProps} flex={isFullWidth ? 1 : undefined}>
          <Badge count={count} offset={[-14, 0]}>
            <Button
              size={size}
              type={activeKey === key ? activeType : inactiveType}
              disabled={disabled}
              aria-pressed={activeKey === key}
              aria-controls={ariaControls}
              onClick={() => onChange(key)}
              className={buttonClassName}
              style={{ width: '120px' }}
              {...buttonProps}
            >
              {label}
            </Button>
          </Badge>
        </Col>
      ))}
    </Row>
  )
}

export default TabToggleGroup
