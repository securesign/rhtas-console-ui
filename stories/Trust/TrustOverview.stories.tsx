import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TrustOverview } from '@app/Trust/Overview/TrustOverview';

const meta = {
  title: 'Trust/Trust Overview',
  component: TrustOverview,
} satisfies Meta<typeof TrustOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
