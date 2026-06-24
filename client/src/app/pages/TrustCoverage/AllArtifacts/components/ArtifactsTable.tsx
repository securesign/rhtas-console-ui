import type { AllArtifactItem } from "@app/queries/mocks/trust-coverage.mock";
import { Label } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

interface Props {
  artifacts: AllArtifactItem[];
}

export default function ArtifactsTable({ artifacts }: Props) {
  return (
    <Table aria-label="All artifacts table">
      <Thead>
        <Tr>
          <Th>Artifact URI</Th>
          <Th>Environment</Th>
          <Th>Registry</Th>
          <Th>Status</Th>
          <Th>Last Seen</Th>
        </Tr>
      </Thead>
      <Tbody>
        {artifacts.map((artifact, index) => (
          <Tr key={index}>
            <Td dataLabel="Artifact URI">{artifact.uri}</Td>
            <Td dataLabel="Environment">
              <Label isCompact>{artifact.environment}</Label>
            </Td>
            <Td dataLabel="Registry">{artifact.registry}</Td>
            <Td dataLabel="Status">
              <Label isCompact color={artifact.status === "signed" ? "green" : "red"}>
                {artifact.status}
              </Label>
            </Td>
            <Td dataLabel="Last Seen">{artifact.lastSeen}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
