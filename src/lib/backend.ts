import { API_URL } from "@/lib/server-api";

export interface BackendPayload {
  success: boolean;
  message: string;
  data?: unknown;
  meta?: unknown;
  errorDetails?: unknown;
}

interface BackendOptions {
  method?: string;
  body?: unknown;
  token?: string | undefined;
  search?: string;
}

interface BackendResult {
  ok: boolean;
  status: number;
  payload: BackendPayload;
}

export const callBackend = async (path: string, { method = "GET", body, token, search = "" }: BackendOptions = {}): Promise<BackendResult> => {
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${path}${search}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as BackendPayload | null;

    if (!payload) {
      return {
        ok: false,
        status: 502,
        payload: { success: false, message: "Invalid response from the API", errorDetails: "The RentNest API did not send a valid response" },
      };
    }

    return {
      ok: response.ok && payload.success === true,
      status: response.status,
      payload,
    };
  } catch {
    return {
      ok: false,
      status: 503,
      payload: { success: false, message: "The server is not reachable", errorDetails: "Could not connect to the RentNest API. Please try again in a moment." },
    };
  }
};
