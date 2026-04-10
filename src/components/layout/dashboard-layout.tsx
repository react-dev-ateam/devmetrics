import React from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { getUserEmail } from "@/actions/auth";

export async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const email = await getUserEmail();
  let userInitials = "U";
  
  if (email) {
    const namePart = email.split('@')[0];
    const parts = namePart.split(/[\.\-\_]/);
    if (parts.length >= 2) {
      userInitials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      userInitials = parts[0].substring(0, 2).toUpperCase();
    }
  }

  return (
    <>
      <Sidebar />
      <TopNav userInitials={userInitials} />
      <main className="md:ml-64 mt-14 min-h-screen bg-[#f8fafc] dark:bg-[#020617] cq-container">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">{children}</div>
      </main>
    </>
  );
}
