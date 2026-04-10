import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("auth_token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex justify-center mb-6">
          <BarChart3 size={64} className="text-blue-600" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100">
          DevMetrics
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400">
          Real-time development metrics and deployment tracking
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-6 text-lg font-bold shadow-lg shadow-blue-500/20 cursor-pointer">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg" className="px-8 py-6 text-lg font-bold shadow-lg shadow-blue-500/20 cursor-pointer">
                Sign In to Get Started
              </Button>
            </Link>
          )}
          <Link href="/docs">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-bold cursor-pointer">
              Documentation
            </Button>
          </Link>
        </div>

        <div className="pt-12 text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>Built with Next.js 15 • TypeScript • Tailwind CSS v4</p>
          <p>SSR • ISR • SSG • Server Actions • Edge Middleware</p>
        </div>
      </div>
    </div>
  );
}
