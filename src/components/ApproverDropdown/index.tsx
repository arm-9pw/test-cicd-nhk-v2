import React, { useMemo } from 'react'

import { UserOutlined } from '@ant-design/icons'
import { Avatar, Select, SelectProps, Spin, Typography } from 'antd'

import styles from './styles.module.css'
import ManMockAvatar from 'assets/images/man_profile.png'
import WomanMockAvatar from 'assets/images/woman_profile.png'

import { useGetApproverHierarchyQuery } from 'api/approvalApi'
import { ApproverHierarchyItem } from 'api/approvalApi.types'

import { GENDER } from 'constants/index'
import { getGenderByName } from 'utils/generalHelpers'

const { Text } = Typography

export interface ApproverOption extends ApproverHierarchyItem {
  value: string
  label: string
}

interface ApproverDropdownProps extends Omit<SelectProps<string>, 'options' | 'onChange'> {
  positionId: string
  value?: string
  onChange?: (value: string, option: ApproverHierarchyItem) => void
  placeholder?: string
  loading?: boolean
}

const ApproverDropdown: React.FC<ApproverDropdownProps> = ({
  positionId,
  value,
  onChange,
  placeholder = 'Select approver',
  loading: propLoading,
  ...restProps
}) => {
  // Fetch approver hierarchy data from API
  const { data: approverHierarchy, isLoading: isApiLoading } = useGetApproverHierarchyQuery({
    positionId,
  })

  // Determine if loading (either from props or API)
  const isLoading = propLoading || isApiLoading

  // Convert API data to options format
  const apiOptions = useMemo(() => {
    if (!approverHierarchy) return []

    return approverHierarchy.map((approver) => ({
      data: approver,
      value: approver.primaryApproverId,
      label: approver.primaryApproverName,
    }))
  }, [approverHierarchy])

  // Find the selected approver option based on value
  const findApproverOption = (value: string): ApproverHierarchyItem | undefined => {
    const option = apiOptions.find((option) => option.value === value)
    return option?.data
  }

  // Custom onChange handler to pass the entire option object
  const handleChange = (value: string) => {
    if (onChange) {
      const selectedOption = findApproverOption(value)
      if (selectedOption) {
        onChange(value, selectedOption)
      }
    }
  }

  return (
    <Select
      variant="filled"
      popupMatchSelectWidth={false}
      className={styles['approver-dropdown']}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      loading={isLoading}
      notFoundContent={isLoading ? <Spin size="small" /> : 'No approvers found'}
      optionLabelProp="label"
      {...restProps}
    >
      {apiOptions.map((option) => {
        return (
          <Select.Option
            key={option.data.primaryApproverId}
            value={option.value}
            label={option.label}
            className={styles['approver-option']}
          >
            <div className={styles['option-container']}>
              <div>
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={
                    getGenderByName(option?.data?.primaryApproverName || '') === GENDER.FEMALE
                      ? WomanMockAvatar
                      : ManMockAvatar
                  }
                />
              </div>
              <div className={styles['option-description']}>
                <Text>{option.data.primaryApproverName}</Text>
                <Text type="secondary">{option.data.primaryApproverPosName}</Text>
                <Text type="secondary">{option.data.primaryApproverSectionName}</Text>
              </div>
            </div>
          </Select.Option>
        )
      })}
    </Select>
  )
}

export default ApproverDropdown
