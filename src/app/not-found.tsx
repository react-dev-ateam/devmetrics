import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg mx-auto">
        <div className="relative inline-block animate-bounce">
          <Ghost size={120} className="text-blue-600/20 dark:text-blue-400/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black text-blue-600 dark:text-blue-500">404</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Oops! The page you&apos;re looking for has drifted into deep space or never existed at all.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <Search size={18} className="text-slate-400" />
            <span className="text-sm text-slate-400">Searching for answers...</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button size="md" className="w-full h-11 flex items-center justify-center gap-2 cursor-pointer">
                <MoveLeft size={16} /> Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-8 text-xs font-medium text-slate-400 uppercase tracking-[0.2em]">
          DevMetrics Systems Monitoring
        </div>
      </div>
    </div>
  );
}
