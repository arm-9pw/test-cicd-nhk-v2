import React, { ReactNode, useState } from 'react'

import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface ExpandableButtonGroupProps {
  children: ReactNode
  triggerLabel: React.ReactNode
}

const ExpandableButtonGroup: React.FC<ExpandableButtonGroupProps> = ({
  children,
  triggerLabel,
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Extra Buttons (stacked above) */}
        <div
          style={{
            position: 'absolute',
            bottom: 48, // height of main button + gap
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            transition: 'opacity 0.3s, transform 0.3s',
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: expanded ? 'auto' : 'none',
          }}
        >
          {children}
        </div>
        {/* Main Button */}
        <Button
          type="primary"
          style={{ backgroundColor: '#2a80e0' }}
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setExpanded((prev) => !prev)}
          size='large'
        >
          {triggerLabel}
        </Button>
      </div>
    </div>
  )
}

export default ExpandableButtonGroup
