import type { SystemHealthResponse } from "@app/client";

export const systemHealthMock: SystemHealthResponse = {
  sigstoreServices: "healthy",
  rekorStatus: "unhealthy",
  tufStatus: "healthy",
  updatedAt: "2026-06-30T09:18:32.658987Z",
};
