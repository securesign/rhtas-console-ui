/** @type { import('@storybook/react-webpack5').Preview } */
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import { MemoryRouter } from 'react-router';
import { AppLayout } from '../src/app/AppLayout/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswDecorator } from 'msw-storybook-addon';

initialize();

const preview = {
  decorators: [
    mswDecorator,
    (Story) => {
      const queryClient = new QueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <AppLayout openSidebar={false}>
              <Story />
            </AppLayout>
          </MemoryRouter>
        </QueryClientProvider>
      );
    },
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
