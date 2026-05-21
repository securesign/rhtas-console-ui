# AGENTS.md

This file provides repository-specific guidance for AI coding agents and contributors working on the TAS Console UI repository.

The goal is to give agents enough context to make safe, focused changes without duplicating deeper project documentation.

## Project overview

TAS Console UI is a web-based frontend for Red Hat Trusted Artifact Signer (TAS). It provides workflows for verifying signed software artifacts, viewing trust metadata, and interacting with Sigstore services such as Rekor, Fulcio, and TUF.

For broader project context, prefer the repository README and existing docs over duplicating that content here.

## Repository floorplan

This is an npm workspace monorepo with four main workspaces:

- `common/` — shared code between client and server, including environment config and branding
- `client/` — React SPA using PatternFly, Vite, and React Query
- `server/` — Express production server that serves the built client and proxies API requests
- `e2e/` — Playwright end-to-end tests

Important client paths:

- `client/src/app/Routes.tsx` — main route definitions
- `client/src/app/queries/` — React Query hooks and query helpers
- `client/src/app/queries/helpers.ts` — `useMockableQuery` wrapper for real/mock data switching
- `client/src/app/queries/mocks/` — mock response data
- `client/src/app/client/` — generated OpenAPI client code
- `client/openapi/console.yaml` — OpenAPI source contract

Path alias:

- `@app` maps to `client/src/app/`

## Key commands

Run commands from the repository root unless noted otherwise.

```bash
# Install dependencies
npm ci

# Start development server
npm run start:dev

# Run unit tests
npm run test

# Run a single client test file
npm run test -w client -- path/to/test.tsx

# Run tests with coverage
npm run coverage -w client

# Run E2E tests
npm run e2e:test

# Lint all workspaces
npm run lint

# Format code
npm run format

# Generate OpenAPI client
npm run generate

# Production build
npm run build
````

## Golden rules

* Prefer small, focused changes.
* Follow existing architecture and naming conventions before introducing new patterns.
* Prefer PatternFly components and existing project components before custom UI.
* Keep user-facing behavior accessible, including labels, headings, focus behavior, and keyboard support.
* Do not introduce new dependencies unless there is a clear, justified reason.
* Remove obsolete code instead of leaving commented-out or dead code behind.
* Link to deeper docs instead of copying large explanations into this file.

## Generated-file boundaries

Do not manually edit generated OpenAPI client files in:

```text
client/src/app/client/
```

The generated client is produced from:

```text
client/openapi/console.yaml
```

If API types or client functions are wrong, update the OpenAPI source contract or generation flow, then run:

```bash
npm run generate
```

Mock data should align with SDK-generated response types, not UI-only view models.

## API and data-fetching expectations

The client uses React Query with a `useMockableQuery` wrapper that swaps real API calls for mock data when mock mode is enabled.

Environment variables are managed through:

```text
common/src/environment.ts
```

Important variables include:

* `MOCK` — enables mock data when set to `on`
* `CONSOLE_API_URL` — backend API URL
* `COVERAGE` — enables code instrumentation for coverage

Data-fetching guidance:

* Model hooks around semantic operations, not just HTTP verbs.
* Use queries for idempotent read or verify operations, even when the backend endpoint uses `POST`.
* Avoid unnecessary cache invalidations for read-only operations.
* Export semantic query key factories, for example keys based on artifact URI or SAN.
* Keep mocks aligned to REST response types and derive UI-only state in mapper or view-model layers.

## UI and PatternFly expectations

* Use PatternFly components where practical.
* Follow existing layout, spacing, and composition conventions.
* Preserve accessibility behavior when changing forms, tables, navigation, modals, and async states.
* Prefer clear empty, loading, error, and partial-data states over silent failures.
* Avoid custom styling when existing PatternFly patterns are sufficient.

## Testing expectations

* Add or update tests for changed behavior.
* Prefer React Testing Library for user-facing behavior.
* Do not rely only on snapshots for meaningful UI changes.
* Pin stable external versions in tests; avoid `:latest` tags.
* Gate coverage instrumentation with the `COVERAGE` environment variable.
* Run the most relevant checks before finishing. For broad changes, run lint, tests, and build.

## Common pitfalls

* Do not edit generated SDK/types directly.
* Do not make mocks drift from generated API response types.
* Do not add UI rendering for fields that no longer exist in the API.
* Do not invalidate React Query caches for read-only verification flows unless there is a real state change.
* Do not introduce one-off PatternFly layouts when existing project patterns already solve the problem.
* Do not assume E2E tests work without the required dev server running.

## Before finishing work

Summarize the following in the final response or PR description:

* What changed
* What tests or checks were run
* Any known risks, skipped checks, or follow-up work
