import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleButton } from './ToggleButton';

const meta = {
    title: "Component/ToggleButton",
    component: ToggleButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        label: {type: 'string'}
    }
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Toggle',
    }
}