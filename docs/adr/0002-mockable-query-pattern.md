# 2. Mockable Query Pattern for API Decoupling

Date: 2026-05-12

## Status

Accepted

## Context

UI development and testing need to proceed independently of backend API availability. The Sigstore services (Rekor, Fulcio, TUF) may not be running locally, and deterministic test data is required for reliable CI. A mechanism is needed to swap live API calls for mock data without changing component code.

## Decision

Use a `useMockableQuery` wrapper around React Query that checks the `MOCK` environment variable. When `MOCK=on`, query hooks return resolved mock data from `client/src/app/queries/mocks/` instead of calling the API. Components consume the same hook interface regardless of mode. Mock data files match SDK-generated types exactly — UI-only state is derived in a separate mapper layer.

## Consequences

- UI development works without any backend services running
- E2E tests use deterministic data, eliminating flaky network-dependent failures
- Mock data must stay aligned with OpenAPI-generated types when the spec changes
- No code branching in components — the swap happens entirely in the query layer
- `MOCK` env var is the single toggle, managed through `common/src/environment.ts`
