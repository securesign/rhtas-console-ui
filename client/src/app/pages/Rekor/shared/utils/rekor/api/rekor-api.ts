import { useCallback } from "react";
import { type LogEntry, RekorClient, type SearchIndex } from "rekor";
import { useRekorClient } from "./context.tsx";

const PAGE_SIZE = 20;
const REQUEST_TIMEOUT_MS = 30_000;

export class TimeoutError extends Error {
  constructor() {
    super("Request timed out");
    this.name = "TimeoutError";
  }
}

export function withTimeout<T>(promise: Promise<T> & { cancel?: () => void }, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        promise.cancel?.();
        reject(new TimeoutError());
      }, ms);
    }),
  ]);
}

export const ATTRIBUTES = ["email", "hash", "commitSha", "uuid", "logIndex"] as const;
const ATTRIBUTES_SET = new Set<string>(ATTRIBUTES);

export type Attribute = (typeof ATTRIBUTES)[number];

export function isAttribute(input: string): input is Attribute {
  return ATTRIBUTES_SET.has(input);
}

const ATTRIBUTE_MATCHERS: { attribute: Attribute; pattern: RegExp }[] = [
  { attribute: "email", pattern: /\S+@\S+\.\S+/ },
  { attribute: "hash", pattern: /^sha256:[0-9a-fA-F]{64}$/ },
  { attribute: "hash", pattern: /^sha1:[0-9a-fA-F]{40}$/ },
  { attribute: "uuid", pattern: /^[0-9a-fA-F]{80}$/ },
  { attribute: "uuid", pattern: /^[0-9a-fA-F]{64}$/ },
  { attribute: "commitSha", pattern: /^[0-9a-fA-F]{40}$/ },
  { attribute: "logIndex", pattern: /^\d+$/ },
];

export function detectAttribute(value: string): Attribute | null {
  const trimmed = value.trim();
  for (const { attribute, pattern } of ATTRIBUTE_MATCHERS) {
    if (pattern.test(trimmed)) return attribute;
  }
  return null;
}

export type SearchQuery =
  | {
      attribute: "email" | "hash" | "commitSha" | "uuid";
      query: string;
    }
  | {
      attribute: "logIndex";
      query: number;
    };

export interface RekorEntries {
  totalCount: number;
  entries: LogEntry[];
}

export function useRekorSearch() {
  const client = useRekorClient();

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    async (search: SearchQuery, page: number = 1): Promise<RekorEntries> => {
      switch (search.attribute) {
        case "logIndex":
          return {
            totalCount: 1,
            entries: [
              await withTimeout(
                client.entries.getLogEntryByIndex({
                  logIndex: search.query,
                }),
                REQUEST_TIMEOUT_MS
              ),
            ],
          };
        case "uuid":
          return {
            totalCount: 1,
            entries: [
              await withTimeout(
                client.entries.getLogEntryByUuid({
                  entryUuid: search.query,
                }),
                REQUEST_TIMEOUT_MS
              ),
            ],
          };
        case "email":
          return queryEntries(
            client,
            {
              email: search.query,
            },
            page
          );
        case "hash":
          return queryEntries(
            client,
            {
              hash: search.query.startsWith("sha256:") ? search.query : `sha256:${search.query}`,
            },
            page
          );
        case "commitSha":
          // eslint-disable-next-line no-case-declarations
          const hash = await digestMessage(search.query);
          return queryEntries(client, { hash }, page);
      }
    },
    [client]
  );
}

async function queryEntries(client: RekorClient, query: SearchIndex, page: number): Promise<RekorEntries> {
  const logIndexes = await withTimeout(client.index.searchIndex({ query }), REQUEST_TIMEOUT_MS);

  // Preventing entries from jumping between pages on refresh
  logIndexes.sort();

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const uuidToRetrieve = logIndexes.slice(startIndex, endIndex);

  const entries = await Promise.all(
    uuidToRetrieve.map((entryUuid) => withTimeout(client.entries.getLogEntryByUuid({ entryUuid }), REQUEST_TIMEOUT_MS))
  );
  return {
    totalCount: logIndexes.length,
    entries,
  };
}

async function digestMessage(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `sha256:${hash}`;
}
