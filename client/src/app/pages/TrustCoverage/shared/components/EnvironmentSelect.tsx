import { Flex, FlexItem, FormSelect, FormSelectOption } from "@patternfly/react-core";

interface Props {
  selectedEnvironment: string;
  environments: string[];
  setSelectedEnvironment: (value: string) => void;
}

export default function EnvironmentSelect({ selectedEnvironment, environments, setSelectedEnvironment }: Props) {
  return (
    <Flex alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }}>
      <FlexItem>
        <label htmlFor="environment-filter">Environment</label>
      </FlexItem>
      <FlexItem>
        <FormSelect
          id="environment-filter"
          value={selectedEnvironment}
          onChange={(_event, value) => setSelectedEnvironment(value)}
          aria-label="Select environment"
        >
          <FormSelectOption key="all" value="all" label="All environments" />
          {environments.map((env) => (
            <FormSelectOption key={env} value={env} label={env} />
          ))}
        </FormSelect>
      </FlexItem>
    </Flex>
  );
}
