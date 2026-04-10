"use client";

import React, { useState } from "react";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

interface TopNavProps {
  workspace?: string;
  sseStatus?: boolean;
  userInitials?: string;
}

export function TopNav({ workspace = "acme-corp workspace", sseStatus = true, userInitials = "U" }: TopNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Services", href: "/services" },
    { label: "Docs", href: "/docs" },
    { label: "Settings", href: "/settings" },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center px-4">
      <div className="flex items-center gap-8 w-full">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white hidden md:block">DevMetrics</span>
        </div>

        {/* Global Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive(link.href)
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side status & profile */}
        <div className="ml-auto flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-800/50">
            <div className={`w-2 h-2 rounded-full ${sseStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
              SSE {sseStatus ? 'Live' : 'Offline'}
            </span>
          </div>

          <span className="hidden sm:block text-xs font-medium text-slate-400">
            {workspace}
          </span>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 group p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                {userInitials}
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                  <Settings size={16} /> Settings
                </button>
                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
