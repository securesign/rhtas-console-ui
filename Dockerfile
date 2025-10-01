# Builder image
FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS builder

USER 1001
COPY --chown=1001 . .

RUN \
  npm version && \
  npm config ls && \
  npm clean-install --verbose --ignore-scripts --no-audit && \
  npm run build && \
  npm run dist

# Runner image
FROM registry.access.redhat.com/ubi9/nodejs-22-minimal:latest

# Add ps package to allow liveness probe for k8s cluster
# Add tar package to allow copying files with kubectl scp
USER 0
RUN microdnf -y install tar procps-ng && microdnf clean all

USER 1001

LABEL name="securesign/rhtas-console-ui" \
      description="RHTAS Console - User Interface" \
      help="For more information visit https://github.com/securesign/" \
      license="Apache License 2.0" \
      summary="RHTAS Console - User Interface" \
      url="https://github.com/securesign/rhtas-console-ui" \
      usage="podman run -p 80 -v securesign/rhtas-console-ui:latest" \
      io.k8s.display-name="rhtas-console-ui" \
      io.k8s.description="RHTAS Console - User Interface" \
      io.openshift.expose-services="80:http" \
      io.openshift.tags="operator,securesign,rhtas,ui,nodejs22" \
      io.openshift.min-cpu="100m" \
      io.openshift.min-memory="350Mi" \
      com.redhat.component="rhtas-console"

COPY --from=builder /opt/app-root/src/dist /opt/app-root/dist/

ENV DEBUG=1

WORKDIR /opt/app-root/dist
ENTRYPOINT ["./entrypoint.sh"]
