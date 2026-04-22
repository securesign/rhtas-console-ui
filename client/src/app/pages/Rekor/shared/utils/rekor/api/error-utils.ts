import { ApiError } from "rekor";

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message === "Failed to fetch";
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
