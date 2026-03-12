import { Form, FormGroup, FormHelperText, HelperText, HelperTextItem, SearchInput } from "@patternfly/react-core";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { detectAttribute } from "../../shared/utils/rekor/api/rekor-api";

export interface FormProps {
  defaultValues?: FormInputs;
  isLoading: boolean;
  onSubmit: (_query: FormInputs) => void;
}

const PLACEHOLDER = "Enter email or hash or commit SHA or entry UUID or log index";

export interface FormInputs {
  search: string;
}

export function SearchForm({ defaultValues, onSubmit }: FormProps) {
  const { handleSubmit, control, setValue } = useForm<FormInputs>();

  useEffect(() => {
    if (defaultValues) {
      setValue("search", defaultValues.search);
    }
  }, [defaultValues, setValue]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form ref={formRef} onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Controller
        name="search"
        control={control}
        rules={{
          required: { value: true, message: "A value is required" },
          validate: (v) =>
            detectAttribute(v) !== null ||
            "Unrecognized format. Expected: email, hash (sha256:…/sha1:…), commit SHA (40 hex), UUID (64/80 hex), or log index (number).",
        }}
        render={({ field, fieldState }) => (
          <FormGroup label="Search" isRequired fieldId="search">
            <SearchInput
              {...field}
              style={{ maxWidth: "40rem" }}
              aria-label="Search input field"
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
              id="search"
              aria-describedby="search-helper"
              aria-invalid={fieldState.error ? "true" : "false"}
              placeholder={PLACEHOLDER}
            />
            {fieldState.invalid && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem icon={<ExclamationCircleIcon />} variant={"error"}>
                    {fieldState.error?.message}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>
        )}
      />
    </Form>
  );
}
