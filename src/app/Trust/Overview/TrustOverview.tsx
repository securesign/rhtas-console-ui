import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  Content,
  Grid,
  GridItem,
  Icon,
  PageSection,
  CardFooter,
  Title,
  ContentVariants,
  SelectOptionProps,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartDonutThreshold,
  ChartDonutUtilization,
  ChartGroup,
  ChartThemeColor,
} from '@patternfly/react-charts/victory';
import { MultiContentCard } from '@patternfly/react-component-groups';
import { ArrowRightIcon, TimesIcon } from '@patternfly/react-icons';
import { VictoryZoomContainer } from 'victory';

const initialSelectOptions: SelectOptionProps[] = [
  { value: 'Alabama', children: 'Alabama' },
  { value: 'Florida', children: 'Florida' },
  { value: 'New Jersey', children: 'New Jersey' },
  { value: 'New Mexico', children: 'New Mexico' },
  { value: 'New York', children: 'New York' },
  { value: 'North Carolina', children: 'North Carolina' },
];

const TrustOverview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<SelectOptionProps[]>(initialSelectOptions);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const textInputRef = useRef<HTMLInputElement>(undefined);

  const cards = [
    <Card isFullHeight isPlain key="card-1">
      <CardBody>
        <Content className="pf-v6-u-font-size-sm">
          <div>
            Below is a summary of status for your configured trust roots.
          </div>
          <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Bar chart example"
            containerComponent={<VictoryZoomContainer />}
            domainPadding={{ x: [30, 25] }}
            legendData={[{ name: 'Cats' }, { name: 'Dogs' }, { name: 'Birds' }, { name: 'Mice' }]}
            legendPosition="bottom-left"
            height={400}
            name="chart3"
            padding={{
              bottom: 75, // Adjusted to accommodate legend
              left: 50,
              right: 100, // Adjusted to accommodate tooltip
              top: 50,
            }}
            themeColor={ChartThemeColor.multiOrdered}
            width={450}
          >
            <ChartAxis />
            <ChartAxis dependentAxis showGrid />
            <ChartGroup offset={11} horizontal>
              <ChartBar
                data={[
                  { name: 'Cats', x: '2015', y: 1 },
                  { name: 'Cats', x: '2016', y: 2 },
                  { name: 'Cats', x: '2017', y: 5 },
                  { name: 'Cats', x: '2018', y: 3 },
                ]}
              />
              <ChartBar
                data={[
                  { name: 'Dogs', x: '2015', y: 2 },
                  { name: 'Dogs', x: '2016', y: 1 },
                  { name: 'Dogs', x: '2017', y: 7 },
                  { name: 'Dogs', x: '2018', y: 4 },
                ]}
              />
              <ChartBar
                data={[
                  { name: 'Birds', x: '2015', y: 4 },
                  { name: 'Birds', x: '2016', y: 4 },
                  { name: 'Birds', x: '2017', y: 9 },
                  { name: 'Birds', x: '2018', y: 7 },
                ]}
              />
              <ChartBar
                data={[
                  { name: 'Mice', x: '2015', y: 3 },
                  { name: 'Mice', x: '2016', y: 3 },
                  { name: 'Mice', x: '2017', y: 8 },
                  { name: 'Mice', x: '2018', y: 5 },
                ]}
              />
            </ChartGroup>
          </Chart>
        </Content>
      </CardBody>
    </Card>,
    <Card isFullHeight isPlain key="card-2">
      <CardBody>
        <Content component={ContentVariants.p}>
          <Content component={ContentVariants.h6}>Last Root Refresh</Content>
          <Content>May 26, 2025 | 13:37:57</Content>
        </Content>

        <Content component={ContentVariants.p}>
          <Content component={ContentVariants.h6}>Expiring Soon</Content>
          <Content>
            July 27, 2025 | 00:00:00
          </Content>
        </Content>

        <Content component={ContentVariants.p}>
          <Content component={ContentVariants.h6}>Recent Errors</Content>
          <Content>
            Unable to fetch metadata
          </Content>
        </Content>
      </CardBody>
      <CardFooter>
        <Content>
          <Button
            icon={
              <Icon className="pf-v6-u-ml-sm" isInline>
                <ArrowRightIcon />
              </Icon>
            }
            variant="link"
            isInline
            component={"a"}
            href="/trust/roots"
          >
            View Trust Roots
          </Button>
        </Content>
      </CardFooter>
    </Card>,
    <Card isFullHeight isPlain key="card-3">
      <CardBody>
        <Content component={ContentVariants.p}>
          <Content component={ContentVariants.h6}>Total Certificates</Content>
          <Content>161</Content>
        </Content>

        <Content component={ContentVariants.p}>
          <Content component={ContentVariants.h6}>Total Keys</Content>
          <Content>8</Content>
        </Content>
      </CardBody>
      <CardFooter>
        <Content>
          <Button
            icon={
              <Icon className="pf-v6-u-ml-sm" isInline>
                <ArrowRightIcon />
              </Icon>
            }
            variant="link"
            isInline
          >
            Learn more
          </Button>
        </Content>
      </CardFooter>
    </Card>,
  ];

  useEffect(() => {
    let newSelectOptions: SelectOptionProps[] = initialSelectOptions;

    // Filter menu items based on the text input value when one exists
    if (filterValue) {
      newSelectOptions = initialSelectOptions.filter((menuItem) =>
        String(menuItem.children).toLowerCase().includes(filterValue.toLowerCase()),
      );

      // Open the menu when the input value changes and the new value is not empty
      if (!isOpen) {
        setIsOpen(true);
      }
    }

    setSelectOptions(newSelectOptions);
  }, [filterValue]);

  const setActiveAndFocusedItem = (itemIndex: number) => {
    setFocusedItemIndex(itemIndex);
    // const focusedItem = selectOptions[itemIndex];
    // setActiveItemId(createItemId(focusedItem.value));
  };

  const resetActiveAndFocusedItem = () => {
    setFocusedItemIndex(null);
    setActiveItemId(null);
  };

  const closeMenu = () => {
    setIsOpen(false);
    resetActiveAndFocusedItem();
  };

  const onInputClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (!inputValue) {
      closeMenu();
    }
  };

  const selectOption = (value: string | number, content: string | number) => {
    // eslint-disable-next-line no-console
    console.log('selected', content);

    setInputValue(String(content));
    setFilterValue('');
    setSelected(String(value));

    closeMenu();
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (value) {
      const optionText = selectOptions.find((option) => option.value === value)?.children;
      selectOption(value, optionText as string);
    }
  };

  const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setInputValue(value);
    setFilterValue(value);

    resetActiveAndFocusedItem();

    if (value !== selected) {
      setSelected('');
    }
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus = 0;

    if (!isOpen) {
      setIsOpen(true);
    }

    if (selectOptions.every((option) => option.isDisabled)) {
      return;
    }

    if (key === 'ArrowUp') {
      // When no index is set or at the first index, focus to the last, otherwise decrement focus index
      if (focusedItemIndex === null || focusedItemIndex === 0) {
        indexToFocus = selectOptions.length - 1;
      } else {
        indexToFocus = focusedItemIndex - 1;
      }

      // Skip disabled options
      while (selectOptions[indexToFocus].isDisabled) {
        indexToFocus--;
        if (indexToFocus === -1) {
          indexToFocus = selectOptions.length - 1;
        }
      }
    }

    if (key === 'ArrowDown') {
      // When no index is set or at the last index, focus to the first, otherwise increment focus index
      if (focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1) {
        indexToFocus = 0;
      } else {
        indexToFocus = focusedItemIndex + 1;
      }

      // Skip disabled options
      while (selectOptions[indexToFocus].isDisabled) {
        indexToFocus++;
        if (indexToFocus === selectOptions.length) {
          indexToFocus = 0;
        }
      }
    }

    setActiveAndFocusedItem(indexToFocus);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const focusedItem = focusedItemIndex !== null ? selectOptions[focusedItemIndex] : null;

    switch (event.key) {
      case 'Enter':
        if (isOpen && focusedItem && !focusedItem.isAriaDisabled) {
          onSelect(undefined, focusedItem.value as string);
        }

        if (!isOpen) {
          setIsOpen(true);
        }

        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
    textInputRef?.current?.focus();
  };

  const onClearButtonClick = () => {
    setSelected('');
    setInputValue('');
    setFilterValue('');
    resetActiveAndFocusedItem();
    textInputRef?.current?.focus();
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      aria-label="Typeahead menu toggle"
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={onInputClick}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id="typeahead-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Select an option.."
          {...(activeItemId && { 'aria-activedescendant': activeItemId })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-typeahead-listbox"
        />

        <TextInputGroupUtilities {...(!inputValue ? { style: { display: 'none' } } : {})}>
          <Button variant="plain" onClick={onClearButtonClick} aria-label="Clear input value" icon={<TimesIcon />} />
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <React.Fragment>
      <PageSection>
        <Content>
          <h1>Trust Overview</h1>
        </Content>
      </PageSection>
      <PageSection isFilled>
        <Grid hasGutter={true}>
          <GridItem>
            <MultiContentCard cards={cards} />
          </GridItem>
          <GridItem span={3}>
            <Card id="home-banking-card" component="div">
              <CardTitle>
                <Title headingLevel="h4" size="md">
                  home-banking
                </Title>
              </CardTitle>
              <CardBody>
                <ChartDonutThreshold
                  ariaDesc="Mock storage capacity"
                  ariaTitle="Mock donut utilization chart"
                  constrainToVisibleArea={true}
                  data={[
                    { x: 'Warning at 60%', y: 60 },
                    { x: 'Danger at 90%', y: 90 },
                  ]}
                  height={200}
                  labels={({ datum }) => (datum.x ? datum.x : null)}
                  padding={{
                    bottom: 0,
                    left: 10,
                    right: 150,
                    top: 0,
                  }}
                  width={350}
                >
                  <ChartDonutUtilization
                    data={{ x: 'Storage capacity', y: 80 }}
                    labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y}%` : null)}
                    legendData={[{ name: `Capacity: 80%` }, { name: 'Warning at 60%' }, { name: 'Danger at 90%' }]}
                    legendOrientation="vertical"
                    title="80%"
                    subTitle="of 100 GBps"
                    thresholds={[{ value: 60 }, { value: 90 }]}
                  />
                </ChartDonutThreshold>{' '}
              </CardBody>
              <CardFooter>
                <a href="#">See details</a>
                <br />
                <Select
                  id="typeahead-select-home-banking"
                  isOpen={isOpen}
                  selected={selected}
                  onSelect={onSelect}
                  onOpenChange={(isOpen) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    !isOpen && closeMenu();
                  }}
                  toggle={toggle}
                  variant="typeahead"
                >
                  <SelectList id="select-typeahead-listbox-home-banking">
                    {selectOptions.map((option, index) => (
                      <SelectOption
                        key={option.value || option.children}
                        isFocused={focusedItemIndex === index}
                        className={option.className}
                        id={option.value}
                        {...option}
                        ref={null}
                      />
                    ))}
                  </SelectList>
                </Select>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card id={'amq-streams-card'}>
              <CardTitle>
                <Title headingLevel="h4" size="md">
                  amq-streams/kafka-36-rhel9
                </Title>
              </CardTitle>
              <CardBody>
                <ChartDonutThreshold
                  ariaDesc="Mock storage capacity"
                  ariaTitle="Mock donut utilization chart"
                  constrainToVisibleArea={true}
                  data={[
                    { x: 'Warning at 60%', y: 60 },
                    { x: 'Danger at 90%', y: 90 },
                  ]}
                  height={200}
                  labels={({ datum }) => (datum.x ? datum.x : null)}
                  padding={{
                    bottom: 0,
                    left: 10,
                    right: 150,
                    top: 0,
                  }}
                  width={350}
                >
                  <ChartDonutUtilization
                    data={{ x: 'Storage capacity', y: 80 }}
                    labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y}%` : null)}
                    legendData={[{ name: `Capacity: 80%` }, { name: 'Warning at 60%' }, { name: 'Danger at 90%' }]}
                    legendOrientation="vertical"
                    title="80%"
                    subTitle="of 100 GBps"
                    thresholds={[{ value: 60 }, { value: 90 }]}
                  />
                </ChartDonutThreshold>{' '}
              </CardBody>
              <CardFooter>
                <a href="#">See details</a>
                <br />
                <Select
                  id="typeahead-select-amq-streams"
                  isOpen={isOpen}
                  selected={selected}
                  onSelect={onSelect}
                  onOpenChange={(isOpen) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    !isOpen && closeMenu();
                  }}
                  toggle={toggle}
                  variant="typeahead"
                >
                  <SelectList id="select-typeahead-listbox-amq-streams">
                    {selectOptions.map((option, index) => (
                      <SelectOption
                        key={option.value || option.children}
                        isFocused={focusedItemIndex === index}
                        className={option.className}
                        id={option.value}
                        {...option}
                        ref={null}
                      />
                    ))}
                  </SelectList>
                </Select>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card id={'artemis-project-card'}>
              <CardTitle>
                <Title headingLevel="h4" size="md">
                  artemis-project
                </Title>
              </CardTitle>
              <CardBody>
                <ChartDonutThreshold
                  ariaDesc="Mock storage capacity"
                  ariaTitle="Mock donut utilization chart"
                  constrainToVisibleArea={true}
                  data={[
                    { x: 'Warning at 60%', y: 60 },
                    { x: 'Danger at 90%', y: 90 },
                  ]}
                  height={200}
                  labels={({ datum }) => (datum.x ? datum.x : null)}
                  padding={{
                    bottom: 0,
                    left: 10,
                    right: 150,
                    top: 0,
                  }}
                  width={350}
                >
                  <ChartDonutUtilization
                    data={{ x: 'Storage capacity', y: 80 }}
                    labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y}%` : null)}
                    legendData={[{ name: `Capacity: 80%` }, { name: 'Warning at 60%' }, { name: 'Danger at 90%' }]}
                    legendOrientation="vertical"
                    title="80%"
                    subTitle="of 100 GBps"
                    thresholds={[{ value: 60 }, { value: 90 }]}
                  />
                </ChartDonutThreshold>{' '}
              </CardBody>
              <CardFooter>
                <a href="#">See details</a>
                <br />
                <Select
                  id="typeahead-select-artemis-project"
                  isOpen={isOpen}
                  selected={selected}
                  onSelect={onSelect}
                  onOpenChange={(isOpen) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    !isOpen && closeMenu();
                  }}
                  toggle={toggle}
                  variant="typeahead"
                >
                  <SelectList id="select-typeahead-listbox-artemis-project">
                    {selectOptions.map((option, index) => (
                      <SelectOption
                        key={option.value || option.children}
                        isFocused={focusedItemIndex === index}
                        className={option.className}
                        id={option.value}
                        {...option}
                        ref={null}
                      />
                    ))}
                  </SelectList>
                </Select>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card id={'sap-quickstarts-parent-card'}>
              <CardTitle>
                <Title headingLevel="h4" size="md">
                  sap-quickstarts-parent
                </Title>
              </CardTitle>
              <CardBody>
                <ChartDonutThreshold
                  ariaDesc="Mock storage capacity"
                  ariaTitle="Mock donut utilization chart"
                  constrainToVisibleArea={true}
                  data={[
                    { x: 'Warning at 60%', y: 60 },
                    { x: 'Danger at 90%', y: 90 },
                  ]}
                  height={200}
                  labels={({ datum }) => (datum.x ? datum.x : null)}
                  padding={{
                    bottom: 0,
                    left: 10,
                    right: 150,
                    top: 0,
                  }}
                  width={350}
                >
                  <ChartDonutUtilization
                    data={{ x: 'Storage capacity', y: 80 }}
                    labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y}%` : null)}
                    legendData={[{ name: `Capacity: 80%` }, { name: 'Warning at 60%' }, { name: 'Danger at 90%' }]}
                    legendOrientation="vertical"
                    title="80%"
                    subTitle="of 100 GBps"
                    thresholds={[{ value: 60 }, { value: 90 }]}
                  />
                </ChartDonutThreshold>{' '}
              </CardBody>
              <CardFooter>
                <a href="#">See details</a>
                <br />
                <Select
                  id="typeahead-select-sap-quickstarts-parent"
                  isOpen={isOpen}
                  selected={selected}
                  onSelect={onSelect}
                  onOpenChange={(isOpen) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    !isOpen && closeMenu();
                  }}
                  toggle={toggle}
                  variant="typeahead"
                >
                  <SelectList id="select-typeahead-listbox-sap-quickstarts-parent">
                    {selectOptions.map((option, index) => (
                      <SelectOption
                        key={option.value || option.children}
                        isFocused={focusedItemIndex === index}
                        className={option.className}
                        id={option.value}
                        {...option}
                        ref={null}
                      />
                    ))}
                  </SelectList>
                </Select>
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </React.Fragment>
  );
};

export { TrustOverview };
