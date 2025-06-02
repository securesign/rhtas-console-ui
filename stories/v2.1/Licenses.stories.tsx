import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "@app/AppLayout/AppLayout";
import { LicensesPage } from "@app/Licenses/LicensesPage";

const meta = {
  title: "v2.1/Licenses/Licenses Page",
  component: LicensesPage,
  decorators: [
    (Story) => (
        <AppLayout>
          <Story />
        </AppLayout>
    ),
  ],
} satisfies Meta<typeof LicensesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
