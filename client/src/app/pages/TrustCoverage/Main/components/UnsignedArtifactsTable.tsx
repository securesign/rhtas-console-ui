import { useState } from "react";

import { Card, CardBody, CardTitle, Label, ToggleGroup, ToggleGroupItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import { useFetchUnsignedArtifacts } from "@app/queries/trust-coverage";
import { LoadingWrapper } from "@app/components/LoadingWrapper";

interface Props {
  environments: string[];
}

export default function UnsignedArtifactsTable({ environments }: Props) {
  const tabs = ["All", ...environments];
  const [selectedTab, setSelectedTab] = useState("All");

  const { data, isFetching, fetchError } = useFetchUnsignedArtifacts(selectedTab === "All" ? undefined : selectedTab);

  const filteredData = selectedTab === "All" ? (data ?? []) : (data ?? []).filter((a) => a.environment === selectedTab);

  return (
    <Card>
      <CardTitle>Unsigned Artifacts</CardTitle>
      <CardBody>
        <ToggleGroup aria-label="Filter by environment">
          {tabs.map((tab) => (
            <ToggleGroupItem
              key={tab}
              text={tab}
              buttonId={`toggle-${tab}`}
              isSelected={selectedTab === tab}
              onChange={() => setSelectedTab(tab)}
            />
          ))}
        </ToggleGroup>
        <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
          <Table aria-label="Unsigned artifacts table">
            <Thead>
              <Tr>
                <Th>Artifact URI</Th>
                <Th>Environment</Th>
                <Th>Registry</Th>
                <Th>Last Seen</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((artifact, index) => (
                <Tr key={index}>
                  <Td dataLabel="Artifact URI">{artifact.uri}</Td>
                  <Td dataLabel="Environment">
                    <Label isCompact>{artifact.environment}</Label>
                  </Td>
                  <Td dataLabel="Registry">{artifact.registry}</Td>
                  <Td dataLabel="Last Seen">{artifact.lastSeen}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </LoadingWrapper>
      </CardBody>
    </Card>
  );
}
