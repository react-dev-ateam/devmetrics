import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { ServicesTable } from "@/components/dashboard/services-table";
import { DeployTrigger } from "@/components/dashboard/deploy-trigger";
import { IncidentPanel } from "@/components/dashboard/incident-panel";
import { ActivityFeedServer } from "@/components/dashboard/activity-feed-server";
import { getMetrics, getServices, getIncidents } from "@/lib/api-client";
import {
  Rocket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key"
);

// Mark as dynamic - fresh data on every request
export const dynamic = "force-dynamic";

function ActivityFeedSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  let userEmail = "Partner";

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      userEmail = (payload.email as string) || "Partner";
    } catch (e) {
      console.error("Failed to decode token for personalization", e);
    }
  }

  const [summary, servicesResponse, incidentsResponse] = await Promise.all([
    getMetrics("no-store"),
    getServices("no-store"),
    getIncidents("open", "no-store"),
  ]);

  const services = servicesResponse.data;
  const openIncidents = incidentsResponse.data;

  // Compute avg build time in seconds from ms
  const avgBuildSec = (summary.avg_build_ms / 1000).toFixed(1);

  return (
    <DashboardLayout>
      {/* ── Dashboard Header ─────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back,{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {userEmail.split("@")[0]}
                </span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/50">
                SSR · force-dynamic
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time engineering telemetry for{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {userEmail}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:flex items-center gap-2 px-4 border-slate-200 dark:border-slate-700"
            >
              Last 7 days <ChevronDown size={14} />
            </Button>
            <DeployTrigger />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Deployments Today"
          value={summary.deployments_today}
          icon={<Rocket size={18} />}
          change={12}
          changeType="increase"
        />
        <StatCard
          title="Build Success Rate"
          value={`${summary.success_rate.toFixed(1)}%`}
          icon={<CheckCircle2 size={18} />}
          change={0.8}
          changeType="increase"
        />
        <StatCard
          title="Avg Build Time"
          value={`${avgBuildSec}s`}
          icon={<Clock size={18} />}
          change={5}
          changeType="decrease"
        />
        <StatCard
          title="Active Incidents"
          value={summary.active_incidents}
          icon={<AlertTriangle size={18} />}
          change={openIncidents.length > 0 ? openIncidents.length : undefined}
          changeType="decrease"
          className={
            summary.active_incidents > 0
              ? "border-red-200 dark:border-red-800/50"
              : ""
          }
        />
      </div>

      {/* ── Services Table ───────────────────────────────────── */}
      <div className="mb-6">
        <ServicesTable services={services} />
      </div>

      {/* ── Incidents + Activity Feed (2-col on large screens) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Incident Panel */}
        <IncidentPanel incidents={openIncidents} />

        {/* Real-time Activity Feed */}
        <Suspense
          fallback={
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/70">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Real-time Activity Feed
                </p>
              </div>
              <ActivityFeedSkeleton />
            </div>
          }
        >
          <ActivityFeedServer />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
