import { Fragment } from 'react';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Flex,
  FlexItem,
  Icon,
  PageSection,
  Pagination,
  Popover,
  Tab,
  Tabs,
  TabTitleText,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { exampleTrustRoot } from '../TrustRoots.data';
import { capitalizeFirstLetter, formatDate } from '@app/utils/utils';
import { ExclamationTriangleIcon, PlusCircleIcon } from '@patternfly/react-icons';

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
          <PageSection>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>ID</div>} bodyContent={<div>Additional info</div>}>
                    <DescriptionListTermHelpTextButton> ID </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>{exampleTrustRoot.id}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>Source</div>} bodyContent={<div>Additional source info</div>}>
                    <DescriptionListTermHelpTextButton> Source </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <a href="#">{exampleTrustRoot.source}</a>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>Policy URL</div>} bodyContent={<div>Additional info</div>}>
                    <DescriptionListTermHelpTextButton> Policy URL </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>{exampleTrustRoot.policyUrl}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>Last Updated</div>} bodyContent={<div>Additional info</div>}>
                    <DescriptionListTermHelpTextButton> Last Updated </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>{formatDate(exampleTrustRoot.lastUpdated)}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>Type</div>} bodyContent={<div>Additional info</div>}>
                    <DescriptionListTermHelpTextButton> Type </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <Button variant="link" isInline icon={<PlusCircleIcon />}>
                    {exampleTrustRoot.type}
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>Certificates</div>} bodyContent={<div>Additional info</div>}>
                    <DescriptionListTermHelpTextButton> Certificates </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {exampleTrustRoot.certificates.length} Certificate(s)
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>TUF Metadata</div>} bodyContent={<div>Additional info</div>}>
                    <DescriptionListTermHelpTextButton> TUF Metadata </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {exampleTrustRoot.tufMetadata.length} Metadata File(s)
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export { TrustRootsDrawerContent };
