import { useCallback, useMemo } from 'react'

import { AutoComplete, Form, FormInstance, Skeleton, Typography } from 'antd'

import { useLazyGetMsItemsQuery } from 'api/masterApi'
import { MsItemType } from 'api/masterApi.types'

import debounce from 'lodash/debounce'

const { Text } = Typography

const PAGE_SIZE = 50

type SearchItemDropdownProps = {
  isDisabledAllForm?: boolean
  form: FormInstance
  inputName: string
}

const SearchItemDropdown = ({
  isDisabledAllForm = false,
  inputName,
  form,
}: SearchItemDropdownProps) => {
  const [triggerGetItems, { data: items, isLoading, isFetching, isError }] =
    useLazyGetMsItemsQuery()

  const name = Form.useWatch('name', form)
  const model = Form.useWatch('model', form)
  const brand = Form.useWatch('brand', form)
  const matCode = Form.useWatch('matCode', form)

  const isItemSelected = !!matCode && !matCode.includes('DUMMY')
  const isDisabled = isDisabledAllForm || (inputName !== 'name' && isItemSelected)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const searchParams: Record<string, string | number> = {
          [inputName]: value,
        }

        if (inputName !== 'name' && name) {
          searchParams.name = name
        }
        if (inputName !== 'model' && model) {
          searchParams.model = model
        }
        if (inputName !== 'brand' && brand) {
          searchParams.brand = brand
        }

        searchParams.page = 0
        searchParams.sizePerPage = PAGE_SIZE

        triggerGetItems(searchParams)
      }, 300),
    [triggerGetItems, name, model, brand, inputName],
  )

  const getLabel = useCallback(
    (item: MsItemType) => {
      if (inputName === 'name') {
        return `${item.name}${item.brand ? ', Brand ' + item.brand : ''}${item.model ? ', Model ' + item.model : ''}${item.detail ? ', Detail ' + item.detail : ''}`
      }
      if (inputName === 'brand') {
        return `${item.brand ? ', Brand ' + item.brand : ''}${item.model ? ', Model ' + item.model : ''}${item.detail ? ', Detail ' + item.detail : ''}`
      }
      if (inputName === 'model') {
        return `${item.model ? ', Model ' + item.model : ''}${item.detail ? ', Detail ' + item.detail : ''}`
      }

      return item[inputName as keyof MsItemType]
    },
    [inputName],
  )

  const options = useMemo(
    () =>
      items?.map((item) => ({
        ...item,
        key: item.id,
        value: item[inputName as keyof MsItemType] + item.id, // NOTE: ต้องเพิ่ม id เพื่อป้องกันการซ้ำ ของชื่อ พอมันซ้ำแล้วเลือกมันไม่อัพเดท แล้วไป set ค่าที่ onSelectName แทน
        // label: item[inputName as keyof MsItemType],
        label: getLabel(item),
      })) || [],
    [items, inputName, getLabel],
  )

  const onSelectName = (option: {
    key: string
    value: string | number | null
    label: string | number | null
    name: string
    model: string
    brand: string
    detail: string
    qty: number
    unit: string
    unitPrice: number
    id: string
    matCode: string | null
  }) => {
    if (inputName === 'name') {
      form.setFieldsValue({
        name: option.name,
        brand: option.brand,
        model: option.model,
        detail: option.detail,
        unit: option.unit,
        unitPrice: option.unitPrice,
      })
      form.setFieldsValue({
        matCode: option.matCode,
      })
    } else {
      form.setFieldValue(inputName, option[inputName as keyof MsItemType])
    }
  }

  return (
    <Form form={form} disabled={isDisabled}>
      <Form.Item
        name={inputName}
        rules={[{ required: inputName === 'name', message: `Please input ${inputName}` }]}
        style={{ margin: 0 }}
      >
        <AutoComplete
          popupMatchSelectWidth={500}
          placeholder=""
          options={options}
          onSearch={debouncedSearch}
          onFocus={() =>
            triggerGetItems({
              page: 0,
              sizePerPage: PAGE_SIZE,
            })
          }
          onInputKeyDown={() => {
            if (!matCode.includes('DUMMY')) {
              form.setFieldsValue({ matCode: null })
            }
          }}
          onSelect={(_, option) => onSelectName(option)}
          notFoundContent={<div> Not Found/ไม่พบที่ค้นหา </div>}
          style={{ width: '100%' }}
          dropdownRender={(menu) => {
            if (isError) {
              return (
                <div style={{ padding: '8px' }}>
                  <Text type="secondary">
                    An error occurred while searching for data. Please try again...
                  </Text>
                </div>
              )
            }
            if (isFetching || isLoading) {
              return <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
            }
            return menu
          }}
          filterOption={(inputValue, option) =>
            String(option?.label).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>
    </Form>
  )
}

export default SearchItemDropdown
