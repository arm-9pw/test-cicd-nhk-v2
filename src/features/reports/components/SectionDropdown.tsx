import { useCallback } from 'react'

import { Empty, Form, Skeleton } from 'antd'
import { Rule } from 'antd/es/form'

import { useLazyListSectionQuery } from 'api/employeeApi'

import DebounceSelect from 'components/DebounceSelect'

type Props = {
  siteCode?: string | null
  formName?: string
  formLabel?: string
  includeAllOption?: boolean
  rules?: Rule[]
}

const SectionDropdown: React.FC<Props> = ({
  siteCode,
  formName,
  formLabel,
  includeAllOption = false,
  rules,
}) => {
  const [triggerGetSections, { data = [], currentData, isFetching }] = useLazyListSectionQuery()

  const fetchSectionOptions = useCallback(
    async (searchText: string) => {
      try {
        if (searchText === '' && !siteCode) {
          return [
            {
              value: 'ALL',
              label: 'All / เลือกทั้งหมด',
              code: '',
              name: '',
              alternativeName: '',
              structureLevel: '',
              siteCode: '',
              parentCode: '',
              costCenter: null,
              id: 'ALL',
            },
          ]
        }

        const result = await triggerGetSections({
          siteCode: siteCode ?? undefined,
          alternativeName: searchText,
          page: 0,
          sizePerPage: 100,
        }).unwrap()

        let options = result.map((section) => ({
          ...section,
          value: section.id,
          label: section.name + ' - ' + section.alternativeName,
        }))
        if (includeAllOption) {
          options = [
            {
              value: 'ALL',
              label: 'All / เลือกทั้งหมด',
              code: '',
              name: '',
              alternativeName: '',
              structureLevel: '',
              siteCode: '',
              parentCode: '',
              costCenter: null,
              id: 'ALL',
            },
            ...options,
          ]
        }

        return options
      } catch (error) {
        console.error('Error fetching section options:', error)
        return []
      }
    },
    [triggerGetSections, siteCode, includeAllOption],
  )

  const renderDropdownContent = () => {
    if (data.length === 0 && !currentData) {
      return <Empty description="กรุณาพิมพ์เพื่อค้นหา" />
    }
    if (isFetching) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
  }

  const sectionSelect = (
    <DebounceSelect
      showSearch
      allowClear
      disableFilterOption
      placeholder="< กรุณาเลือก/ค้นหา >"
      fetchOptions={fetchSectionOptions}
      notFoundContent={renderDropdownContent()}
    />
  )

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '80%', flex: 1, marginRight: '4px' }}>
        {formName ? (
          <Form.Item label={formLabel} name={formName} rules={rules}>
            {sectionSelect}
          </Form.Item>
        ) : (
          sectionSelect
        )}
      </div>
    </div>
  )
}

export default SectionDropdown
