import * as React from 'react';
import { Flex, FlexItem, Icon, Pagination } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { capitalizeFirstLetter } from '@app/utils/utils';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { TrustRootKind } from '../../data/TrustRoots.data';
import TrustRootNotFound from '../TrustRootNotFound';

export type TrustRootCertificateTabProps = {
  trustRoot?: TrustRootKind;
};

const TrustRootCertificateTab: React.FC<TrustRootCertificateTabProps> = ({ trustRoot }) => {
  return trustRoot ? (
    <>
      <Pagination itemCount={trustRoot.certificates.length} perPage={10} page={1} variant="top" />
      <Table variant="compact">
        <Thead>
          <Tr>
            <Th>Subject</Th>
            <Th>Issuer</Th>
            <Th>Type</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {trustRoot.certificates.map((cert, idx) => (
            <Tr key={idx}>
              <Td>{cert.subject}</Td>
              <Td>{cert.issuer}</Td>
              <Td>{cert.type}</Td>
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
      <Pagination itemCount={trustRoot.certificates.length} perPage={10} page={1} variant="bottom" />
    </>
  ) : (
    <TrustRootNotFound />
  );
};

export default TrustRootCertificateTab;
