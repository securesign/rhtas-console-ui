import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "@app/AppLayout/AppLayout";
import { UploadPage } from "@app/Upload/UploadPage";

const meta = {
  title: "v2.0/Upload/Upload Page",
  component: UploadPage,
  decorators: [
    (Story) => (
        <AppLayout>
          <Story />
        </AppLayout>
    ),
  ],
} satisfies Meta<typeof UploadPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {};
