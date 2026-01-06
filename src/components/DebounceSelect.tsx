import { useCallback, useEffect, useRef, useState } from 'react'

import { Select, SelectProps } from 'antd'
import { DefaultOptionType } from 'antd/es/select'

import debounce from 'lodash/debounce'

export interface DebounceSelectProps<ValueType extends DefaultOptionType = DefaultOptionType>
  extends Omit<SelectProps, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>
  debounceTimeout?: number
  defaultOptions?: ValueType[]
  forceOptions?: ValueType[]
  disableFilterOption?: boolean
}

export default function DebounceSelect<ValueType extends DefaultOptionType>({
  fetchOptions,
  debounceTimeout = 500,
  defaultOptions = [],
  forceOptions = [],
  disableFilterOption = false,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [options, setOptions] = useState(defaultOptions)
  const fetchRef = useRef(0)

  useEffect(() => {
    if (forceOptions.length > 0) {
      setOptions(forceOptions)
    }
  }, [forceOptions])

  useEffect(() => {
    if (defaultOptions.length > 0 && options.length === 0) {
      setOptions(defaultOptions)
    }
  }, [defaultOptions, options])

  const loadOptions = useCallback(
    (value: string) => {
      const fetchId = (fetchRef.current += 1)
      setOptions([])

      fetchOptions(value)
        .then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            return
          }
          setOptions(newOptions)
        })
        .catch((error) => {
          console.error('Error fetching options:', error)
          setOptions([]) // Reset to empty array or keep previous options depending on your needs
        })
    },
    [fetchOptions],
  )

  useEffect(() => {
    // NOTE: ไว้สำหรับเวลา fetchOptions เปลี่ยน คือมีการ fetch ใหม่แล้ว แต่ options ใหม่ไม่ถูก set เพราะ loadOptions ยังไม่ถูกเรียก
    // PS. ห้ามใส่ loadOptions ไปใน dependencies array เพราะจะทำให้เกิด infinite loop เราแค่อยากเรียก loadOptions เมื่อ fetchOptions เปลี่ยน
    loadOptions('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOptions])

  const debounceFetcher = debounce(loadOptions, debounceTimeout)

  return (
    <>
      <Select
        popupMatchSelectWidth={false}
        filterOption={
          disableFilterOption
            ? false
            : (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
        }
        onSearch={debounceFetcher}
        options={options}
        onFocus={() => {
          // Load initial options if none are loaded
          if (options.length === 0) {
            loadOptions('')
          }
        }}
        {...props}
      />
    </>
  )
}
