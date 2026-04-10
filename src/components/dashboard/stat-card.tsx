import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  className = "",
}: Readonly<StatCardProps>) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {value}
          </p>

          {change !== undefined && (
            <div
              className={`mt-2 flex items-center gap-1 text-sm font-medium ${
                changeType === "increase"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {changeType === "increase" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>
                {changeType === "increase" ? "+" : "-"}
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className="text-slate-400 dark:text-slate-600">{icon}</div>
        )}
      </div>
    </div>
  );
}
