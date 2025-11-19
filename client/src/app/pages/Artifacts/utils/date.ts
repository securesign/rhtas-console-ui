import dayjs from "dayjs";

export function signatureRelativeDateString(date: Date) {
  return `${dayjs().to(date)}`;
}
