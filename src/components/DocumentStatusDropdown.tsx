import { useMemo } from 'react'

import { Select } from 'antd'
import { Form } from 'antd'

import { useGetDocumentStatusQuery } from 'api/masterApi'

const DocumentStatusDropdown = ({
  formName,
  formLabel,
}: {
  formName: string
  formLabel: string
}) => {
  const { data = [], isLoading } = useGetDocumentStatusQuery()

  const options = useMemo(() => {
    return data.map((item) => ({
      value: item.status, // ใช้ status เป็น value
      label: item.status, // ใช้ status เป็น label
    }))
  }, [data])

  return (
    <Form.Item label={formLabel} name={formName}>
      <Select
        placeholder="<กรุณาเลือก>"
        allowClear
        loading={isLoading}
        options={options}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Form.Item>
  )
}

export default DocumentStatusDropdown
