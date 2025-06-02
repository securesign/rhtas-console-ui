import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "@app/AppLayout/AppLayout";
import { PackagesPage } from "@app/Packages/PackagesPage";

const meta = {
  title: "v2.0/Packages/Packages Page",
  component: PackagesPage,
  decorators: [
    (Story) => (
        <AppLayout>
          <Story />
        </AppLayout>
    ),
  ],
} satisfies Meta<typeof PackagesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
