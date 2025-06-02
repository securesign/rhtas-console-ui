import { AppLayout } from '@app/AppLayout/AppLayout';
import { ImportersPage } from '@app/Importers/ImportersPage';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'v2.1/Importers/Importers Page',
  component: ImportersPage,
  decorators: [
    (Story) => (
      <AppLayout>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof ImportersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
