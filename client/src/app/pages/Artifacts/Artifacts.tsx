import { Fragment, useRef, useState } from "react";
import {
  Button,
  Content,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormGroupLabelHelp,
  FormHelperText,
  HelperText,
  HelperTextItem,
  PageSection,
  Popover,
  TextInput,
} from "@patternfly/react-core";
import { useFetchArtifactsImageData } from "@app/queries/artifacts";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { ArtifactResults } from "./components/ArtifactResults";
import { Controller, useForm } from "react-hook-form";

import { ExclamationCircleIcon } from "@patternfly/react-icons";

const PLACEHOLDER_URI = "docker.io/library/nginx:latest";

interface FormInputs {
  searchInput: string;
}

export const Artifacts = () => {
  const [artifactUri, setArtifactUri] = useState<string | null>(null);
  const labelHelpRef = useRef(null);

  const {
    artifact,
    isFetching: isFetchingArtifactMetadata,
    fetchError: fetchErrorArtifactMetadata,
  } = useFetchArtifactsImageData({ uri: artifactUri });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      searchInput: "",
    },
  });

  const onSubmit = (data: FormInputs) => {
    const uri = data.searchInput?.trim();
    if (!uri) return;
    setArtifactUri(uri);
  };

  const query = watch("searchInput");
  const isEmpty = query.trim().length === 0;

  return (
    <Fragment>
      <PageSection variant="default">
        <Content>
          <h1>Artifacts</h1>
          <p>Search for an artifact.</p>
        </Content>
      </PageSection>
      <PageSection>
        <Form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Flex>
            <Flex direction={{ default: "column" }} flex={{ default: "flex_3" }}>
              <FlexItem>
                <Controller
                  name="searchInput"
                  control={control}
                  rules={{ required: { value: true, message: "A value is required" } }}
                  render={({ field, fieldState }) => (
                    <FormGroup
                      label="URI"
                      labelHelp={
                        <Popover
                          triggerRef={labelHelpRef}
                          headerContent={<div>URI of the container image</div>}
                          bodyContent={<div>e.g., {PLACEHOLDER_URI}</div>}
                        >
                          <FormGroupLabelHelp ref={labelHelpRef} aria-label="More info for URI field" />
                        </Popover>
                      }
                      isRequired
                      fieldId="uri"
                    >
                      <TextInput
                        aria-label={`uri input field`}
                        {...field}
                        type="text"
                        name="searchInput"
                        id="uri"
                        aria-describedby="uri-helper"
                        aria-invalid={errors.searchInput ? "true" : "false"}
                        placeholder={PLACEHOLDER_URI}
                        validated={fieldState.invalid ? "error" : "default"}
                      />
                      {fieldState.invalid && (
                        <FormHelperText>
                          <HelperText>
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant={"error"}>
                              {fieldState.invalid ? fieldState.error?.message : <span>A value is required</span>}
                            </HelperTextItem>
                          </HelperText>
                        </FormHelperText>
                      )}
                    </FormGroup>
                  )}
                ></Controller>
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
                  isDisabled={isEmpty}
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
        <LoadingWrapper isFetching={isFetchingArtifactMetadata} fetchError={fetchErrorArtifactMetadata}>
          {artifact && <ArtifactResults artifact={artifact} />}
        </LoadingWrapper>
      </PageSection>
    </Fragment>
  );
};
