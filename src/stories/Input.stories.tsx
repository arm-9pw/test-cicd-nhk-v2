import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Input } from 'antd'

type StoryProps = ComponentProps<typeof Input>

const meta: Meta<StoryProps> = {
  component: Input,
  title: 'Components/Input',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<StoryProps>

export const Default: Story = {
  args: {
    placeholder: 'Basic usage',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    prefix: <ExclamationCircleOutlined />,
    placeholder: 'Error State',
    status: 'error',
  },
}

export const Warning: Story = {
  args: {
    prefix: <ExclamationCircleOutlined />,
    placeholder: 'Warning State',
    status: 'warning',
  },
}
