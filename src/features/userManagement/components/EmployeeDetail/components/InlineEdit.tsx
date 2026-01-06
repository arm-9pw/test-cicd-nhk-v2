import { useState } from 'react'

import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Input, Space, Typography } from 'antd'

const { Text } = Typography

interface InlineEditProps {
  value: string
  onSave: (newValue: string) => Promise<boolean | void>
  label?: string
  inputWidth?: number
}

const InlineEdit = ({ value, onSave, label, inputWidth = 200 }: InlineEditProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleSave = async () => {
    if (tempValue === value) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      const result = await onSave(tempValue)
      if (result !== false) {
        setIsEditing(false)
      } // NOTE: If onSave returns false, it means the save failed then just keep the current input state
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  return (
    <div style={{ marginBottom: 8, display: 'flex' }}>
      {label && (
        <Text style={{ marginRight: 16 }} strong>
          {label}:
        </Text>
      )}
      {isEditing ? (
        <Space.Compact style={{ flex: 1 }}>
          <Input
            size="small"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            style={{ width: inputWidth }}
            disabled={isLoading}
          />
          <Button
            icon={<SaveOutlined />}
            size="small"
            color="primary"
            variant="solid"
            onClick={handleSave}
            loading={isLoading}
          />

          <Button
            icon={<CloseOutlined />}
            size="small"
            color="danger"
            variant="solid"
            onClick={handleCancel}
            disabled={isLoading}
          />
        </Space.Compact>
      ) : (
        <Space style={{ flex: 1, justifyContent: 'space-between' }}>
          <div>
            <Text>{value}</Text>
          </div>
          <Button
            color="primary"
            variant="outlined"
            icon={<EditOutlined />}
            size="small"
            onClick={() => setIsEditing(true)}
          />
        </Space>
      )}
    </div>
  )
}

export default InlineEdit
