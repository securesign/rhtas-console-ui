import * as React from 'react';
import { Flex, FlexItem, Icon, Pagination } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { capitalizeFirstLetter, formatDate } from '@app/utils/utils';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { TrustRootKind } from '../../data/TrustRoots.data';
import TrustRootNotFound from '../TrustRootNotFound';

export type TrustRootMetadataTabProps = {
  trustRoot?: TrustRootKind;
};

const TrustRootMetadataTab: React.FC<TrustRootMetadataTabProps> = ({ trustRoot }) => {
  return trustRoot ? (
    <>
      <Pagination itemCount={trustRoot.tufMetadata.length} perPage={10} page={1} variant="top" />
      <Table variant="compact">
        <Thead>
          <Tr>
            <Th>Version</Th>
            <Th>Expires</Th>
            <Th>Role</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {trustRoot.tufMetadata.map((metadata, idx) => (
            <Tr key={idx}>
              <Td>{metadata.version}</Td>
              <Td>{formatDate(metadata.expires)}</Td>
              <Td>{metadata.role}</Td>
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
      <Pagination itemCount={trustRoot.tufMetadata.length} perPage={10} page={1} variant="bottom" />
    </>
  ) : (
    <TrustRootNotFound />
  );
};

export default TrustRootMetadataTab;
