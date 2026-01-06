import ContentCard from '.'

import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'

import { BarChartOutlined, InfoCircleFilled } from '@ant-design/icons'

type StoryProps = ComponentProps<typeof ContentCard>

const meta: Meta<StoryProps> = {
  component: ContentCard,
  title: 'Components/Content Card',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<StoryProps>

export const Default: Story = {
  args: {
    title: 'Content Card',
    titlePreIcon: <BarChartOutlined />,
    titlePostIcon: <InfoCircleFilled />,
    extra: <div>Extra</div>,
    style: { width: 300 },
    children: <div>Content</div>,
  },
}
