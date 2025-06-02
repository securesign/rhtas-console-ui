import { Fragment } from 'react';

import { Flex, FlexItem, Icon, Pagination, Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

const TrustRootsDrawerContent = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey={0} aria-label="Tabs in the uncontrolled example" role="region">
        <Tab eventKey={0} title={<TabTitleText>Executions</TabTitleText>} aria-label="Uncontrolled ref content - users">
          <Pagination itemCount={523} perPage={10} page={1} variant="top" />
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Started</Th>
                <Th>Finished</Th>
                <Th>Documents</Th>
                <Th>Status</Th>
                <Th>Duration</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...Array(10).keys()].map((item) => (
                <Tr key={item}>
                  <Td>5 April, 2025 12:12:00</Td>
                  <Td>5 April, 2025 12:12:00</Td>
                  <Td>123456</Td>
                  <Td>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Icon status="success">
                          <CheckCircleIcon />
                        </Icon>{' '}
                        Success
                      </FlexItem>
                    </Flex>
                  </Td>
                  <Td>Time remaining: 3 hours</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination itemCount={523} perPage={10} page={1} variant="bottom" />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Info</TabTitleText>}>
          More info about the Data Source
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export { TrustRootsDrawerContent };
