import { Fragment } from 'react';
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
  Label,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Spinner,
  SimpleListItem,
  SimpleList,
} from '@patternfly/react-core';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts/victory';
import { MultiContentCard } from '@patternfly/react-component-groups';
import { ArrowRightIcon, LockIcon, RedoIcon } from '@patternfly/react-icons';
import { formatDate } from '@app/utils/utils';

const exampleCerts = [
  {
    subject: 'CN=Release Signing Cert,O=Release Engineering',
    issuer: 'CN=Some Root CA',
    validFrom: '2024-04-15T00:00:00Z',
    validTo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    fingerprint: 'FF:EE:DD:CC:BB:AA:99:88:77:66:55:44:33:22:11:00:FF:EE:DD:CC',
    type: 'Fulcio',
    status: 'expiring',
  },
  {
    subject: 'CN=Build Signing Cert,O=CI System',
    issuer: 'CN=Intermed.. CA',
    validFrom: '2024-06-01T00:00:00Z',
    validTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    fingerprint: '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44',
    type: 'Fulcio',
    status: 'expiring',
  },
  {
    subject: 'CN=Test Cert Expiring Soon,O=Example Org',
    issuer: 'CN=Example CA',
    validFrom: '2024-05-01T00:00:00Z',
    validTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    fingerprint: 'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD',
    type: 'Fulcio',
    status: 'expiring',
  },
];

const TrustOverview = () => {
  const certListFormatted = [
    <SimpleListItem key="item1" component="a" href="#" isActive>
      {exampleCerts[0].issuer} | {formatDate(exampleCerts[0].validTo)}
    </SimpleListItem>,
    <SimpleListItem key="item2" component="a" href="#">
      {exampleCerts[1].issuer} | {formatDate(exampleCerts[1].validTo)}
    </SimpleListItem>,
    <SimpleListItem key="item3" component="a" href="#">
      {exampleCerts[2].issuer} | {formatDate(exampleCerts[2].validTo)}
    </SimpleListItem>,
  ];

  const cards = [
    <Card id="certificate-health" isPlain isFullHeight key="card-1">
      <CardTitle>
        <Title headingLevel="h4" size="md">
          Certificate Health
        </Title>
      </CardTitle>
      <CardBody>
        <ChartDonut
          ariaDesc="Number of certificates in root"
          ariaTitle="Certificate validity"
          constrainToVisibleArea
          data={[
            { x: 'Valid', y: 35 },
            { x: 'Expiring', y: 55 },
            { x: 'Expired', y: 10 },
          ]}
          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
          legendData={[{ name: 'Valid: 35' }, { name: 'Expiring: 55' }, { name: 'Expired: 10' }]}
          legendOrientation="vertical"
          name="certificate-chart"
          padding={{
            bottom: 20,
            left: 0,
            right: 100,
            top: 20,
          }}
          subTitle="Certificates"
          title="100"
          themeColor={ChartThemeColor.multiOrdered}
          width={350}
        />{' '}
      </CardBody>
      <CardFooter>
        <a href="#">View certificates</a>
        <br />
      </CardFooter>
    </Card>,
    <Card isFullHeight isPlain key="card-2">
      <CardBody>
        <Content component={ContentVariants.p}>
          <Content component={ContentVariants.h6}>Last Root Refresh</Content>
          <Content>2 hours ago</Content>
          {/* <br /> */}
          <Label
            className="pf-v6-u-mb-sm"
            icon={<RedoIcon />}
            color="orange"
            variant="outline"
            onClick={() => 'Refreshed'}
          >
            Refresh
          </Label>
        </Content>
        <Content component={ContentVariants.p}>
          <Content component={ContentVariants.h6}>Expiring Soon</Content>
          <SimpleList aria-label="Simple List Links Example">{certListFormatted}</SimpleList>
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
            component={'a'}
            href="/trust/roots"
          >
            View trust roots
          </Button>
        </Content>
      </CardFooter>
    </Card>,
    <Card isFullHeight isPlain key="card-3">
      <CardTitle>
        <Title headingLevel="h4" size="md">
          Critical Events
        </Title>
      </CardTitle>
      <CardBody>
        <Content component={ContentVariants.p}>
          {/* <Content component={ContentVariants.h6}>Critical Events</Content> */}
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm icon={<Spinner isInline aria-label="Metadata fetch" />}>
                Metadata fetch
              </DescriptionListTerm>
              <DescriptionListDescription>Root metadata couldn't be fetched from remote</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm icon={<LockIcon />}>New certificate added</DescriptionListTerm>
              <DescriptionListDescription>
                A new <a href="#">signing certificate</a> was detected or added.
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
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
            View all events
          </Button>
        </Content>
      </CardFooter>
    </Card>,
  ];

  return (
    <Fragment>
      <PageSection>
        <Content>
          <h1>Trust Overview</h1>
        </Content>
      </PageSection>
      <PageSection isFilled>
        <Grid hasGutter={true}>
          <GridItem>
            <MultiContentCard cards={cards} withDividers isExpandable toggleText="TUF Root" />
          </GridItem>
        </Grid>
      </PageSection>
    </Fragment>
  );
};

export { TrustOverview };
