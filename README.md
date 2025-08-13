# RHTAS Console UI

The RHTAS Console is a web-based frontend for interacting with the [Red Hat Trusted Artifact Signer (TAS)](https://developers.redhat.com/products/trusted-artifact-signer/overview) ecosystem. It provides user-friendly workflows for retrieving, verifying, and monitoring signed software artifacts, integrating with [Sigstore](https://www.sigstore.dev/) services like Rekor, Fulcio, and [TUF](https://theupdateframework.io/) (The Update Framework).

Features in progress:

- View trust metadata and certificate details
- Verify signatures and attestations
- Retrieve container artifacts from registries
- Integrate with transparency logs (Rekor)

Links:

- [RHTAS Console](https://github.com/securesign/rhtas-console)
- Based on [PatternFly React Seed](https://github.com/patternfly/patternfly-react-seed)
- Uses [PatternFly v6](https://www.patternfly.org/), React, and [Storybook](https://storybook.js.org/)

## Quickstart

```
git clone https://github.com/securesign/rhtas-console-ui
cd rhtas-console-ui
npm ci && npm run start:dev
```

## Configurations

- [TypeScript Config](./client/tsconfig.app.json)
- [Vite Config](./client/vite.config.ts)
- [Editor Config](./.editorconfig)
- [Openapi](./client/openapi/console.yaml)

## Development

```bash
# Install development/build dependencies
npm ci

# Start the development server
npm run start:dev

# Run a production build (outputs to "dist" dir)
npm run build

# Run the linter
npm run lint

# Run the code formatter
npm run format

# Start the express server (run a production build first)
npm run start
```

## Environment variables

| ENV VAR         | Description                   | Default value                          |
| --------------- | ----------------------------- | -------------------------------------- |
| MOCK            | Enables or disables mock data | `off`                                  |
| AUTH_REQUIRED   | Enable/Disable authentication | false                                  |
| OIDC_CLIENT_ID  | Set Oidc Client               | frontend                               |
| OIDC_SERVER_URL | Set Oidc Server URL           | `http://localhost:8090/realms/console` |
| OIDC_SCOPE      | Set Oidc Scope                | openid                                 |

## Code quality tools

- To keep our code formatting in check, we use [prettier](https://github.com/prettier/prettier)
- To ensure code styles remain consistent, we use [eslint](https://eslint.org/)

## Multi environment configuration

Environment Variables can be injected in the UI though [environment.ts](./common/src/environment.ts)

## Konflux

### Hermetic builds

RPM packages require explicit enablement. See [konflux-rpm ](https://konflux-ci.dev/docs/building/prefetching-dependencies/#rpm)

Requirements:

- [rpm-lockfile-prototype](https://github.com/konflux-ci/rpm-lockfile-prototype?tab=readme-ov-file#installation)

Steps to setup RPM packages:

```
BASE_IMAGE=registry.access.redhat.com/ubi9/nodejs-22-minimal:latest
podman run -it $BASE_IMAGE cat /etc/yum.repos.d/ubi.repo > ubi.repo
```

Make sure the `ubi.repo` file has all repositories enabled `enabled = 1` and then:

```
rpm-lockfile-prototype --image $BASE_IMAGE rpms.in.yaml
```