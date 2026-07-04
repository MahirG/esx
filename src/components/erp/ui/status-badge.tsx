"use client";

import { cn } from "@/lib/utils";

type StatusType =
  | "completed"
  | "pending"
  | "overdue"
  | "filed"
  | "active"
  | "inactive"
  | "online"
  | "offline"
  | "away"
  | "vip"
  | "regular"
  | "inactive"
  | "inStock"
  | "lowStock"
  | "outOfStock"
  | "sent"
  | "accepted"
  | "expired"
  | "warning"
  | "critical"
  | "ok"
  | "connected"
  | "leave"
  | "approved"
  | "rejected"
  | "draft";

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-primary/15 text-primary" },
  pending: { label: "Pending", className: "bg-accent/30 text-accent-foreground" },
  overdue: { label: "Overdue", className: "bg-destructive/15 text-destructive" },
  filed: { label: "Filed", className: "bg-primary/15 text-primary" },
  active: { label: "Active", className: "bg-primary/15 text-primary" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
  online: { label: "Online", className: "bg-primary/15 text-primary" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground" },
  away: { label: "Away", className: "bg-accent/30 text-accent-foreground" },
  vip: { label: "VIP", className: "bg-[oklch(0.72_0.13_75)]/20 text-[oklch(0.55_0.10_75)]" },
  regular: { label: "Regular", className: "bg-muted text-muted-foreground" },
  inStock: { label: "In Stock", className: "bg-primary/15 text-primary" },
  lowStock: { label: "Low Stock", className: "bg-accent/30 text-accent-foreground" },
  outOfStock: { label: "Out of Stock", className: "bg-destructive/15 text-destructive" },
  sent: { label: "Sent", className: "bg-primary/15 text-primary" },
  accepted: { label: "Accepted", className: "bg-primary/20 text-primary" },
  expired: { label: "Expired", className: "bg-destructive/15 text-destructive" },
  warning: { label: "Warning", className: "bg-accent/30 text-accent-foreground" },
  critical: { label: "Critical", className: "bg-destructive/15 text-destructive" },
  ok: { label: "OK", className: "bg-primary/15 text-primary" },
  connected: { label: "Connected", className: "bg-primary/15 text-primary" },
  leave: { label: "On Leave", className: "bg-accent/30 text-accent-foreground" },
  approved: { label: "Approved", className: "bg-primary/15 text-primary" },
  rejected: { label: "Rejected", className: "bg-destructive/15 text-destructive" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label || config.label}
    </span>
  );
}
