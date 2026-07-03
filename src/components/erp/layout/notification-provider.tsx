"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Calendar, TrendingDown, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  read: boolean;
}

export function NotificationProvider() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Poll for dashboard data to generate notifications
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-notifications"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Poll for tax filings
  const { data: taxFilings } = useQuery({
    queryKey: ["tax-filings-notifications"],
    queryFn: async () => {
      const res = await fetch("/api/compliance/tax-filings");
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 120000,
  });

  // Compute notifications from data (not in effect to avoid cascading renders)
  const notifications: Notification[] = (() => {
    if (!dashboardData) return [];
    const newNotifs: Notification[] = [];

    // Low stock alerts
    if (dashboardData.inventory?.lowStockProducts) {
      dashboardData.inventory.lowStockProducts.forEach((product: any) => {
        const id = `lowstock-${product.id}`;
        if (!dismissed.includes(id)) {
          newNotifs.push({
            id,
            type: product.status === "outOfStock" ? "critical" : "warning",
            title: product.status === "outOfStock" ? "Out of Stock" : "Low Stock Alert",
            message: `${product.name} (${product.sku}) — ${product.quantity} units remaining at ${product.warehouse?.name}`,
            time: "Just now",
            icon: <AlertTriangle className="h-4 w-4" />,
            read: false,
          });
        }
      });
    }

    // Tax deadline alerts
    if (taxFilings) {
      const now = new Date();
      taxFilings.forEach((filing: any) => {
        if (filing.status === "filed") return;
        const dueDate = new Date(filing.dueDate);
        const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const id = `tax-${filing.id}`;

        if (dismissed.includes(id)) return;

        if (filing.status === "overdue" || daysUntil < 0) {
          newNotifs.push({
            id,
            type: "critical",
            title: "Tax Filing Overdue",
            message: `${filing.type} for ${filing.period} is overdue. Amount: ${filing.amount.toLocaleString()} ETB`,
            time: "Overdue",
            icon: <Calendar className="h-4 w-4" />,
            read: false,
          });
        } else if (daysUntil <= 7) {
          newNotifs.push({
            id,
            type: "warning",
            title: "Tax Deadline Approaching",
            message: `${filing.type} for ${filing.period} due in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Amount: ${filing.amount.toLocaleString()} ETB`,
            time: `${daysUntil}d left`,
            icon: <Calendar className="h-4 w-4" />,
            read: false,
          });
        }
      });
    }

    // Cash flow alert
    if (dashboardData.kpis) {
      const netProfit = dashboardData.kpis.netProfit;
      if (netProfit < 0) {
        const id = "cashflow-negative";
        if (!dismissed.includes(id)) {
          newNotifs.push({
            id,
            type: "critical",
            title: "Negative Cash Flow",
            message: `Your business is running at a loss of ${Math.abs(netProfit).toLocaleString()} ETB this period.`,
            time: "Just now",
            icon: <TrendingDown className="h-4 w-4" />,
            read: false,
          });
        }
      }

      // Compliance score alert
      const score = dashboardData.kpis.complianceScore;
      if (score < 70) {
        const id = "compliance-low";
        if (!dismissed.includes(id)) {
          newNotifs.push({
            id,
            type: "warning",
            title: "Low Compliance Score",
            message: `Your ERCA compliance score is ${score}/100. Review pending tax filings.`,
            time: "Just now",
            icon: <CheckCircle2 className="h-4 w-4" />,
            read: false,
          });
        }
      }
    }

    return newNotifs;
  })();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.type === "critical").length;

  const dismiss = (id: string) => {
    setDismissed([...dismissed, id]);
  };

  const dismissAll = () => {
    setDismissed(notifications.map((n) => n.id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center",
              criticalCount > 0 ? "bg-destructive" : "bg-primary"
            )}>
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={dismissAll}>
              Dismiss all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground mt-1">No pending alerts</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className="flex flex-col items-start gap-1 p-3 cursor-default"
            >
              <div className="flex items-start gap-2 w-full">
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  notif.type === "critical" && "bg-destructive/15 text-destructive",
                  notif.type === "warning" && "bg-accent/30 text-accent-foreground",
                  notif.type === "info" && "bg-primary/10 text-primary",
                  notif.type === "success" && "bg-primary/15 text-primary"
                )}>
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground">{notif.title}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(notif.id);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                    {notif.type === "critical" && (
                      <Badge variant="destructive" className="text-[10px] h-4">Urgent</Badge>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
