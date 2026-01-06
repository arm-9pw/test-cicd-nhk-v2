import { useMemo } from 'react'
import { Empty, Form, Select, Skeleton } from 'antd'

import { useGetListSectionQuery } from 'api/enquiryApi'

type Props = {
  siteCode?: string | null
  formName?: string
  formLabel?: string
}

const SearchSectionDropdown = ({ siteCode, formName, formLabel }: Props) => {
  const {
    data = [],
    isFetching,
    isLoading,
  } = useGetListSectionQuery(
    { siteCode: siteCode ?? undefined, alternativeName: '', page: 0, sizePerPage: 100 },
    { skip: !siteCode }
  )

  const sectionOptions = useMemo(() => {
    return data
      .filter((item) => item.structureLevel === 'แผนก')
      .map((section) => ({
        value: section.id,
        label: `${section.name}${section.alternativeName ? ' - ' + section.alternativeName : ''}`,
      }))
  }, [data])

  const renderDropdownContent = () => {
    if (isFetching || isLoading) {
      return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    }
    if (!sectionOptions.length) {
      return <Empty description="ไม่พบข้อมูล" />
    }
    return null
  }

  const sectionSelect = (
    <Select
      showSearch
      allowClear
      placeholder="< กรุณาเลือก Section >"
      options={sectionOptions}
      loading={isFetching || isLoading}
      notFoundContent={renderDropdownContent()}
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
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