import React from "react";
import Link from "next/link";
import { getDocs } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function DocsIndex() {
  let docs: { slug: string; title: string; lastUpdated: string }[] = [];
  try {
    const docsResponse = await getDocs("force-cache");
    docs = docsResponse.data;
  } catch {
    console.error("Failed to fetch docs");
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Documentation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Explore our comprehensive documentation and guides
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {doc.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  No documentation available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
