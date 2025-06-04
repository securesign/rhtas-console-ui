/** @type { import('@storybook/react-webpack5').Preview } */
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import { MemoryRouter } from 'react-router';
import { AppLayout } from '../src/app/AppLayout/AppLayout';

const preview = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <AppLayout openSidebar={false}>
          <Story />
        </AppLayout>
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Trust', 'Dashboard'],
      },
    },
  },
};

export default preview;
