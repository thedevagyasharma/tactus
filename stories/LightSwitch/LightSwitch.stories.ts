import type { Meta, StoryObj } from '@storybook/react';
import { LightSwitch } from './LightSwitch';

const meta: Meta<typeof LightSwitch> = {
  title: 'Component/LightSwitch',
  component: LightSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    
  },
};

export default meta;
type Story = StoryObj<typeof LightSwitch>;

export const Default: Story = {
  args: {

  },
};
