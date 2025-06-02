import dayjs from 'dayjs';

const getRandomDate = (start: Date, end: Date): string => {
  const randomTimestamp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return formatDate(randomTimestamp.toISOString())!;
};

const getRandomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const formatDate = (value?: string | null) => {
  return value ? dayjs(value).format('MMM DD, YYYY') : null;
};

export interface CertificatesDataRow {
  identifier: string;
  title: string;
  severity?: 'none' | 'low' | 'medium' | 'high' | 'critical';
  published: string | null;
  sboms: number;
}

export const columns = ['Identifier', 'Description', 'CVSS', 'Date published', 'Impacted SBOMs'];

export const rows: CertificatesDataRow[] = [
  {
    identifier: 'CVE-2022-45787',
    title: 'Apache James MIME4J: Temporary File Information Disclosure in MIME4J TempFileStorageProvider',
    severity: 'medium',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-24815',
    title: 'Disclosure of classpath resources on Windows when mounted on a wildcard route in vertx-web',
    severity: 'high',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-0482',
    title:
      'In RESTEasy the insecure File.createTempFile() is used in the DataSourceProvider, FileProvider and Mime4JWorkaround classes which creates temp files with insecure permissions that could be read by a local user.',
    severity: 'medium',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-24998',
    title: 'Apache Commons FileUpload, Apache Tomcat: FileUpload DoS with excessive parts',
    severity: 'high',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-0044',
    title:
      'If the Quarkus Form Authentication session cookie Path attribute is set to `/` then a cross-site attack may be initiated which might lead to the Information Disclosure. This attack can be prevented with the Quarkus CSRF Prevention feature.',
    severity: 'high',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-0481',
    title:
      'In RestEasy Reactive implementation of Quarkus the insecure File.createTempFile() is used in the FileBodyHandler class which creates temp files with insecure permissions that could be read by a local user.',

    severity: 'medium',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-26464',
    title: 'Apache Log4j 1.x (EOL) allows DoS in Chainsaw and SocketAppender',

    severity: 'high',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-1370',
    title: 'Stack exhaustion in json-smart leads to denial of service when parsing malformed JSON',
    severity: 'high',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-1436',
    title: 'Infinite recursion in Jettison leads to denial of service when creating a crafted JSONArray',
    severity: 'high',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
  {
    identifier: 'CVE-2023-20861',
    title:
      'In Spring Framework versions 6.0.0 - 6.0.6, 5.3.0 - 5.3.25, 5.2.0.RELEASE - 5.2.22.RELEASE, and older unsupported versions, it is possible for a user to provide a specially crafted SpEL expression that may cause a denial-of-service (DoS) condition.',
    severity: 'medium',
    published: getRandomDate(new Date(2020, 0, 1), new Date()),
    sboms: getRandomInteger(0, 1000),
  },
];
