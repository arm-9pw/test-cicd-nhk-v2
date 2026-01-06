import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'

// import { BarChartOutlined, InfoCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'

type StoryProps = ComponentProps<typeof Button>

const meta: Meta<StoryProps> = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<StoryProps>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Primary: Story = {
  args: {
    children: 'Button',
    type: 'primary',
  },
}
