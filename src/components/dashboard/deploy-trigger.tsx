"use client";

import React, { useState, useOptimistic, useActionState, useEffect, useCallback } from "react";
import { Zap, CheckCircle2, Loader2, AlertCircle, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deployService, DeploymentInput } from "@/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeployTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [lastResult, action, isPending] = useActionState(async (_prevState: unknown, formData: FormData) => {
    const data: DeploymentInput = {
      serviceId: (formData.get("serviceId") as string) || "",
      branch: (formData.get("branch") as string) || "",
      environment: (formData.get("environment") as string) || "staging",
    };

    addOptimisticMessage("Deployment initiated...");

    const result = await deployService(data);

    // Close modal on success after a short delay
    if (!result.error && !result.fieldErrors) {
      setTimeout(() => {
        setIsModalOpen(false);
        setFormKey(prev => prev + 1); // Reset form for next time
      }, 2000);
    }

    return result;
  }, null);

  const [optimisticMessage, addOptimisticMessage] = useOptimistic<string | null, string>(
    null,
    (_, newMessage) => newMessage
  );

  // Reset form when modal is manually closed
  const handleClose = useCallback(() => {
    if (isPending) return;
    setIsModalOpen(false);
    // We delay the key reset slightly to allow exit animation if any
    setTimeout(() => setFormKey(prev => prev + 1), 300);
  }, [isPending]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="sm"
        variant="primary"
        className="flex items-center gap-2 font-semibold shadow-sm group cursor-pointer"
      >
        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
        Trigger deploy
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 outline-none">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in duration-300">
            <Card className="shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                      <Zap size={18} className="fill-current" />
                    </div>
                    Deploy New Version
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Start a new deployment for your microservices</p>
                </div>
                <button
                  disabled={isPending}
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </CardHeader>

              <CardContent className="pt-6 pb-8">
                <form key={formKey} action={action} className="space-y-5" noValidate>
                  {/* UI Messages */}
                  {optimisticMessage && !lastResult?.error && (
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-2 animate-pulse">
                      <Loader2 size={14} className="animate-spin" />
                      {optimisticMessage}
                    </div>
                  )}

                  {lastResult?.data && !isPending && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
                      <CheckCircle2 size={16} />
                      Deployment Queued Successfully
                    </div>
                  )}

                  {lastResult?.error && !lastResult?.fieldErrors && !isPending && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2 animate-in shake duration-300">
                      <AlertCircle size={16} />
                      {lastResult.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-[0.1em] text-slate-400 dark:text-slate-500">
                        Service ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="serviceId"
                        required
                        defaultValue={lastResult?.inputs?.serviceId || ""}
                        placeholder="e.g. auth-service"
                        className={`w-full px-3 py-2 text-sm border rounded bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 outline-none transition-all ${lastResult?.fieldErrors?.serviceId
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                      />
                      {lastResult?.fieldErrors?.serviceId?.[0] && (
                        <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle size={10} /> {lastResult.fieldErrors.serviceId[0]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-[0.1em] text-slate-400 dark:text-slate-500">
                        Github Branch <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="branch"
                        required
                        defaultValue={lastResult?.inputs?.branch || ""}
                        placeholder="e.g. main"
                        className={`w-full px-3 py-2 text-sm border rounded bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 outline-none transition-all ${lastResult?.fieldErrors?.branch
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                      />
                      {lastResult?.fieldErrors?.branch?.[0] && (
                        <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle size={10} /> {lastResult.fieldErrors.branch[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-[0.1em] text-slate-400 dark:text-slate-500">
                      Destination Environment <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="environment"
                      defaultValue={lastResult?.inputs?.environment || "staging"}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                      <option value="development">Development</option>
                      <option value="preview">Preview</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isPending}
                      disabled={isPending}
                      className="flex-1 py-5 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 cursor-pointer"
                    >
                      Process Deployment
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleClose}
                      disabled={isPending}
                      className="px-8 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
