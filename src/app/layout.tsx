import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevMetrics Dashboard",
  description: "Real-time development metrics and deployment tracking",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

async function getTheme() {
  const cookieStore = await cookies();
  return cookieStore.get("theme")?.value || "light";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={theme === "dark" ? "black-translucent" : "default"}
        />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
