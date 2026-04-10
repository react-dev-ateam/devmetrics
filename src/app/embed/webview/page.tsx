import React from "react";
import { getMetrics, getServices } from "@/lib/api-client";
import { Badge, StatusDot } from "@/components/ui/badge";

export default async function EmbedWebViewPage() {
  const summary = await getMetrics("no-store");
  const servicesResponse = await getServices("no-store");
  const services = servicesResponse.data;

  const totalServices = services.length;
  const healthyServices = services.filter((s) => s.status === "healthy").length;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 safe-area-top safe-area-bottom">
      {/* Touch-optimized layout with safe area insets */}
      <div className="space-y-6 py-6 px-4">
        {/* Header */}
        <div className="safe-area-left safe-area-right">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            DevMetrics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Mobile Dashboard
          </p>
        </div>

        {/* Stats - Large touch targets */}
        <div className="space-y-4 safe-area-left safe-area-right">
          <div className="bg-blue-600 text-white rounded-2xl p-6">
            <p className="text-sm font-medium opacity-90">Deployments Today</p>
            <p className="text-4xl font-bold mt-2">{summary.deployments_today}</p>
          </div>
          <div className="bg-green-600 text-white rounded-2xl p-6">
            <p className="text-sm font-medium opacity-90">Healthy Services</p>
            <p className="text-4xl font-bold mt-2">
              {healthyServices}/{totalServices}
            </p>
          </div>
        </div>

        {/* Services List - Touch optimized */}
        <div className="safe-area-left safe-area-right">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Services
          </h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <StatusDot status={service.status} />
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {service.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {service.owner.name}
                  </p>
                </div>
                <Badge
                  variant={
                    service.status === "healthy"
                      ? "success"
                      : service.status === "degraded"
                        ? "warning"
                        : "danger"
                  }
                >
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pb-8 safe-area-left safe-area-right">
          <p>Real-time metrics • Last updated {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
