import { ApiError, buildQuery, parseApiResponse, type QueryParams } from "@/lib/http";
import type { ApiResponse } from "@/types";

export const API_URL = (process.env.API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export const serverFetch = async <T>(path: string, params?: QueryParams): Promise<ApiResponse<T>> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}${buildQuery(params)}`, { cache: "no-store" });
  } catch {
    throw new ApiError("The server is not reachable", 503, "Could not connect to the RentNest API");
  }

  return parseApiResponse<T>(response);
};
