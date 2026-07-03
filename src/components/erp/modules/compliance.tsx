"use client";

import { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  ScrollText,
  Loader2,
} from "lucide-react";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
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
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/use-translation";
import {
  useAuditLogs,
  useTaxFilings,
  useFileTax,
} from "@/lib/api-hooks";
import { formatETB } from "@/lib/currency";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "oklch(1 0.005 85)",
  border: "1px solid oklch(0.90 0.015 85)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.20 0.02 160)",
};

const taxRulesData = [
  { name: "VAT (Value Added Tax)", rate: "15%", description: "Standard rate for taxable goods and services", threshold: "500,000 ETB annual turnover" },
  { name: "Turnover Tax", rate: "2%", description: "For businesses not registered for VAT", threshold: "100,000 ETB annual turnover" },
  { name: "Withholding Tax (Payment)", rate: "2%", description: "On payments to suppliers", threshold: "All taxable payments" },
  { name: "Withholding Tax (Import)", rate: "3%", description: "On import payments", threshold: "All imports" },
  { name: "Business Income Tax", rate: "30%", description: "Corporate income tax", threshold: "All registered companies" },
  { name: "Pension Contribution (Employer)", rate: "11%", description: "Social security contribution", threshold: "All employees" },
  { name: "Pension Contribution (Employee)", rate: "7%", description: "Social security contribution", threshold: "All employees" },
  { name: "Excise Tax", rate: "Variable", description: "On specific goods (alcohol, tobacco, fuel)", threshold: "Specific products" },
];

