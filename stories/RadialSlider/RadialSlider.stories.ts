import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RadialSlider } from './RadialSlider';


const meta = {
    title: "Component/RadialSlider",
    component: RadialSlider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        minVal: {
            control: { type: 'number' },
            description: 'Minimum value'
        },
        maxVal: {
            control: { type: 'number' },
            description: 'Maximum value'
        },
        stepSize: {
            control: { type: 'number' },
            description: 'Step increment'
        },
        initVal: {
            control: { type: 'number' },
            description: 'Initial value'
        }
    },
} satisfies Meta<typeof RadialSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        minVal: 0,
        maxVal: 100,
        stepSize: 10,
        initVal: 20
    },
};

export const CustomRange: Story = {
    args: {
        minVal: 0,
        maxVal: 270,
        stepSize: 27,
        initVal: 135
    },
};

export const FineControl: Story = {
    args: {
        minVal: 0,
        maxVal: 100,
        stepSize: 1,
        initVal: 50
    },
};