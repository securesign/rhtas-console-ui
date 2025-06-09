import { SVGIconProps } from '@patternfly/react-icons/dist/esm/createIcon';

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCertificateStatusColor = (validTo: string): SVGIconProps['color'] => {
  if (!validTo) return 'gray';

  const expiryDate = new Date(validTo);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'red'; // expired
  if (diffDays < 30) return 'orange'; // expiring soon
  return 'green'; // valid
};
