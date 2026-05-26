# 3. OpenAPI Client Generation with @hey-api/openapi-ts

Date: 2026-05-12

## Status

Accepted

## Context

The console UI communicates with a backend API that exposes endpoints for artifact verification, Rekor log queries, and trust root management. Manually writing HTTP clients and TypeScript types for these endpoints introduces drift risk between the API contract and the frontend code.

## Decision

Use `@hey-api/openapi-ts` to auto-generate a typed API client from the OpenAPI spec at `client/openapi/console.yaml`. Generation runs via `npm run generate` and is triggered automatically on `npm install` through the `prepare` script. Generated code outputs to `client/src/app/client/`.

## Consequences

- The OpenAPI spec is the single source of truth for API types and operations
- Type mismatches between frontend and backend are caught at compile time
- API changes require updating the YAML spec first, then regenerating — enforcing spec-first development
- Generated code should not be hand-edited; customizations go in wrapper layers
- The axios plugin provides consistent HTTP handling across all generated endpoints
