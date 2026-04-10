import React from "react";
import { getMetrics, getServices } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";

export default async function EmbedWidgetPage() {
  const summary = await getMetrics("no-store");
  const servicesResponse = await getServices("no-store");
  const services = servicesResponse.data;

  const totalServices = services.length;
  const healthyServices = services.filter((s) => s.status === "healthy").length;

  return (
    <div className="p-4 bg-white dark:bg-slate-800">
      {/* Compact widget layout for iframes */}
      <div className="max-w-2xl">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">Deployments</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {summary.deployments_today}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">Healthy</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {healthyServices}/{totalServices}
            </p>
          </div>
        </div>

        {/* Compact services list */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
            Services
          </h3>
          {services.slice(0, 5).map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-2 rounded text-sm"
            >
              <span className="text-slate-900 dark:text-slate-100 truncate">
                {service.name}
              </span>
              <Badge
                variant={
                  service.status === "healthy"
                    ? "success"
                    : service.status === "degraded"
                      ? "warning"
                      : "danger"
                }
                className="text-xs"
              >
                {service.status}
              </Badge>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
          Powered by DevMetrics
        </p>
      </div>
    </div>
  );
}
