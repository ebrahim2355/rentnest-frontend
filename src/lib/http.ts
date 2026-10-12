import type { ApiErrorDetail, ApiResponse } from "@/types";

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export class ApiError extends Error {
  status: number;
  details: string | ApiErrorDetail[];

  constructor(message: string, status: number, details: string | ApiErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const buildQuery = (params?: QueryParams) => {
  const search = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();

  return query ? `?${query}` : "";
};

export const parseApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  let body: (ApiResponse<T> & { errorDetails?: string | ApiErrorDetail[] }) | null = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.success) {
    throw new ApiError(body?.message || "Something went wrong", response.status, body?.errorDetails ?? "The server sent an unexpected response");
  }

  return body;
};
