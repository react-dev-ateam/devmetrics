"use client";

import React, { useOptimistic, useTransition } from "react";
import { Incident } from "@/types";
import { acknowledgeIncident } from "@/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

interface IncidentPanelProps {
  incidents: Incident[];
}

const SEVERITY_CONFIG = {
  critical: {
    dot: "bg-red-500",
    label: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800/50",
    bar: "bg-gradient-to-b from-red-500 to-rose-600",
  },
  high: {
    dot: "bg-orange-500",
    label: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800/50",
    bar: "bg-gradient-to-b from-orange-500 to-amber-600",
  },
  medium: {
    dot: "bg-yellow-500",
    label: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800/50",
    bar: "bg-gradient-to-b from-yellow-400 to-amber-500",
  },
  low: {
    dot: "bg-blue-400",
    label: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50",
    bar: "bg-gradient-to-b from-blue-400 to-indigo-500",
  },
};

export function IncidentPanel({ incidents }: Readonly<IncidentPanelProps>) {
  const [optimisticIncidents, removeOptimistic] = useOptimistic<
    Incident[],
    string
  >(incidents, (current, resolvedId) =>
    current.filter((inc) => inc.id !== resolvedId)
  );
  const [isPending, startTransition] = useTransition();

  async function handleAcknowledge(incidentId: string) {
    startTransition(async () => {
      removeOptimistic(incidentId);
      await acknowledgeIncident({
        incident_id: incidentId,
        acknowledged_by: "dashboard-user",
      });
    });
  }

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="px-6 pt-5 pb-4 mb-0 border-b border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-500" />
            Open Incidents
          </CardTitle>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
              optimisticIncidents.length > 0
                ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-800/50"
                : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-800/50"
            }`}
          >
            {optimisticIncidents.length} open
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {optimisticIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <ShieldCheck size={36} className="text-green-500" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              All clear — no open incidents
            </p>
            <p className="text-[11px] text-slate-400">Nice work, team! 🎉</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {optimisticIncidents.map((incident) => {
              const cfg = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG.low;
              return (
                <li
                  key={incident.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Severity bar */}
                  <div className={`w-1 h-10 rounded-full flex-shrink-0 ${cfg.bar}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`relative flex h-2 w-2`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.dot}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {incident.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${cfg.label}`}
                      >
                        {incident.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {incident.id}
                      </span>
                    </div>
                  </div>

                  {/* Acknowledge button */}
                  <button
                    onClick={() => handleAcknowledge(incident.id)}
                    disabled={isPending}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide bg-slate-100 hover:bg-green-50 text-slate-500 hover:text-green-700 dark:bg-slate-800 dark:hover:bg-green-900/30 dark:text-slate-400 dark:hover:text-green-400 border border-slate-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Acknowledge incident ${incident.id}`}
                  >
                    {isPending ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={11} />
                    )}
                    Resolve
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
