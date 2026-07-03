"use client";

import {
  TrendingUp,
  Wallet,
  Receipt,
  Users,
  Plus,
  ShoppingBag,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { useDashboard } from "@/lib/api-hooks";
import { formatETB, formatNumber, formatPercent } from "@/lib/currency";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "oklch(1 0.005 85)",
  border: "1px solid oklch(0.90 0.015 85)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.20 0.02 160)",
};

const expenseBreakdown = [
  { name: "Payroll & Salaries", value: 6800000, color: "oklch(0.52 0.14 162)" },
  { name: "Inventory & Supplies", value: 4200000, color: "oklch(0.72 0.13 75)" },
  { name: "Operations & Logistics", value: 2100000, color: "oklch(0.60 0.10 35)" },
  { name: "Marketing & Sales", value: 980000, color: "oklch(0.40 0.10 162)" },
  { name: "Technology & IT", value: 740000, color: "oklch(0.78 0.15 85)" },
  { name: "Compliance & Legal", value: 420000, color: "oklch(0.55 0.08 200)" },
];

export function DashboardModule() {
  const { t } = useTranslation();
  const setActiveModule = useERPStore((s) => s.setActiveModule);
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { kpis, charts, inventory, tax, recentTransactions } = data;

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
          value={formatETB(kpis.totalRevenue, { compact: true })}
          change={kpis.revenueGrowth}
          icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
        />
        <KPICard
          title={t.dashboard.netProfit}
          value={formatETB(kpis.netProfit, { compact: true })}
          change={kpis.profitGrowth}
          icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
        />
        <KPICard
          title={t.dashboard.vatCollected}
          value={formatETB(kpis.vatCollected || kpis.totalRevenue * 0.15, { compact: true })}
          change={kpis.vatGrowth}
          icon={<Receipt className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
        />
        <KPICard
          title={t.dashboard.activeEmployees}
          value={formatNumber(kpis.activeEmployees)}
          change={kpis.employeeGrowth}
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
            <AreaChart data={charts.revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2 text-xs">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Sales by Region + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title={t.dashboard.salesByRegion} subtitle="Distribution across Ethiopia">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.salesByRegion} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
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
            {recentTransactions.map((txn: { id: string; txnId: string; type: string; party: string; amount: number; date: string; method: string }) => (
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
                  <p className="text-xs text-muted-foreground">{txn.txnId} • {txn.method}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn(
                    "text-sm font-semibold tabular-nums",
                    txn.type === "received" ? "text-primary" : "text-destructive"
                  )}>
                    {txn.type === "received" ? "+" : "-"}{formatETB(txn.amount, { compact: true })}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(txn.date).toLocaleDateString()}</p>
                </div>
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
                <p className="mt-2 text-3xl font-bold text-primary">{kpis.fiscalHealthScore}</p>
                <p className="text-xs text-muted-foreground mt-1">out of 100</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={kpis.fiscalHealthScore} className="h-2" />
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Compliance standing</span>
              <span className="text-primary font-medium">{kpis.fiscalHealthScore >= 80 ? "Excellent" : kpis.fiscalHealthScore >= 60 ? "Good" : "Needs attention"}</span>
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
            {tax.upcoming.slice(0, 4).map((tf: { id: string; type: string; dueDate: string; amount: number; status: string }) => (
              <div key={tf.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tf.type}</p>
                  <p className="text-xs text-muted-foreground">Due: {new Date(tf.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">{formatETB(tf.amount, { compact: true })}</p>
                  <StatusBadge status={tf.status as "pending" | "overdue" | "filed"} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Inventory Alerts */}
      {inventory.lowStockProducts.length > 0 && (
        <ChartCard title={t.dashboard.inventoryAlerts} subtitle="Items requiring attention">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inventory.lowStockProducts.map((item: { id: string; name: string; sku: string; quantity: number; reorderLevel: number; status: string; warehouse: { name: string } }) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30">
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  item.status === "outOfStock" ? "bg-destructive/10" : "bg-accent/30"
                )}>
                  <AlertTriangle className={cn(
                    "h-4 w-4",
                    item.status === "outOfStock" ? "text-destructive" : "text-accent-foreground"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.warehouse?.name} • {item.quantity} / {item.reorderLevel} units</p>
                </div>
                <StatusBadge status={item.status as "lowStock" | "outOfStock"} />
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}
