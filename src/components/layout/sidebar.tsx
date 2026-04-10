"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  Menu,
  X,
  BarChart3,
  Zap,
  BookOpen,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: "MAIN",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: BarChart3,
        },
        { href: "/dashboard/deploys", label: "Deploys", icon: Zap },
        { href: "/dashboard/services", label: "Services", icon: TrendingUp },
        {
          href: "/leaderboard",
          label: "Leaderboard",
          icon: TrendingUp,
        },
      ],
    },
    {
      label: "MONITORING",
      items: [
        {
          href: "/dashboard/incidents",
          label: "Incidents",
          icon: AlertTriangle,
        },
        { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
        {
          href: "/dashboard/metrics",
          label: "Metrics",
          icon: BarChart3,
        },
      ],
    },
    {
      label: "CONTENT",
      items: [
        { href: "/docs", label: "Documentation", icon: BookOpen },
        { href: "/docs/changelog", label: "Changelog", icon: BookOpen },
      ],
    },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 md:hidden text-slate-900 dark:text-slate-100"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-transform duration-300 transform md:translate-x-0 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-8">
          {navItems.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-3">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all group ${
                          active
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon size={18} className={active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"} />
                        <span className="text-sm flex-1">{item.label}</span>
                        {item.label === "Alerts" && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            2
                          </span>
                        )}
                        {item.label === "Documentation" && (
                          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                            S5G
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
