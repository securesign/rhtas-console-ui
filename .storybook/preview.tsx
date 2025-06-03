/** @type { import('@storybook/react-webpack5').Preview } */
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import { MemoryRouter } from 'react-router';
import React from 'react';

const preview = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
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
        order: [
          'Dashboard',
          'Search',
          'SBOMs',
          'Vulnerabilities',
          'Packages',
          'Advisories',
          'Importers',
          'Upload',
          'v2.1',
        ],
      },
    },
  },
};

export default preview;
