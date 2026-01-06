import { useCallback } from 'react'

import { Empty, Form, Skeleton } from 'antd'

import { useLazyListSectionQuery } from 'api/employeeApi'

import DebounceSelect from './DebounceSelect'

type Props = {
  siteCode?: string | null
  formName?: string
  formLabel?: string
}

const SearchSectionDropdown = ({ siteCode, formName, formLabel }: Props) => {
  const [triggerGetSections, { data = [], currentData, isFetching }] = useLazyListSectionQuery()

  const fetchSectionOptions = useCallback(
    async (searchText: string) => {
      try {
        if (searchText === '' && !siteCode) {
          return []
        }

        const result = await triggerGetSections({
          siteCode: siteCode ?? undefined,
          alternativeName: searchText,
          page: 0,
          sizePerPage: 100,
        }).unwrap()

        return result.map((section) => ({
          ...section,
          value: section.id,
          label: section.name + ' - ' + section.alternativeName,
        }))
      } catch (error) {
        console.error('Error fetching section options:', error)
        return []
      }
    },
    [triggerGetSections, siteCode],
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
          <Form.Item label={formLabel} name={formName}>
            {sectionSelect}
          </Form.Item>
        ) : (
          sectionSelect
        )}
      </div>
    </div>
  )
}

export default SearchSectionDropdown
