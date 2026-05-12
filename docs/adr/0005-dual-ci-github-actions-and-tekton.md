# 5. Dual CI: GitHub Actions and Tekton

Date: 2026-05-12

## Status

Accepted

## Context

The project needs CI for two audiences: developers working on pull requests via GitHub, and Red Hat's internal release pipeline (Konflux/AppStudio) which requires Tekton-based hermetic builds to produce signed, attestable container images for production.

## Decision

Run GitHub Actions for developer-facing CI (lint, build, unit tests, e2e tests, coverage) and Tekton PipelineRuns for production image builds. GitHub Actions workflows live in `.github/workflows/`. Tekton pipelines live in `.tekton/` and are triggered by Pipelines-as-Code annotations on push/PR events against `main`.

## Consequences

- Developers get fast feedback on PRs through GitHub Actions without needing Tekton knowledge
- Production images are built hermetically through Tekton, meeting Red Hat's supply chain security requirements
- Two CI systems must be maintained — workflow changes may need updates in both places
- Tekton pipelines produce images to `quay.io/securesign/rhtas-console-ui` with commit-SHA tags
- GitHub Actions handles non-image concerns (linting, testing, coverage badges, deployment previews)
