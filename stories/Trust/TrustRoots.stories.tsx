import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TrustRootsPage } from '@app/Trust/TrustRoots/TrustRootsPage';

const meta = {
  title: 'Trust/Trust Roots Page',
  component: TrustRootsPage,
} satisfies Meta<typeof TrustRootsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
