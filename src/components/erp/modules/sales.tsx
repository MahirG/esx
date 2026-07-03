"use client";

import { useState } from "react";
import {
  Users,
  ShoppingCart,
  FileText,
  TrendingUp,
  Plus,
  Star,
  Award,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/lib/use-translation";
import {
  useCustomers,
  useQuotations,
  usePipeline,
} from "@/lib/api-hooks";
import { CustomerForm, QuotationForm, DealForm } from "@/components/erp/forms/entity-forms";
import { formatETB } from "@/lib/currency";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "oklch(1 0.005 85)",
  border: "1px solid oklch(0.90 0.015 85)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.20 0.02 160)",
};

const stageColors: Record<string, string> = {
  lead: "oklch(0.72 0.13 75)",
  qualified: "oklch(0.52 0.14 162)",
  proposal: "oklch(0.40 0.10 162)",
  negotiation: "oklch(0.60 0.10 35)",
  won: "oklch(0.52 0.14 162)",
  lost: "oklch(0.55 0.05 0)",
};

export function SalesModule() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("customers");
  const [custModal, setCustModal] = useState(false);
  const [quoteModal, setQuoteModal] = useState(false);
  const [dealModal, setDealModal] = useState(false);

  const { data: customers, isLoading: custLoading } = useCustomers();
  const { data: quotations, isLoading: quoteLoading } = useQuotations();
  const { data: pipeline, isLoading: pipeLoading } = usePipeline();

  const totalCustomers = customers?.length || 0;
  const totalLifetime = customers?.reduce((s: number, c: { lifetimeValue: number }) => s + c.lifetimeValue, 0) || 0;

  const pendingQuotes = quotations?.filter((q: { status: string }) => q.status === "pending" || q.status === "sent").length || 0;
  const wonDeals = pipeline?.find((s: { stage: string }) => s.stage === "won");
  const totalDeals = pipeline?.reduce((s: number, p: { count: number }) => s + p.count, 0) || 0;
  const conversionRate = totalDeals > 0 ? ((wonDeals?.count || 0) / totalDeals * 100).toFixed(1) : "0";
  const totalSales = quotations?.filter((q: { status: string }) => q.status === "accepted").reduce((s: number, q: { total: number }) => s + q.total, 0) || 0;

  const monthlySales = [
    { month: "Jan", sales: 1720000, target: 1800000 },
    { month: "Feb", sales: 1840000, target: 1850000 },
    { month: "Mar", sales: 1680000, target: 1900000 },
    { month: "Apr", sales: 1920000, target: 1950000 },
    { month: "May", sales: 2050000, target: 2000000 },
    { month: "Jun", sales: 2180000, target: 2100000 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Modals */}
      <CustomerForm open={custModal} onClose={() => setCustModal(false)} />
      <QuotationForm open={quoteModal} onClose={() => setQuoteModal(false)} />
      <DealForm open={dealModal} onClose={() => setDealModal(false)} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title={t.sales.totalCustomers}
          value={totalCustomers.toString()}
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
          change={8.2}
        />
        <KPICard
          title={t.sales.monthlySales}
          value={formatETB(totalSales || 2180000, { compact: true })}
          icon={<ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
          change={12.4}
        />
        <KPICard
          title={t.sales.pendingQuotes}
          value={pendingQuotes.toString()}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
          subtitle="Awaiting response"
        />
        <KPICard
          title={t.sales.conversionRate}
          value={`${conversionRate}%`}
          icon={<Target className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="terracotta"
          change={3.1}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="customers" className="text-xs sm:text-sm py-2">{t.sales.customers}</TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs sm:text-sm py-2">{t.sales.pipeline}</TabsTrigger>
            <TabsTrigger value="quotations" className="text-xs sm:text-sm py-2">{t.sales.quotations}</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuoteModal(true)}>
              <FileText className="h-4 w-4 mr-1.5" />
              {t.sales.newQuote}
            </Button>
            <Button size="sm" className="gradient-emerald text-white" onClick={() => setCustModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              {t.sales.newCustomer}
            </Button>
          </div>
        </div>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <ChartCard title={t.sales.customers} subtitle={`${totalCustomers} active • ${formatETB(totalLifetime, { compact: true })} lifetime value`}>
            {custLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t.sales.customerName}</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">{t.sales.contact}</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">{t.sales.email}</TableHead>
                      <TableHead className="text-xs text-right">{t.sales.totalOrders}</TableHead>
                      <TableHead className="text-xs text-right">{t.sales.lifetimeValue}</TableHead>
                      <TableHead className="text-xs">{t.sales.status}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers?.map((customer: { id: string; name: string; contact: string; email: string; totalOrders: number; lifetimeValue: number; status: string }) => (
                      <TableRow key={customer.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                              customer.status === "vip" ? "gradient-emerald" : "bg-muted text-muted-foreground"
                            )}>
                              {customer.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{customer.name}</p>
                              <p className="text-xs text-muted-foreground truncate sm:hidden">{customer.contact}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden sm:table-cell font-mono text-muted-foreground">{customer.contact}</TableCell>
                        <TableCell className="text-xs hidden lg:table-cell text-muted-foreground truncate max-w-[180px]">{customer.email}</TableCell>
                        <TableCell className="text-sm font-semibold text-right tabular-nums">{customer.totalOrders}</TableCell>
                        <TableCell className="text-sm font-semibold text-right tabular-nums text-primary">{formatETB(customer.lifetimeValue, { compact: true })}</TableCell>
                        <TableCell><StatusBadge status={customer.status as "vip" | "active" | "regular"} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ChartCard>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          {pipeLoading ? (
            <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <>
              <div className="flex justify-end">
                <Button size="sm" className="gradient-emerald text-white" onClick={() => setDealModal(true)}>
                  <Plus className="h-4 w-4 mr-1.5" />Add Deal
                </Button>
              </div>
              {/* Pipeline Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {pipeline?.map((stage: { stage: string; count: number; value: number }) => (
                  <Card key={stage.stage} className="border-border/60 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stageColors[stage.stage]}20` }}>
                          <span style={{ color: stageColors[stage.stage] }}>
                            {stage.stage === "won" ? <CheckCircle2 className="h-4 w-4" /> :
                             stage.stage === "lost" ? <XCircle className="h-4 w-4" /> :
                             <Clock className="h-4 w-4" />}
                          </span>
                        </div>
                        <span className="text-lg font-bold">{stage.count}</span>
                      </div>
                      <p className="text-xs font-medium capitalize text-foreground">{t.sales.stages[stage.stage as keyof typeof t.sales.stages]}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatETB(stage.value, { compact: true })}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pipeline Visualization */}
              <ChartCard title="Sales Pipeline" subtitle="Deal value by stage (ETB)">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" vertical={false} />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} tickFormatter={(v) => t.sales.stages[v as keyof typeof t.sales.stages]} />
                    <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatETB(value)} labelFormatter={(label) => t.sales.stages[label as keyof typeof t.sales.stages]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48}>
                      {pipeline?.map((entry: { stage: string }, index: number) => (
                        <Cell key={`cell-${index}`} fill={stageColors[entry.stage]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}
        </TabsContent>

        {/* Quotations Tab */}
        <TabsContent value="quotations">
          <div className="flex justify-end mb-4">
            <Button size="sm" className="gradient-emerald text-white" onClick={() => setQuoteModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" />{t.sales.newQuote}
            </Button>
          </div>
          <ChartCard title={t.sales.quotations} subtitle={`${quotations?.length || 0} quotations this period`}>
            {quoteLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Quote #</TableHead>
                      <TableHead className="text-xs">Customer</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                      <TableHead className="text-xs text-right hidden sm:table-cell">VAT</TableHead>
                      <TableHead className="text-xs text-right">Total</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Valid Until</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotations?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                          No quotations yet. Create your first quote!
                        </TableCell>
                      </TableRow>
                    ) : (
                      quotations?.map((quote: { id: string; quoteNo: string; customer: { name: string }; date: string; amount: number; vatAmount: number; total: number; validUntil: string; status: string }) => (
                        <TableRow key={quote.id} className="hover:bg-muted/30">
                          <TableCell className="text-xs font-mono">{quote.quoteNo}</TableCell>
                          <TableCell className="text-sm font-medium">{quote.customer.name}</TableCell>
                          <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">{new Date(quote.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm text-right tabular-nums">{formatETB(quote.amount)}</TableCell>
                          <TableCell className="text-sm text-right tabular-nums hidden sm:table-cell text-muted-foreground">{formatETB(quote.vatAmount)}</TableCell>
                          <TableCell className="text-sm font-semibold text-right tabular-nums text-primary">{formatETB(quote.total)}</TableCell>
                          <TableCell className="text-xs hidden md:table-cell text-muted-foreground">{new Date(quote.validUntil).toLocaleDateString()}</TableCell>
                          <TableCell><StatusBadge status={quote.status as "sent" | "accepted" | "expired" | "pending"} /></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </ChartCard>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Sales vs Target" subtitle="Monthly performance (ETB)">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatETB(value)} />
                  <Line type="monotone" dataKey="sales" stroke="oklch(0.52 0.14 162)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.52 0.14 162)" }} name="Actual Sales" />
                  <Line type="monotone" dataKey="target" stroke="oklch(0.72 0.13 75)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Customers" subtitle="By lifetime value">
              <div className="space-y-3">
                {[...(customers || [])].sort((a: { lifetimeValue: number }, b: { lifetimeValue: number }) => b.lifetimeValue - a.lifetimeValue).slice(0, 5).map((customer: { id: string; name: string; totalOrders: number; lifetimeValue: number; status: string }, idx: number) => (
                  <div key={customer.id} className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                      idx === 0 ? "bg-[oklch(0.72_0.13_75)]/20 text-[oklch(0.55_0.10_75)]" : "bg-muted text-muted-foreground"
                    )}>
                      {idx === 0 ? <Award className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.totalOrders} orders</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground tabular-nums">{formatETB(customer.lifetimeValue, { compact: true })}</p>
                      {customer.status === "vip" && (
                        <span className="text-xs text-[oklch(0.55_0.10_75)] flex items-center gap-0.5 justify-end">
                          <Star className="h-3 w-3 fill-current" />VIP
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
