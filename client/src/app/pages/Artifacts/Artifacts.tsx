import { Fragment, useRef, useState } from "react";
import {
  Content,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  PageSection,
  SearchInput,
} from "@patternfly/react-core";
import { useFetchArtifactsImageData, useVerifyArtifact } from "@app/queries/artifacts";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { ArtifactResults } from "./components/ArtifactResults";
import { Controller, useForm } from "react-hook-form";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { DocumentMetadata } from "@app/components/DocumentMetadata";

const PLACEHOLDER_URI = "Enter container image URI to view an artifact and it's metadata";

interface FormInputs {
  searchInput: string;
}

export const Artifacts = () => {
  const [artifactUri, setArtifactUri] = useState<string | null>();

  const {
    artifact,
    isFetching: isFetchingArtifactMetadata,
    fetchError: fetchErrorArtifactMetadata,
  } = useFetchArtifactsImageData({ uri: artifactUri });

  const {
    verification,
    isFetching: isFetchingVerification,
    fetchError: fetchErrorVerification,
    refetch: refetchVerification,
  } = useVerifyArtifact({ uri: artifactUri });

  const {
    control,
    handleSubmit,
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

    // if the URI hasn't changed, manually refetch verification
    if (uri === artifactUri) {
      void refetchVerification();
    } else {
      setArtifactUri(uri);
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Fragment>
      <DocumentMetadata title="Artifacts" />
      <PageSection>
        <Content>
          <h1>Artifacts</h1>
          <p>View your artifacts and their metadata</p>
        </Content>
      </PageSection>
      <PageSection>
        <Form ref={formRef} onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Controller
            name="searchInput"
            control={control}
            rules={{ required: { value: true, message: "A URI is required" } }}
            render={({ field, fieldState }) => (
              <FormGroup label="Search for an artifact" isRequired fieldId="uri">
                <SearchInput
                  {...field}
                  style={{ maxWidth: "40rem" }}
                  aria-label={`Containerimage URI input field`}
                  value={field.value}
                  onChange={(_event, value) => {
                    field.onChange(value);
                  }}
                  onClear={() => {
                    field.onChange("");
                  }}
                  onSearch={() => {
                    formRef.current?.requestSubmit();
                  }}
                  type="text"
                  name="searchInput"
                  id="uri"
                  aria-describedby="uri-helper"
                  aria-invalid={errors.searchInput ? "true" : "false"}
                  placeholder={PLACEHOLDER_URI}
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
        </Form>
      </PageSection>
      <PageSection>
        <LoadingWrapper
          isFetching={isFetchingArtifactMetadata || isFetchingVerification}
          fetchError={fetchErrorArtifactMetadata ?? fetchErrorVerification}
        >
          {artifact && verification && <ArtifactResults artifact={artifact} verification={verification} />}
        </LoadingWrapper>
      </PageSection>
    </Fragment>
  );
};
