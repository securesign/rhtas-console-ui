import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { TrustRootsPage } from '@app/Trust/TrustRoots/TrustRootsPage';

const meta = {
  title: 'Trust/Trust Roots Page',
  component: TrustRootsPage,
  decorators: [
    (Story) => (
      <AppLayout openSidebar={false}>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof TrustRootsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
