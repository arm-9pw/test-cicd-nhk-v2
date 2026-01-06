import StackedBarChart from '.'

import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'

type StoryProps = ComponentProps<typeof StackedBarChart>

const meta: Meta<StoryProps> = {
  component: StackedBarChart,
  title: 'Components/Stacked Bar Chart',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<StoryProps>

export const Default: Story = {}
