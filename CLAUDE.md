# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RHTAS Console UI is a web-based frontend for Red Hat Trusted Artifact Signer (TAS). It provides workflows for verifying signed software artifacts, viewing trust metadata, and interacting with Sigstore services (Rekor, Fulcio, TUF).

## Commands

```bash
# Install dependencies
npm ci

# Start development server (runs common build + client dev server)
npm run start:dev

# Run all unit tests
npm run test

# Run single test file
npm run test -w client -- path/to/test.tsx

# Run tests with coverage
npm run coverage -w client

# Run E2E tests (requires dev server running)
npm run e2e:test

# Lint all workspaces
npm run lint

# Format code
npm run format

# Generate OpenAPI client (auto-runs on install via prepare script)
npm run generate

# Production build
npm run build
```

## Architecture

### Monorepo Structure

Four npm workspaces:
- **common** - Shared code between client and server (environment config, branding)
- **client** - React SPA using PatternFly v6, Vite, React Query
- **server** - Express server for production (serves built client, proxies API)
- **e2e** - Playwright end-to-end tests

### Client Architecture

**Routing** (`client/src/app/Routes.tsx`): Three main pages - TrustRoot (default), Artifacts, RekorSearch. Uses lazy loading with Suspense.

**Path alias**: `@app` maps to `client/src/app/`

**API Client**: Auto-generated from OpenAPI spec (`client/openapi/console.yaml`) using `@hey-api/openapi-ts`. Generated types and functions live in `client/src/app/client/`.

**Data Fetching Pattern**: Uses React Query with `useMockableQuery` wrapper (`client/src/app/queries/helpers.ts`) that swaps real API calls for mock data when `MOCK=on`. Query hooks export semantic key factories (e.g., `ArtifactsKeys.verify(uri, san)`).

**Mocks**: Mock data files in `client/src/app/queries/mocks/` should match SDK-generated types exactly, not UI view-models.

### Environment Variables

Managed through `common/src/environment.ts`. Key variables:
- `MOCK` - Enable mock data (`on`/`off`)
- `CONSOLE_API_URL` - Backend API URL (default: http://localhost:8080)
- `COVERAGE` - Enable code instrumentation for coverage

## Best Practices

**Data fetching**: Model hooks around semantic operation (read vs write), not HTTP verb. Use queries for idempotent read/verify calls even when POST endpoints. Avoid cache invalidations for read-only operations.

**Mocks**: Keep mocks aligned to REST response types (SDK-generated). Derive UI-only state in a separate mapper/view-model layer.

**Dead code**: Remove obsolete or commented-out code. When API fields are removed, delete related rendering logic.

**Tests**: Pin stable external versions in tests (avoid `:latest` tags). Gate coverage instrumentation with `COVERAGE` env var.
