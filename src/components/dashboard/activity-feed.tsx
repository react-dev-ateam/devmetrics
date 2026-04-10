"use client";

import React, { useEffect, useState } from "react";
import { ActivityFeedEvent } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { formatTime } from "@/lib/date-utils";
import { useEmbedBridge } from "@/hooks/useEmbedBridge";

interface ActivityFeedProps {
  initialEvents: ActivityFeedEvent[];
  streamUrl?: string;
}

export function ActivityFeed({
  initialEvents,
  streamUrl,
}: Readonly<ActivityFeedProps>) {
  const [events, setEvents] = useState<ActivityFeedEvent[]>(initialEvents);
  const { emit } = useEmbedBridge();

  useEffect(() => {
    if (!streamUrl) return;

    const eventSource = new EventSource(streamUrl);

    const handleEvent = (event: MessageEvent) => {
      try {
        const rawData = JSON.parse(event.data);
        const newEvent: ActivityFeedEvent = {
          ...rawData,
          id: rawData.id || Math.random().toString(36).substring(2, 9),
        };
        // Keep up to 50 events for the scrollbar
        setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);

        // Emit to host if embedded
        emit({ type: `metrics:${newEvent.type}`, data: newEvent });
      } catch (error) {
        console.error("Failed to parse event:", error);
      }
    };

    eventSource.addEventListener("deployment_started", handleEvent);
    eventSource.addEventListener("deployment_success", handleEvent);
    eventSource.addEventListener("build_failed", handleEvent);
    eventSource.addEventListener("service_alert", handleEvent);
    eventSource.addEventListener("metric_update", handleEvent);

    return () => {
      eventSource.close();
    };
  }, [streamUrl, emit]);

  const getEventMessage = (event: ActivityFeedEvent) => {
    switch (event.type) {
      case "metric_update":
        return `System Update: ${event.success_rate}% success rate, ${event.active_deployments} active deploys`;
      case "deployment_started":
        return `Deploying ${event.service} to ${event.environment}`;
      case "deployment_success":
        return `Successfully deployed ${event.service} in ${Math.round((event.duration_ms || 0) / 1000)}s`;
      case "build_failed":
        return `Build failed for ${event.service}: ${event.error}`;
      case "service_alert":
        return `Alert in ${event.service}: ${event.message}`;
      default:
        return event.message || "Unknown event";
    }
  };

  const getIcon = (type: ActivityFeedEvent["type"]) => {
    switch (type) {
      case "deployment_success":
        return <CheckCircle size={18} className="text-green-600 dark:text-green-400" />;
      case "build_failed":
        return <AlertCircle size={18} className="text-red-600 dark:text-red-400" />;
      case "service_alert":
        return <AlertTriangle size={18} className="text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Info size={18} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case "error":
        return <Badge variant="danger" className="text-[10px] px-1.5 py-0 h-4 uppercase">Error</Badge>;
      case "warning":
        return <Badge variant="warning" className="text-[10px] px-1.5 py-0 h-4 uppercase">Warning</Badge>;
      default:
        return <Badge variant="info" className="text-[10px] px-1.5 py-0 h-4 uppercase">Info</Badge>;
    }
  };

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3 border-b border-slate-50 dark:border-slate-800/50">
        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Real-time Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] overflow-y-auto px-5 py-4 custom-scrollbar">
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3" />
                <p className="text-xs font-medium italic">Waiting for incoming telemetry...</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/50 last:border-b-0 last:pb-0 group transition-all"
                >
                  <div className="flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                    {getIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {getEventMessage(event)}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex-shrink-0 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">
                        {formatTime(new Date(event.ts))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.service && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 uppercase tracking-wider">
                          {event.service}
                        </Badge>
                      )}
                      {(event.severity || event.type === 'build_failed') &&
                        getSeverityBadge(event.severity === 'high' ? 'error' : event.severity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
