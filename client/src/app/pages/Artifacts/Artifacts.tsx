import { Fragment, useRef, useState, type FormEvent } from "react";
import {
  Button,
  Content,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormGroupLabelHelp,
  PageSection,
  Popover,
  SearchInput,
} from "@patternfly/react-core";
import { useFetchArtifactsImageData } from "@app/queries/artifacts";
import { LoadingWrapper } from "@app/components/LoadingWrapper";

const DEFAULT_URI = "docker.io/library/nginx:latest";

export const Artifacts = () => {
  // show default by default, but always prefer user input once they submit
  const [artifactUri, setArtifactUri] = useState<string>(DEFAULT_URI);
  const [searchInput, setSearchInput] = useState<string>(DEFAULT_URI);
  const labelHelpRef = useRef(null);

  const {
    artifact,
    isFetching: isFetchingArtifactMetadata,
    fetchError: fetchErrorArtifactMetadata,
  } = useFetchArtifactsImageData({ uri: artifactUri });

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    console.log("Submitted");
    setArtifactUri(searchInput.trim());
  };

  const handleUriChange = (_event: FormEvent, uri: string) => {
    setSearchInput(uri);
  };

  return (
    <Fragment>
      <PageSection variant="default">
        <Content>
          <h1>Artifacts</h1>
          <p>Search for an artifact.</p>
        </Content>
      </PageSection>
      <PageSection>
        <Form onSubmit={handleSubmit}>
          <Flex>
            <Flex direction={{ default: "column" }} flex={{ default: "flex_3" }}>
              <FlexItem>
                <FormGroup
                  label="URI"
                  labelHelp={
                    <Popover
                      triggerRef={labelHelpRef}
                      headerContent={<div>URI of the container image</div>}
                      bodyContent={<div>e.g., {DEFAULT_URI}</div>}
                    >
                      <FormGroupLabelHelp ref={labelHelpRef} aria-label="More info for URI field" />
                    </Popover>
                  }
                  isRequired
                  fieldId="uri"
                >
                  <SearchInput
                    type="text"
                    id="uri"
                    name="uri"
                    aria-describedby="uri-helper"
                    value={searchInput}
                    onChange={handleUriChange}
                    placeholder={DEFAULT_URI}
                  />
                </FormGroup>
              </FlexItem>
            </Flex>
            <Flex
              direction={{ default: "column" }}
              alignSelf={{ default: "alignSelfFlexStart" }}
              flex={{ default: "flex_1" }}
            >
              <FlexItem style={{ marginTop: "2em" }}>
                <Button
                  variant="primary"
                  id="search-form-button"
                  isBlock={true}
                  type="submit"
                  spinnerAriaLabel="Loading"
                  spinnerAriaLabelledBy="search-form-button"
                >
                  Search
                </Button>
              </FlexItem>
            </Flex>
          </Flex>
        </Form>
      </PageSection>
      <PageSection>
        <div style={{ marginBottom: 8 }}>
          <b>Current query:</b> <code>{artifactUri}</code>
        </div>
        <LoadingWrapper isFetching={isFetchingArtifactMetadata} fetchError={fetchErrorArtifactMetadata}>
          {artifact && <div>Artifact Digest: {artifact.digest}</div>}
        </LoadingWrapper>
      </PageSection>
    </Fragment>
  );
};
