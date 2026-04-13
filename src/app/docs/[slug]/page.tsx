import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { getDocs, getDocBySlug } from "@/lib/api-client";

import ReactMarkdown from "react-markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const docsResponse = await getDocs("force-cache");
    return docsResponse.data.map((doc) => ({
      slug: doc.slug,
    }));
  } catch {
    return [];
  }
}

interface DocsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DocsPage({ params }: Readonly<DocsPageProps>) {
  const { slug } = await params;

  let doc;
  try {
    doc = await getDocBySlug(slug, "force-cache");
  } catch {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Documentation not found
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            The page you are looking for does not exist.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {doc.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>
                {doc.body}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
