"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth"; // Update path if needed
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use server action to sign JWT and set cookie
      const result = await login(email);
      
      if (result.success) {
        // Optional: Save user details in localStorage for client-side UI persistence
        localStorage.setItem("user_profile", JSON.stringify({ email, loginAt: new Date().toISOString() }));
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#020617] px-4 font-sans">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">DevMetrics</span>
          </div>
        </div>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
          <CardHeader className="pt-8 pb-6 text-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your credentials to access your account</p>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-[10px] text-blue-600 hover:underline font-semibold">Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400">Remember this device</label>
              </div>

              <Button
                type="submit"
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors py-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-xs text-slate-400">
          Any email and password combination will be accepted for this demo.
        </p>
      </div>
    </div>
  );
}
