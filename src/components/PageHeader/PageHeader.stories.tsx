import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'

import PageHeader from '.'

type StoryProps = ComponentProps<typeof PageHeader>

const meta: Meta<StoryProps> = {
  component: PageHeader,
  title: 'Components/Page Header',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<StoryProps>

export const Default: Story = {
  args: {
    breadcrumbItems: [
      {
        title: <a href="">Application Center</a>,
      },
      {
        title: <a href="">Application List</a>,
      },
      {
        title: 'An Application',
      },
    ],
    pageTitle: 'An Application',
  },
}
