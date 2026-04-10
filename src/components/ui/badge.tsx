import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    default: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface StatusDotProps {
  status: "healthy" | "degraded" | "down" | "unknown" | "success" | "failed" | "pending";
  className?: string;
}

export function StatusDot({ status, className = "" }: StatusDotProps) {
  const statusClasses = {
    healthy: "bg-green-500",
    degraded: "bg-yellow-500",
    down: "bg-red-500",
    unknown: "bg-slate-400",
    success: "bg-green-500",
    failed: "bg-red-500",
    pending: "bg-gray-400",
  };

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${statusClasses[status]} ${className}`}
    />
  );
}

export function StatusBadge({
  status,
}: Readonly<{ status: "healthy" | "degraded" | "down" | "unknown" | "success" | "failed" }>) {
  const statusConfig = {
    healthy: { label: "Healthy", variant: "success" as const },
    degraded: { label: "Degraded", variant: "warning" as const },
    down: { label: "Down", variant: "danger" as const },
    unknown: { label: "Unknown", variant: "default" as const },
    success: { label: "Success", variant: "success" as const },
    failed: { label: "Failed", variant: "danger" as const },
  };

  const config = statusConfig[status];

  return <Badge variant={config?.variant}>{config?.label}</Badge>;
}
