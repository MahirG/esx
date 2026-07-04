"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  subtitle?: string;
  accent?: "emerald" | "amber" | "terracotta" | "deep";
}

export function KPICard({
  title,
  value,
  change,
  icon,
  subtitle,
  accent = "emerald",
}: KPICardProps) {
  const accentColors = {
    emerald: "bg-primary/10 text-primary",
    amber: "bg-accent/20 text-accent-foreground",
    terracotta: "bg-[oklch(0.60_0.10_35)]/10 text-[oklch(0.60_0.10_35)]",
    deep: "bg-[oklch(0.40_0.10_162)]/10 text-[oklch(0.40_0.10_162)]",
  };

  return (
    <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            )}
            {typeof change === "number" && (
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
                    change >= 0
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center",
              accentColors[accent]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
