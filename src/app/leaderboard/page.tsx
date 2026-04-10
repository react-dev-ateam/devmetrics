import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLeaderboard } from "@/lib/api-client";
import { Flame } from "lucide-react";

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard("force-cache");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Leaderboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Top contributors by deployments, PRs, and incidents resolved
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contributor Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Contributor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Deployments
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    PRs Merged
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Incidents Resolved
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.data.map((entry) => (
                  <tr
                    key={entry.rank}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          entry.rank === 1
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : entry.rank === 2
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                              : entry.rank === 3
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100"
                        }`}
                      >
                        {entry.rank}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {entry.user.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {entry.deployments}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {entry.prs_merged}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {entry.incidents_resolved}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="success" className="flex items-center gap-1 w-fit">
                        <Flame size={12} /> {Math.round(entry.score)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
