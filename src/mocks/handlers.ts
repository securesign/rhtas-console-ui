import { http, HttpResponse } from 'msw';

export const handlers = [
  // healthz
  // Retrieves the current health status of the server.
  http.get('http://localhost:8080/healthz', () => {
    return HttpResponse.json({});
  }),

  // artifacts: sign
  // Signs an artifact using Cosign.
  http.get('http://localhost:8080/api/v1/artifacts/sign', () => {
    return HttpResponse.json({});
  }),

  // artifacts: verify
  // Verifies an artifact using Cosign.
  http.get('http://localhost:8080/api/v1/artifacts/verify', () => {
    return HttpResponse.json({});
  }),

  // artifacts: policies
  // Retrieves policies and attestations for an artifact.
  http.get('http://localhost:8080/api/v1/artifacts/{artifact}/policies', () => {
    return HttpResponse.json({});
  }),

  // artifacts: image
  // Retrieves metadata for a container image by full reference URI.
  http.get('http://localhost:8080/api/v1/artifacts/image', () => {
    return HttpResponse.json({});
  }),

  // rekor: entries
  // Retrieves a Rekor transparency log entry by UUID.
  http.get('http://localhost:8080/api/v1/rekor/entries/{uuid}', () => {
    return HttpResponse.json({});
  }),

  // rekor: public key
  // Retrieves the Rekor public key in PEM format.
  http.get('http://localhost:8080/api/v1/rekor/public-key', () => {
    return HttpResponse.json({});
  }),

  // trust config
  // Retrieves TUF targets and Fulcio certificate authorities.
  http.get('http://localhost:8080/api/v1/trust/config', () => {
    return HttpResponse.json({});
  }),
];
