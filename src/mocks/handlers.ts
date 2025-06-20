import { http, HttpResponse } from 'msw';

export const handlers = [
  // healthz
  http.get('http://localhost:8080/healthz', () => {
    return HttpResponse.json({});
  }),

  // artifacts: sign
  http.get('http://localhost:8080/api/v1/artifacts/sign', () => {
    return HttpResponse.json({});
  }),

  // artifacts: verify
  http.get('http://localhost:8080/api/v1/artifacts/verify', () => {
    return HttpResponse.json({});
  }),

  // artifacts: policies
  http.get('http://localhost:8080/api/v1/artifacts/{artifact}/policies', () => {
    return HttpResponse.json({});
  }),

  // rekor: entries
  http.get('http://localhost:8080/api/v1/rekor/entries/{uuid}', () => {
    return HttpResponse.json({});
  }),

  // rekor: public key
  http.get('http://localhost:8080/api/v1/rekor/public-key', () => {
    return HttpResponse.json({});
  }),

  // trust config
  http.get('http://localhost:8080/api/v1/trust/config', () => {
    return HttpResponse.json({});
  }),
];
