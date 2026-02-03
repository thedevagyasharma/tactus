import type { Meta, StoryObj } from '@storybook/react';
import { PushButton } from './PushButton';

const meta: Meta<typeof PushButton> = {
  title: 'Component/PushButton',
  component: PushButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    
  },
};

export default meta;
type Story = StoryObj<typeof PushButton>;

export const Default: Story = {
  args: {

  },
};
