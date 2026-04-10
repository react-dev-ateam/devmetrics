import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={`mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <h3 className={`text-lg font-semibold text-slate-900 dark:text-slate-100 ${className}`}>{children}</h3>;
}

export function CardContent({
  children,
  className = "",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={`mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 ${className}`}>{children}</div>;
}
