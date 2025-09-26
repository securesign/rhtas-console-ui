import dayjs from "dayjs";

export function toRelativeDateString(date: Date) {
  return `${dayjs().to(date)} (${dayjs(date).format()})`;
}
