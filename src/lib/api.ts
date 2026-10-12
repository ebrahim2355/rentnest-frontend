import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { ApiError, buildQuery, parseApiResponse, type QueryParams } from "@/lib/http";
import type { ApiResponse } from "@/types";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: QueryParams;
}

const request = async <T>(path: string, { method = "GET", body, params }: RequestOptions = {}): Promise<ApiResponse<T>> => {
  let response: Response;

  try {
    response = await fetch(`${path}${buildQuery(params)}`, {
      method,
      ...(body !== undefined ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new ApiError("Network error", 0, "Could not reach the server. Check your connection and try again.");
  }

  return parseApiResponse<T>(response);
};

const backend = (path: string) => `/api/backend${path}`;

export const api = {
  get: <T>(path: string, params?: QueryParams) => request<T>(backend(path), params ? { params } : {}),
  post: <T>(path: string, body?: unknown) => request<T>(backend(path), { method: "POST", body: body ?? {} }),
  put: <T>(path: string, body: unknown) => request<T>(backend(path), { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(backend(path), { method: "PATCH", body: body ?? {} }),
  delete: <T>(path: string) => request<T>(backend(path), { method: "DELETE" }),
};

export const authApi = {
  login: <T>(body: unknown) => request<T>("/api/auth/login", { method: "POST", body }),
  register: <T>(body: unknown) => request<T>("/api/auth/register", { method: "POST", body }),
  logout: () => request<null>("/api/auth/logout", { method: "POST", body: {} }),
};

export const getErrorText = (error: unknown) => {
  if (error instanceof ApiError) {
    const description = Array.isArray(error.details) ? error.details.map((detail) => detail.message).join(". ") : error.details;

    return {
      title: error.message,
      description: description === error.message ? undefined : description,
    };
  }

  return {
    title: "Something went wrong",
    description: error instanceof Error ? error.message : undefined,
  };
};

export const showErrorToast = (error: unknown) => {
  const { title, description } = getErrorText(error);

  toast.error(title, description ? { description } : undefined);
};

export const applyFieldErrors = <T extends FieldValues>(error: unknown, setError: UseFormSetError<T>, fields: readonly Path<T>[]) => {
  if (!(error instanceof ApiError) || !Array.isArray(error.details)) {
    return false;
  }

  let applied = false;

  error.details.forEach((detail) => {
    const field = fields.find((name) => name === detail.field);

    if (field) {
      setError(field, { type: "server", message: detail.message });
      applied = true;
    }
  });

  return applied;
};

export { ApiError };
