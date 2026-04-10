import React from "react";
import { Service } from "@/types";
import { StatusDot, StatusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "@/lib/date-utils";

interface ServicesTableProps {
  services: Service[];
}

export function ServicesTable({ services }: Readonly<ServicesTableProps>) {
  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="px-6 pt-5 pb-4 mb-0 border-b border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Services
          </CardTitle>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {services.length} total
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/70 bg-slate-50/60 dark:bg-slate-800/30">
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Last Deploy
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Team Owner
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Service Name */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-1.5 h-8 rounded-full flex-shrink-0 ${
                          service.status === "healthy"
                            ? "bg-green-500"
                            : service.status === "degraded"
                              ? "bg-yellow-500"
                              : service.status === "down"
                                ? "bg-red-500"
                                : "bg-slate-400"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {service.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">{service.uptime.toFixed(2)}% uptime</p>
                      </div>
                    </div>
                  </td>

                  {/* Health Status */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        {service.status === "healthy" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                        )}
                        <StatusDot status={service.status} className="relative" />
                      </span>
                      <StatusBadge status={service.status} />
                    </div>
                  </td>

                  {/* Last Deploy */}
                  <td className="px-6 py-3.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {formatDistanceToNow(new Date(service.last_deploy_at))} ago
                  </td>

                  {/* Environment */}
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        service.environment === "production"
                          ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800/50"
                          : service.environment === "staging"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50"
                      }`}
                    >
                      {service.environment}
                    </span>
                  </td>

                  {/* Team Owner */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm">
                        {service.owner?.avatar ||
                          service.owner?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() ||
                          "?"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                          {service.owner?.name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight">{service.owner?.role || ""}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
