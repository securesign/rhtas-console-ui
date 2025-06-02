import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "@app/AppLayout/AppLayout";
import { VulnerabilitiesPage } from "@app/Vulnerabilities/VulnerabilitiesPage";

const meta = {
  title: "v2.0/Vulnerabilities/Vulnerabilities Page",
  component: VulnerabilitiesPage,
  decorators: [
    (Story) => (
        <AppLayout>
          <Story />
        </AppLayout>
    ),
  ],
} satisfies Meta<typeof VulnerabilitiesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