export function ComplianceModule() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [entityFilter, setEntityFilter] = useState("all");

  const { data: auditLogs, isLoading: logLoading } = useAuditLogs(entityFilter);
  const { data: taxFilings, isLoading: taxLoading } = useTaxFilings();
  const fileTax = useFileTax();

  const filedCount = taxFilings?.filter((d: { status: string }) => d.status === "filed").length || 0;
  const pendingCount = taxFilings?.filter((d: { status: string }) => d.status === "pending").length || 0;
  const overdueCount = taxFilings?.filter((d: { status: string }) => d.status === "overdue").length || 0;
  const complianceScore = taxFilings && taxFilings.length > 0
    ? Math.round((filedCount / taxFilings.length) * 100)
    : 87;

  const handleFileTax = (id: string) => {
    fileTax.mutate({ id });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title={t.compliance.complianceScore}
          value={`${complianceScore}/100`}
          icon={<ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
          subtitle="ERCA standing"
        />
        <KPICard
          title="Filed"
          value={filedCount.toString()}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
          subtitle="This period"
        />
        <KPICard
          title={t.compliance.deadlines}
          value={pendingCount.toString()}
          icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
          subtitle="Pending deadlines"
        />
        <KPICard
          title="Overdue"
          value={overdueCount.toString()}
          icon={<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="terracotta"
          subtitle="Requires action"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
          <TabsTrigger value="taxRules" className="text-xs sm:text-sm py-2">{t.compliance.taxRules}</TabsTrigger>
          <TabsTrigger value="deadlines" className="text-xs sm:text-sm py-2">{t.compliance.deadlines}</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs sm:text-sm py-2">{t.compliance.auditLog}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Compliance Score Gauge */}
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{t.compliance.complianceScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">ERCA Assessment</p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[{ value: complianceScore, fill: "oklch(0.52 0.14 162)" }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background={{ fill: "oklch(0.90 0.015 85)" }} dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="text-center -mt-32 mb-16">
                  <p className="text-4xl font-bold text-primary">{complianceScore}</p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">VAT Compliance</span>
                    <span className="font-semibold text-primary">{Math.min(100, complianceScore + 8)}%</span>
                  </div>
                  <Progress value={Math.min(100, complianceScore + 8)} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-muted-foreground">Tax Filing</span>
                    <span className="font-semibold text-primary">{complianceScore - 5}%</span>
                  </div>
                  <Progress value={complianceScore - 5} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-muted-foreground">Audit Readiness</span>
                    <span className="font-semibold text-primary">{complianceScore + 1}%</span>
                  </div>
                  <Progress value={complianceScore + 1} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            {/* ERCA Integration Status */}
            <Card className="border-border/60 shadow-sm lg:col-span-2">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">ERCA Integration Status</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ethiopian Revenue & Customs Authority</p>
                  </div>
                  <StatusBadge status="connected" label={t.compliance.ercaIntegration} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "VAT e-Filing", status: "Active", lastSync: "2 hours ago" },
                    { name: "Withholding Tax", status: "Active", lastSync: "5 hours ago" },
                    { name: "Business Income Tax", status: "Active", lastSync: "1 day ago" },
                    { name: "Pension Contribution", status: "Active", lastSync: "30 min ago" },
                    { name: "Turnover Tax", status: "Active", lastSync: "1 hour ago" },
                    { name: "Excise Tax", status: "Pending", lastSync: "Never" },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        integration.status === "Active" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"
                      )}>
                        {integration.status === "Active" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.lastSync}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports */}
          <ChartCard title={t.compliance.reports} subtitle="Generate ERCA-compliant reports">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "Monthly VAT Return", desc: "Form VAT-001", period: "June 2026" },
                { name: "Quarterly Tax Summary", desc: "All tax types", period: "Q2 2026" },
                { name: "Annual Business Tax", desc: "Form BIT-002", period: "FY 2025-26" },
                { name: "Withholding Tax Report", desc: "Form WHT-003", period: "June 2026" },
                { name: "Pension Contribution", desc: "Social Security", period: "June 2026" },
                { name: "Audit Trail Export", desc: "Complete log", period: "Custom range" },
              ].map((report) => (
                <div key={report.name} className="p-4 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                      <Download className="h-3 w-3 mr-1" />PDF
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{report.desc}</p>
                  <p className="text-xs text-muted-foreground mt-2">{report.period}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </TabsContent>

        {/* Tax Rules Tab */}
        <TabsContent value="taxRules">
          <ChartCard title={t.compliance.taxRules} subtitle="Ethiopian tax regulations applied">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {taxRulesData.map((rule) => (
                <Card key={rule.name} className="border-border/60 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ScrollText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{rule.name}</p>
                          <p className="text-xs text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-primary shrink-0">{rule.rate}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <p className="text-xs text-muted-foreground">Threshold</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{rule.threshold}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ChartCard>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines">
          <ChartCard title={t.compliance.deadlines} subtitle="Upcoming tax filing deadlines">
            {taxLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t.compliance.taxRules}</TableHead>
                      <TableHead className="text-xs">{t.compliance.nextDeadline}</TableHead>
                      <TableHead className="text-xs text-right">Amount Due</TableHead>
                      <TableHead className="text-xs">{t.compliance.status}</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxFilings?.map((filing: { id: string; type: string; period: string; dueDate: string; amount: number; status: string }) => (
                      <TableRow key={filing.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                              filing.status === "overdue" ? "bg-destructive/10" :
                              filing.status === "pending" ? "bg-accent/20" : "bg-primary/10"
                            )}>
                              <Calendar className={cn(
                                "h-4 w-4",
                                filing.status === "overdue" ? "text-destructive" :
                                filing.status === "pending" ? "text-accent-foreground" : "text-primary"
                              )} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{filing.type}</p>
                              <p className="text-xs text-muted-foreground">{filing.period}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(filing.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm font-semibold text-right tabular-nums">{formatETB(filing.amount)}</TableCell>
                        <TableCell><StatusBadge status={filing.status as "filed" | "pending" | "overdue"} /></TableCell>
                        <TableCell className="text-right">
                          {filing.status !== "filed" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => handleFileTax(filing.id)}
                              disabled={fileTax.isPending}
                            >
                              File Now
                            </Button>
                          ) : (
                            <span className="text-xs text-primary flex items-center gap-1 justify-end">
                              <CheckCircle2 className="h-3 w-3" />Filed
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ChartCard>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <ChartCard
            title={t.compliance.auditTrail}
            subtitle="Complete activity log for compliance"
            action={
              <div className="flex gap-2">
                {["all", "Finance", "Inventory", "HR", "Sales", "Compliance", "Admin"].map((entity) => (
                  <Button
                    key={entity}
                    size="sm"
                    variant={entityFilter === entity ? "default" : "outline"}
                    className={cn("text-xs h-7", entityFilter === entity && "gradient-emerald text-white")}
                    onClick={() => setEntityFilter(entity)}
                  >
                    {entity === "all" ? "All" : entity}
                  </Button>
                ))}
              </div>
            }
          >
            {logLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t.compliance.user}</TableHead>
                      <TableHead className="text-xs">{t.compliance.action}</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">{t.compliance.entity}</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">{t.compliance.timestamp}</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                          No audit logs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs?.map((log: { id: string; userName: string; action: string; entity: string; details: string | null; timestamp: string; ipAddress: string | null }) => (
                        <TableRow key={log.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full gradient-emerald flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {log.userName.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <span className="text-sm font-medium">{log.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.action}
                            {log.details && <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>}
                          </TableCell>
                          <TableCell className="text-xs hidden sm:table-cell">
                            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                              {log.entity}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs hidden md:table-cell font-mono text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="text-xs hidden lg:table-cell font-mono text-muted-foreground">{log.ipAddress}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
