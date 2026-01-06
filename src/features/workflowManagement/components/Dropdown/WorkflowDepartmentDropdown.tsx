import { useMemo } from 'react'

import { Empty, Form, SelectProps, Skeleton } from 'antd'
import { Rule } from 'antd/es/form'

import { useListSectionDepartmentQuery } from 'api/employeeApi'

import GenericDropdown from 'components/GenericDropdown'

type Props = {
  siteCode?: string | null
  formName?: string
  formLabel?: string
  rules?: Rule[]
  placeholder?: string
  style?: React.CSSProperties
  onChange?: (value: { id: number | string; name: string } | null) => void
  disabled?: boolean
} & Omit<SelectProps, 'onChange'>

type Section = {
  id: string
  name: string
  alternativeName?: string
}

const WorkflowDepartmentDropdown: React.FC<Props> = ({
  siteCode,
  formName,
  formLabel,
  rules,
  placeholder = '< กรุณาเลือก/ค้นหา >',
  style,
  onChange,
  disabled = false,
  ...selectProps
}) => {
  const {
    data = [],
    isFetching,
    isError,
    error,
  } = useListSectionDepartmentQuery(
    {
      siteCode,
      page: 0,
      sizePerPage: 500,
    },
    { skip: !siteCode },
  )

  const _options = useMemo(() => {
    const baseOptions = data.map((section: Section) => ({
      ...section,
      label: section.alternativeName
        ? `${section.name} - ${section.alternativeName}`
        : section.name,
      value: section.id,
    }))
    return baseOptions
  }, [data])

  const labelRender: SelectProps['labelRender'] = (props) => {
    const { label } = props

    if (isFetching) {
      return <span>Loading...</span>
    }

    if (label) {
      return label
    }
  }

  const departmentSelect = (
    <GenericDropdown
      showSearch
      allowClear
      labelInValue={false}
      popupMatchSelectWidth={false}
      labelRender={labelRender}
      placeholder={!siteCode ? 'กรุณาเลือก Site Code ก่อน' : placeholder}
      disabled={disabled || !siteCode}
      isError={isError}
      loading={isFetching}
      error={error}
      options={_options}
      notFoundContent={
        !siteCode ? (
          <Empty description="กรุณาเลือก Site Code" />
        ) : isFetching ? (
          <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
        ) : null
      }
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      onChange={(_value, option) => {
        if (onChange && option) {
          const selected = option as { id: string; name: string }
          onChange({ id: selected.id, name: selected.name })
        }
      }}
      style={style}
      {...selectProps}
    />
  )

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '100%', flex: 1 }}>
        {formName ? (
          <Form.Item label={formLabel} name={formName} rules={rules}>
            {departmentSelect}
          </Form.Item>
        ) : (
          departmentSelect
        )}
      </div>
    </div>
  )
}

export default WorkflowDepartmentDropdown
