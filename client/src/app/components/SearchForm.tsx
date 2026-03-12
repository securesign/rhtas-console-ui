import { Form, FormGroup, FormHelperText, HelperText, HelperTextItem, SearchInput } from "@patternfly/react-core";
import { useEffect, useRef } from "react";
import { Controller, useForm, type RegisterOptions } from "react-hook-form";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export interface SearchFormInputs {
  search: string;
}

export interface SearchFormProps {
  label: string;
  placeholder: string;
  ariaLabel: string;
  id: string;
  name?: string;
  defaultValue?: string;
  rules?: Omit<RegisterOptions<SearchFormInputs, "search">, "required">;
  onSubmit: (value: string) => void;
}

export function SearchForm({
  label,
  placeholder,
  ariaLabel,
  id,
  name,
  defaultValue,
  rules,
  onSubmit,
}: SearchFormProps) {
  const { handleSubmit, control, setValue } = useForm<SearchFormInputs>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (defaultValue != null) {
      setValue("search", defaultValue);
    }
  }, [defaultValue, setValue]);

  return (
    <Form ref={formRef} onSubmit={(e) => void handleSubmit((data) => onSubmit(data.search.trim()))(e)}>
      <Controller
        name="search"
        control={control}
        rules={{
          required: { value: true, message: "A value is required" },
          ...rules,
        }}
        render={({ field, fieldState }) => (
          <FormGroup label={label} isRequired fieldId={id}>
            <SearchInput
              {...field}
              style={{ maxWidth: "40rem" }}
              aria-label={ariaLabel}
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
              name={name ?? id}
              id={id}
              aria-describedby={`${id}-helper`}
              aria-invalid={fieldState.error ? "true" : "false"}
              placeholder={placeholder}
            />
            {fieldState.invalid && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
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
