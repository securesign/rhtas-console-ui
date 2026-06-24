import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useFetchAllArtifacts } from "@app/queries/trust-coverage";
import { Breadcrumb, BreadcrumbItem, Content, PageSection } from "@patternfly/react-core";
import { useState } from "react";
import EnvironmentSelect from "../shared/components/EnvironmentSelect";
import ArtifactsTable from "./components/ArtifactsTable";
import { Link } from "react-router-dom";
import { Paths } from "@app/Routes";

export function AllArtifacts() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all");
  const { data, isFetching, fetchError } = useFetchAllArtifacts(
    selectedEnvironment === "all" ? undefined : selectedEnvironment
  );

  const environments = data
    ? [...new Set(data.map((item) => item.environment))]
    : [...(selectedEnvironment === "all" ? [] : [selectedEnvironment])];

  return (
    <>
      <DocumentMetadata title="Trust Coverage" />
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={Paths.trustCoverage}>Trust Coverage</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>All Artifacts</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection variant="default">
        <Content>
          <Content component="h1">All artifacts</Content>
          <Content component="p">{data?.length ?? 0} artifacts tracked.</Content>
        </Content>
      </PageSection>
      <PageSection>
        <EnvironmentSelect
          selectedEnvironment={selectedEnvironment}
          setSelectedEnvironment={setSelectedEnvironment}
          environments={environments}
        />
      </PageSection>
      <PageSection>
        <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
          {data && <ArtifactsTable artifacts={data} />}
        </LoadingWrapper>
      </PageSection>
    </>
  );
}
