import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { CertificatesPage } from '@app/Trust/Certificates/CertificatesPage';

const meta = {
  title: 'Trust/Certificates Page',
  component: CertificatesPage,
  decorators: [
    (Story) => (
      <AppLayout openSidebar={false}>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof CertificatesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
