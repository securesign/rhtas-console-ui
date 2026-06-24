# 4. PatternFly v6 as UI Framework

Date: 2026-05-12

## Status

Accepted

## Context

The console UI is a Red Hat product that ships as part of Red Hat Trusted Artifact Signer. It needs to meet Red Hat's UX standards, accessibility requirements, and visual consistency with other Red Hat console experiences (e.g., OpenShift Console).

## Decision

Use PatternFly v6 (@patternfly/react-core, @patternfly/react-table, @patternfly/react-charts) as the UI component library. The project was bootstrapped from the PatternFly React Seed template.

## Consequences

- Pre-built components (tables, forms, navigation, charts) reduce custom UI code
- Built-in WCAG 2.1 AA accessibility compliance
- Consistent look and feel with other Red Hat products out of the box
- PatternFly major version upgrades require coordinated migration effort
- Component API is opinionated — custom styling requires working within PatternFly's design token system
