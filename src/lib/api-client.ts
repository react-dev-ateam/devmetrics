import { cache } from "react";
import {
  Deployment,
  Service,
  Incident,
  LeaderboardEntry,
  DocPage,
  DashboardSummary,
  ListResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: options.cache || "no-store",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Deployments
export async function getDeployments(
  cache?: RequestCache,
  options?: {
    workspace_id?: string;
    page?: number;
    limit?: number;
    status?: string;
  }
): Promise<ListResponse<Deployment>> {
  const params = new URLSearchParams();
  if (options?.workspace_id) params.append("workspace_id", options.workspace_id);
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.status) params.append("status", options.status);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiCall(`/api/deployments${query}`, { cache });
}

export async function triggerDeployment(data: {
  serviceId: string;
  branch: string;
  environment: "production" | "staging" | "development" | "preview";
}): Promise<Deployment> {
  return apiCall("/api/deployments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Services
export const getServices = cache(async (cacheConfig?: RequestCache): Promise<ListResponse<Service>> => {
  return apiCall("/api/services", { cache: cacheConfig });
});

// Metrics
export const getMetrics = cache(async (cacheConfig?: RequestCache): Promise<DashboardSummary> => {
  return apiCall("/api/metrics", { cache: cacheConfig });
});

// Incidents
export const getIncidents = cache(async (
  status?: string,
  cacheConfig?: RequestCache
): Promise<ListResponse<Incident>> => {
  const query = status ? `?status=${status}` : "";
  return apiCall(`/api/incidents${query}`, { cache: cacheConfig });
});

export async function acknowledgeIncident(
  id: string,
  acknowledged_by: string
): Promise<Incident> {
  return apiCall(`/api/incidents/${id}/acknowledge`, {
    method: "PATCH",
    body: JSON.stringify({ acknowledged_by }),
  });
}

// Leaderboard
export const getLeaderboard = cache(async (
  cacheConfig?: RequestCache
): Promise<ListResponse<LeaderboardEntry>> => {
  return apiCall("/api/leaderboard", { cache: cacheConfig });
});

// Docs
export const getDocs = cache(async (cacheConfig?: RequestCache): Promise<ListResponse<DocPage>> => {
  return apiCall("/api/docs", { cache: cacheConfig });
});

export const getDocBySlug = cache(async (
  slug: string,
  cacheConfig?: RequestCache
): Promise<DocPage> => {
  const response = await apiCall<{ data: DocPage }>(`/api/docs/${slug}`, { cache: cacheConfig });
  return response.data;
});

// Stream
export function getMetricsStream(token?: string): EventSource {
  const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
  return new EventSource(`${BASE_URL}/api/metrics/stream${tokenParam}`);
}
