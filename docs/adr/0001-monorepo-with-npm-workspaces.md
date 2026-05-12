# 1. Monorepo with npm Workspaces

Date: 2026-05-12

## Status

Accepted

## Context

The application has four distinct concerns: shared utilities/types (common), the React SPA (client), the production Express server (server), and end-to-end tests (e2e). These need to share code (especially environment config and branding) while maintaining independent build and test lifecycles.

## Decision

Use a single repository with four npm workspaces: `common`, `client`, `server`, and `e2e`. The root `package.json` orchestrates cross-workspace scripts (build, lint, format, test). Shared code flows from `common` into `client` and `server` as a workspace dependency.

## Consequences

- Shared types and environment config live in one place with no publish/version cycle
- Root-level scripts coordinate builds across workspaces (e.g., `npm run build -w common` before client dev server)
- Single `npm ci` installs all workspace dependencies with a unified lockfile
- CI runs against all workspaces in one checkout
- Workspace-specific commands require `-w <workspace>` flag, adding slight verbosity
