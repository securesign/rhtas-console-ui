import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { TrustOverview } from '@app/Trust/Overview/TrustOverview';

const meta = {
  title: 'Trust/Trust Overview',
  component: TrustOverview,
  decorators: [
    (Story) => (
      <AppLayout openSidebar={false}>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof TrustOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
