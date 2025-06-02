import dayjs from 'dayjs';

const getRandomDate = (start: Date, end: Date): string => {
  const randomTimestamp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return formatDate(randomTimestamp.toISOString())!;
};

const getRandomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const formatDate = (value?: string | null) => {
  return value ? dayjs(value).format('MMM DD, YYYY') : null;
};

export interface ArtifactsDataRow {
  identifier: string;
  title: string;
  severity: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  modified: string | null;
  vulnerabilities?: {
    label?: string;
    name?: string;
    color?: string;
    count: number;
    score: number | null;
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  }[];
}

export const columns = ['Identifier', 'Title', 'Severity', 'Type', 'Revision', 'Vulnerabilities'];

export const rows: ArtifactsDataRow[] = [
  {
    identifier: 'RHSA-2025:3501',
    title: 'Red Hat Security Advisory: Custom Metrics Autoscaler Operator for Red Hat OpenShift 2.15.1-4 Update',
    severity: 'High',
    type: 'csaf',
    modified: getRandomDate(new Date(2020, 0, 1), new Date()),
    vulnerabilities: [
      {
        color: 'red',
        count: getRandomInteger(1, 100),
        label: 'High',
        score: getRandomInteger(1, 20),
        severity: 'high',
      },
      {
        color: 'orange',
        count: getRandomInteger(1, 100),
        label: 'Medium',
        score: getRandomInteger(1, 20),
        severity: 'medium',
      },
      {
        color: 'blue',
        count: getRandomInteger(1, 100),
        label: 'Low',
        score: getRandomInteger(1, 20),
        severity: 'low',
      },
    ],
  },
];
