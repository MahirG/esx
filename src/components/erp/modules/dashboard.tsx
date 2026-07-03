"use client";

import {
  TrendingUp,
  Wallet,
  Receipt,
  Users,
  Plus,
  ScanLine,
  ShoppingBag,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KPICard } from "@/components/erp/ui/kpi-card";
import { ChartCard } from "@/components/erp/ui/chart-card";
import { StatusBadge } from "@/components/erp/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/use-translation";
import { useERPStore } from "@/stores/erp-store";
import {
  dashboardKPIs,
  revenueTrend,
  expenseBreakdown,
  topProducts,
  recentTransactions,
  salesByRegion,
  inventoryAlerts,
  upcomingTaxDeadlines,
} from "@/lib/mock-data";
import { formatETB, formatNumber, formatPercent } from "@/lib/currency";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "oklch(1 0.005 85)",
  border: "1px solid oklch(0.90 0.015 85)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.20 0.02 160)",
};

export function DashboardModule() {
  const { t, isAmharic } = useTranslation();
  const setActiveModule = useERPStore((s) => s.setActiveModule);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: t.dashboard.newInvoice, icon: <FileText className="h-4 w-4" />, action: () => setActiveModule("finance") },
          { label: t.dashboard.addProduct, icon: <Plus className="h-4 w-4" />, action: () => setActiveModule("inventory") },
          { label: t.dashboard.recordSale, icon: <ShoppingBag className="h-4 w-4" />, action: () => setActiveModule("sales") },
          { label: t.dashboard.runPayroll, icon: <Wallet className="h-4 w-4" />, action: () => setActiveModule("hr") },
        ].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-3 flex flex-col items-center gap-1.5 text-xs sm:text-sm border-border/60 hover:border-primary/40 hover:bg-primary/5"
            onClick={action.action}
          >
            <span className="text-primary">{action.icon}</span>
            <span className="truncate">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title={t.dashboard.totalRevenue}
          value={formatETB(dashboardKPIs.totalRevenue, { compact: true })}
          change={dashboardKPIs.revenueGrowth}
          icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
        />
        <KPICard
          title={t.dashboard.netProfit}
          value={formatETB(dashboardKPIs.netProfit, { compact: true })}
          change={dashboardKPIs.profitGrowth}
          icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
        />
        <KPICard
          title={t.dashboard.vatCollected}
          value={formatETB(dashboardKPIs.vatCollected, { compact: true })}
          change={dashboardKPIs.vatGrowth}
          icon={<Receipt className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
        />
        <KPICard
          title={t.dashboard.activeEmployees}
          value={formatNumber(dashboardKPIs.activeEmployees)}
          change={dashboardKPIs.employeeGrowth}
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="terracotta"
        />
      </div>

      {/* Revenue Trend + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title={t.dashboard.revenueTrend}
          subtitle="Revenue vs Expenses vs Profit"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.52 0.14 162)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.52 0.14 162)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.60 0.10 35)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="oklch(0.60 0.10 35)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.13 75)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.13 75)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => formatETB(value)}
              />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.52 0.14 162)" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="expense" stroke="oklch(0.60 0.10 35)" strokeWidth={2} fill="url(#expGrad)" name="Expense" />
              <Area type="monotone" dataKey="profit" stroke="oklch(0.72 0.13 75)" strokeWidth={2} fill="url(#profGrad)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.dashboard.expenseBreakdown} subtitle="By category (ETB)">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={90}
                paddingAngle={2}
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => formatETB(value)}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px" }}
                formatter={(value) => <span className="text-foreground/80">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Products + Sales by Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title={t.dashboard.topProducts} subtitle="Best sellers this quarter">
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={product.name} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(product.sales)} units • {formatETB(product.revenue, { compact: true })}</p>
                </div>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-md",
                  product.change >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                )}>
                  {formatPercent(product.change)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title={t.dashboard.salesByRegion} subtitle="Distribution across Ethiopia">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByRegion} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <YAxis
                type="category"
                dataKey="region"
                tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => formatETB(value)}
              />
              <Bar dataKey="sales" radius={[0, 4, 4, 0]} fill="oklch(0.52 0.14 162)" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Transactions + Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title={t.dashboard.recentTransactions}
          subtitle="Latest financial activity"
          action={
            <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setActiveModule("finance")}>
              View all
            </Button>
          }
        >
          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  txn.type === "received" ? "bg-primary/10" : "bg-destructive/10"
                )}>
                  {txn.type === "received" ? (
                    <ArrowDownRight className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{txn.party}</p>
                  <p className="text-xs text-muted-foreground">{txn.id} • {txn.method}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn(
                    "text-sm font-semibold tabular-nums",
                    txn.type === "received" ? "text-primary" : "text-destructive"
                  )}>
                    {txn.type === "received" ? "+" : "-"}{formatETB(txn.amount, { compact: true })}
                  </p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title={t.dashboard.inventoryAlerts} subtitle="Items requiring attention">
          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {inventoryAlerts.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  item.severity === "critical" ? "bg-destructive/10" :
                  item.severity === "warning" ? "bg-accent/30" :
                  "bg-primary/10"
                )}>
                  <AlertTriangle className={cn(
                    "h-4 w-4",
                    item.severity === "critical" ? "text-destructive" :
                    item.severity === "warning" ? "text-accent-foreground" :
                    "text-primary"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.product}</p>
                  <p className="text-xs text-muted-foreground">{item.warehouse} • {item.current} / {item.threshold} units</p>
                </div>
                <StatusBadge status={item.severity as "critical" | "warning" | "ok"} />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Fiscal Health + Upcoming Taxes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border/60 shadow-sm lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.dashboard.fiscalHealth}</p>
                <p className="mt-2 text-3xl font-bold text-primary">{dashboardKPIs.fiscalHealthScore}</p>
                <p className="text-xs text-muted-foreground mt-1">out of 100</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={dashboardKPIs.fiscalHealthScore} className="h-2" />
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Excellent standing</span>
              <span className="text-primary font-medium">+4 vs last month</span>
            </div>
          </CardContent>
        </Card>

        <ChartCard
          title={t.dashboard.upcomingTaxes}
          subtitle="ERCA filing deadlines"
          className="lg:col-span-2"
          action={
            <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setActiveModule("compliance")}>
              View all
            </Button>
          }
        >
          <div className="space-y-2">
            {upcomingTaxDeadlines.slice(0, 4).map((tax, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tax.type}</p>
                  <p className="text-xs text-muted-foreground">Due: {tax.dueDate}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">{formatETB(tax.amount, { compact: true })}</p>
                  <StatusBadge status={tax.status as "pending" | "overdue"} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
