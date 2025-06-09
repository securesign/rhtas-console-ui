import { Fragment } from 'react';
import { Flex, FlexItem, Icon, Pagination, Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { exampleTrustRoot } from '../TrustRoots.data';
import { capitalizeFirstLetter, formatDate } from '@app/utils/utils';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const TrustRootsDrawerContent = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey={0} aria-label="Trust roots tabs" role="region">
        <Tab eventKey={0} title={<TabTitleText>Metadata</TabTitleText>} aria-label="Metadata">
          <Pagination itemCount={exampleTrustRoot.tufMetadata.length} perPage={10} page={1} variant="top" />
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Role</Th>
                <Th>Version</Th>
                <Th>Expires</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {exampleTrustRoot.tufMetadata.map((metadata, idx) => (
                <Tr key={idx}>
                  <Td>{capitalizeFirstLetter(metadata.role)}</Td>
                  <Td>{metadata.version}</Td>
                  <Td>{formatDate(metadata.expires)}</Td>
                  <Td>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        {metadata.status === 'valid' ? (
                          <Icon status="success">
                            <CheckCircleIcon />
                          </Icon>
                        ) : (
                          <Icon status="warning">
                            <ExclamationTriangleIcon />
                          </Icon>
                        )}{' '}
                        {capitalizeFirstLetter(metadata.status)}
                      </FlexItem>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination itemCount={exampleTrustRoot.tufMetadata.length} perPage={10} page={1} variant="bottom" />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Certificates</TabTitleText>} aria-label="Certificates">
          <Pagination itemCount={exampleTrustRoot.certificates.length} perPage={10} page={1} variant="top" />
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>Subject</Th>
                <Th>Issuer</Th>
                <Th>Type</Th>
                <Th>Role</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {exampleTrustRoot.certificates.map((cert, idx) => (
                <Tr key={idx}>
                  <Td>{cert.subject}</Td>
                  <Td>{cert.issuer}</Td>
                  <Td>{cert.type}</Td>
                  <Td>{cert.role ? capitalizeFirstLetter(cert.role) : null}</Td>
                  <Td>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        {cert.status === 'valid' ? (
                          <Icon status="success">
                            <CheckCircleIcon />
                          </Icon>
                        ) : (
                          <Icon status="warning">
                            <ExclamationTriangleIcon />
                          </Icon>
                        )}{' '}
                        {capitalizeFirstLetter(cert.status)}
                      </FlexItem>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination itemCount={exampleTrustRoot.certificates.length} perPage={10} page={1} variant="bottom" />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Info</TabTitleText>}>
          More info about the Trust Root
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export { TrustRootsDrawerContent };
