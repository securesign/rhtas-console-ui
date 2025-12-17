[![codecov](https://codecov.io/gh/securesign/rhtas-console-ui/graph/badge.svg?token=VHMDKU365L)](https://codecov.io/gh/securesign/rhtas-console-ui)

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

| ENV VAR         | Description                   | Default value         |
| --------------- | ----------------------------- | --------------------- |
| MOCK            | Enables or disables mock data | `off`                 |
| CONSOLE_API_URL | Set Console API URL           | http://localhost:8080 |
| COVERAGE        | Enables code instrumentation  |                       |

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

Also make sure the `ubi.repo` contains only repositories from https://github.com/release-engineering/rhtap-ec-policy/blob/main/data/known_rpm_repositories.yml . Change the repository names manually if needed. E.g.

- `ubi-9-for-baseos-rpms` change it to `ubi-9-for-x86_64-baseos-rpms` as only the latter is an accepted repository in Konflux.

Finally execute the command below to generage th lock file:

```
rpm-lockfile-prototype --image $BASE_IMAGE rpms.in.yaml
```

## Deployment

The `deployment/` directory contains Kubernetes manifests organized into a `base/` directory and an `overlays/dev/` directory for deploying the RHTAS Console (UI, backend, and database) using [Kustomize](https://kustomize.io/). The `base/` directory includes:

- `console-backend-deploy.yaml`: Deployment configuration for the console backend.
- `console-backend-service.yaml`: Service definition for the backend.
- `console-db-statefulset.yaml`: StatefulSet configuration for the console database.
- `console-db-secret.yaml`: Secrets for database credentials.
- `console-db-service.yaml`: Service definition for the database.
- `console-serviceaccounts.yaml`: Service accounts for the console components.
- `console-ui-deploy.yaml`: Deployment configuration for the console UI.
- `console-ui-route.yaml`: Route configuration for the UI.
- `console-ui-service.yaml`: Service definition for the UI.
- `kustomization.yaml`: Kustomize configuration to orchestrate the deployment.

The `overlays/dev/` directory contains a `kustomization.yaml` for environment-specific customizations.

### Prerequisites

- A running OpenShift cluster.
- `oc` CLI installed.
- A running RHTAS instance to retrieve the TUF route URL.

### Deployment Steps

1. **Set TUF_REPO_URL using a ConfigMap**:

   Before deploying, you need to retrieve the TUF repository URL from your running RHTAS instance. This value should be stored in a ConfigMap that the console backend can consume.
   - Retrieve the TUF route URL from your running RHTAS instance:

   ```bash
   oc get tuf -o jsonpath='{.items[0].status.url}'
   ```

   - Create a ConfigMap with the retrieved URL:

   ```bash
   oc create configmap tuf-repo-config \
   --from-literal=TUF_REPO_URL=<output-from-above-command> \
   -n trusted-artifact-signer
   ```

2. **Apply the Deployment**:

   Ensure that an RHTAS instance is properly deployed and running in the `trusted-artifact-signer` namespace.

   Deploy the console using Kustomize:

   ```bash
   oc apply -k https://github.com/securesign/rhtas-console-ui/deployment/overlays/dev?ref=v0.1.0
   ```

3. **Verify the Deployment**:

   Check the status of the deployed resources:

   ```bash
   oc get pods,services,routes -n trusted-artifact-signer
   ```

   You can access the console via a browser using the UI route:

   ```bash
   oc get route console-ui -o jsonpath='https://{.spec.host}{"\n"}'
   ```

4. **Deletion**:

   To delete the deployed resources:

   ```bash
   oc delete -k https://github.com/securesign/rhtas-console-ui/deployment/overlays/dev?ref=v0.1.0
   ```
