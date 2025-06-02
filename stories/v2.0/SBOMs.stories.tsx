import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "@app/AppLayout/AppLayout";
import { SBOMsPage } from "@app/SBOMs/SBOMsPage";

const meta = {
  title: "v2.0/SBOMs/SBOMs Page",
  component: SBOMsPage,
  decorators: [
    (Story) => (
        <AppLayout>
          <Story />
        </AppLayout>
    ),
  ],
} satisfies Meta<typeof SBOMsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
