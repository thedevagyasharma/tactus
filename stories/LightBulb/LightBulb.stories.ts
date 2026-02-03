import type { Meta, StoryObj } from '@storybook/react';
import { LightBulb } from './LightBulb';

const meta: Meta<typeof LightBulb> = {
  title: 'Component/LightBulb',
  component: LightBulb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    
  },
};

export default meta;
type Story = StoryObj<typeof LightBulb>;

export const Default: Story = {
  args: {

  },
};
