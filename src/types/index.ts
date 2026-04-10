// ─────────────────────────────────────────────────────────────
// Utility Types
// ─────────────────────────────────────────────────────────────
export type ISODateString = string; // ISO 8601 format: "2025-04-10T14:02:00Z"
export type UUID = string; // e.g., "usr_riya", "svc_api-gateway", "dep_001"

// ─────────────────────────────────────────────────────────────
// User & Role
// ─────────────────────────────────────────────────────────────
export type UserRole = "Lead Engineer" | "Engineer" | "DevOps" | "Manager" | "Intern";

export interface User {
  id: UUID;
  name: string;
  avatar: string; // Initials or URL
  role: UserRole;
}

// ─────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────
export type ServiceStatus = "healthy" | "degraded" | "down" | "unknown";
export type Environment = "production" | "staging" | "development" | "preview";

export interface Service {
  id: UUID;
  name: string; // e.g., "api-gateway"
  status: ServiceStatus;
  uptime: number; // Percentage: 99.98
  owner: User; // API returns embedded user object
  environment: Environment;
  last_deploy_at: ISODateString;
  avg_build_ms: number; // Average build duration in milliseconds
}

// ─────────────────────────────────────────────────────────────
// Deployment
// ─────────────────────────────────────────────────────────────
export type DeploymentStatus = "success" | "failed" | "pending" | "cancelled" | "running";

export interface Commit {
  sha: string; // Short SHA: "a1b2c3d"
  message: string; // Conventional commit format: "fix: rate limiter edge case"
}

export interface Deployment {
  id: UUID;
  service_id: UUID; // Reference to Service.id
  branch: string; // Git branch name
  environment: Environment;
  status: DeploymentStatus;
  duration_ms: number; // Deployment duration in milliseconds
  triggered_by: UUID; // Reference to User.id
  commit: Commit;
  created_at: ISODateString;
}

// ─────────────────────────────────────────────────────────────
// Daily Metrics
// ─────────────────────────────────────────────────────────────
export interface DailyDeploymentCounts {
  date: ISODateString; // Date only: "2025-04-04"
  success: number;
  failed: number;
}

// ─────────────────────────────────────────────────────────────
// Incident
// ─────────────────────────────────────────────────────────────
export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "acknowledged" | "resolved" | "closed";

export interface Incident {
  id: UUID;
  service_id: UUID; // Reference to Service.id
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  created_at: ISODateString;
  acknowledged_by: UUID | null; // Reference to User.id, null if not acknowledged
  acknowledged_at: ISODateString | null;
}

// ─────────────────────────────────────────────────────────────
// Leaderboard
// ─────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number; // 1-based ranking
  user: User; // Embedded user object (or use UUID + join elsewhere)
  deployments: number; // Total deployments by this user
  prs_merged: number; // Pull requests merged
  incidents_resolved: number; // Incidents resolved
  score: number; // Computed score (e.g., weighted sum)
}

// ─────────────────────────────────────────────────────────────
// Documentation
// ─────────────────────────────────────────────────────────────
export interface DocPage {
  slug: string; // URL-friendly identifier: "getting-started"
  title: string;
  lastUpdated: ISODateString; // Date only for display
  body: string; // Markdown content
}

// ─────────────────────────────────────────────────────────────
// API Response Shapes
// ─────────────────────────────────────────────────────────────
export interface ListResponse<T> {
  data: T[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface DashboardSummary {
  deployments_today: number;
  success_rate: number;
  avg_build_ms: number;
  active_incidents: number;
  daily_counts: DailyDeploymentCounts[];
}

// ─────────────────────────────────────────────────────────────
// Activity Feed Event
// ─────────────────────────────────────────────────────────────
export type ActivityFeedEventType = "deployment_started" | "deployment_success" | "build_failed" | "service_alert" | "metric_update";

export interface ActivityFeedEvent {
  id: string;
  type: ActivityFeedEventType;
  service?: string;
  environment?: string;
  duration_ms?: number;
  error?: string;
  severity?: "info" | "warning" | "error" | "high";
  message?: string;
  success_rate?: string | number;
  active_deployments?: number;
  ts: number;
}
