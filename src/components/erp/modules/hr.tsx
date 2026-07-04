"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  Wallet,
  Plus,
  FileText,
  TrendingUp,
  Download,
  Briefcase,
  Loader2,
  Play,
} from "lucide-react";
import {
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
  useEmployees,
  usePayroll,
  useLeaveRequests,
  useRunPayroll,
  useUpdateLeave,
} from "@/lib/api-hooks";
import { EmployeeForm } from "@/components/erp/forms/entity-forms";
import { exportPayslipHTML, exportEmployeesHTML, exportEmployeesCSV } from "@/lib/html-export";
import { calculatePayroll } from "@/lib/tax-engine";
import { formatETB } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileDown, Eye, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/erp/ui/confirm-dialog";
import { useDeleteEmployee } from "@/lib/api-hooks";

const tooltipStyle = {
  backgroundColor: "oklch(1 0.005 85)",
  border: "1px solid oklch(0.90 0.015 85)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.20 0.02 160)",
};

export function HRModule() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("employees");
  const [empModal, setEmpModal] = useState(false);
  const [deleteEmpId, setDeleteEmpId] = useState<string | null>(null);
  const deleteEmployee = useDeleteEmployee();
  const [payrollPeriod, setPayrollPeriod] = useState("July 2026");

  const { data: employees, isLoading: empLoading } = useEmployees();
  const { data: payrolls, isLoading: payLoading } = usePayroll("June 2026");
  const { data: leaveReqs, isLoading: leaveLoading } = useLeaveRequests();
  const runPayroll = useRunPayroll();
  const updateLeave = useUpdateLeave();

  const totalEmployees = employees?.length || 0;
  const presentToday = Math.floor(totalEmployees * 0.9);
  const onLeave = employees?.filter((e: { status: string }) => e.status === "leave").length || 0;
  const monthlyPayroll = payrolls?.reduce((s: number, p: { netPay: number }) => s + p.netPay, 0) || 0;

  const attendanceData = [
    { name: "Present", value: presentToday, color: "oklch(0.52 0.14 162)" },
    { name: "On Leave", value: onLeave, color: "oklch(0.72 0.13 75)" },
    { name: "Remote", value: 12, color: "oklch(0.40 0.10 162)" },
    { name: "Absent", value: Math.max(0, totalEmployees - presentToday - onLeave - 12), color: "oklch(0.60 0.10 35)" },
  ];

  const handleRunPayroll = () => {
    runPayroll.mutate({ period: payrollPeriod }, {
      onSuccess: () => {
        toast.success(`Payroll processed for ${payrollPeriod}`);
      },
    });
  };

  const handleLeaveAction = (id: string, status: "approved" | "rejected") => {
    updateLeave.mutate({ id, status });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <EmployeeForm open={empModal} onClose={() => setEmpModal(false)} />
      <ConfirmDialog
        open={!!deleteEmpId}
        onClose={() => setDeleteEmpId(null)}
        onConfirm={() => {
          if (deleteEmpId) {
            deleteEmployee.mutate(deleteEmpId, { onSuccess: () => setDeleteEmpId(null) });
          }
        }}
        title="Delete Employee?"
        description="This will permanently delete the employee and all related records (attendance, payroll, leave requests). This action cannot be undone."
        isPending={deleteEmployee.isPending}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title={t.hr.totalEmployees}
          value={totalEmployees.toString()}
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
          change={5.0}
        />
        <KPICard
          title={t.hr.presentToday}
          value={presentToday.toString()}
          icon={<UserCheck className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
          subtitle={`${totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(0) : 0}% attendance`}
        />
        <KPICard
          title={t.hr.onLeave}
          value={onLeave.toString()}
          icon={<CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
          subtitle="12 remote"
        />
        <KPICard
          title={t.hr.monthlyPayroll}
          value={formatETB(monthlyPayroll, { compact: true })}
          icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="terracotta"
          subtitle="June 2026"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-5 h-auto">
            <TabsTrigger value="employees" className="text-xs sm:text-sm py-2">{t.hr.employees}</TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs sm:text-sm py-2">{t.hr.attendance}</TabsTrigger>
            <TabsTrigger value="payroll" className="text-xs sm:text-sm py-2">{t.hr.payroll}</TabsTrigger>
            <TabsTrigger value="benefits" className="text-xs sm:text-sm py-2">{t.hr.benefits}</TabsTrigger>
            <TabsTrigger value="leave" className="text-xs sm:text-sm py-2">{t.hr.leaveRequests}</TabsTrigger>
          </TabsList>
          <Button size="sm" className="gradient-emerald text-white" onClick={() => setEmpModal(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            {t.hr.addEmployee}
          </Button>
        </div>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <ChartCard title={t.hr.employees} subtitle={`${totalEmployees} team members`}>
            {empLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t.hr.employeeName}</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">{t.hr.position}</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">{t.hr.department}</TableHead>
                      <TableHead className="text-xs text-right hidden sm:table-cell">{t.hr.salary}</TableHead>
                      <TableHead className="text-xs text-right">{t.hr.netPay}</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">{t.hr.joinDate}</TableHead>
                      <TableHead className="text-xs">{t.hr.status}</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees?.map((emp: { id: string; name: string; position: string; department: string; salary: number; joinDate: string; status: string }) => {
                      const calc = calculatePayroll(emp.salary);
                      return (
                        <TableRow key={emp.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full gradient-emerald flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {emp.name.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{emp.name}</p>
                                <p className="text-xs text-muted-foreground truncate sm:hidden">{emp.position}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">{emp.position}</TableCell>
                          <TableCell className="text-xs hidden md:table-cell">
                            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
                              {t.hr.departments[emp.department as keyof typeof t.hr.departments]}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-right tabular-nums hidden sm:table-cell">{formatETB(emp.salary)}</TableCell>
                          <TableCell className="text-sm font-semibold text-right tabular-nums text-primary">
                            {formatETB(calc.netPay)}
                          </TableCell>
                          <TableCell className="text-xs hidden lg:table-cell text-muted-foreground">{new Date(emp.joinDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <StatusBadge status={emp.status as "active" | "leave"} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs text-destructive h-7"
                              onClick={() => setDeleteEmpId(emp.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </ChartCard>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Today's Attendance" subtitle="June 2026">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {attendanceData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground flex-1">{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Weekly Attendance Trend" subtitle="Last 7 days" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { day: "Mon", present: 132, absent: 10 },
                    { day: "Tue", present: 138, absent: 4 },
                    { day: "Wed", present: 134, absent: 8 },
                    { day: "Thu", present: 128, absent: 14 },
                    { day: "Fri", present: 130, absent: 12 },
                    { day: "Sat", present: 98, absent: 44 },
                    { day: "Sun", present: 0, absent: 142 },
                  ]}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="present" stackId="a" fill="oklch(0.52 0.14 162)" radius={[0, 0, 0, 0]} barSize={28} />
                  <Bar dataKey="absent" stackId="a" fill="oklch(0.60 0.10 35)" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{t.hr.monthlyPayroll}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{payrollPeriod}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </div>
                {payLoading ? (
                  <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.hr.grossSalary}</span>
                        <span className="font-semibold tabular-nums">{formatETB(payrolls?.reduce((s: number, p: { grossSalary: number }) => s + p.grossSalary, 0) || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.hr.pension}</span>
                        <span className="font-semibold tabular-nums text-destructive">-{formatETB(payrolls?.reduce((s: number, p: { pension: number }) => s + p.pension, 0) || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.hr.incomeTax}</span>
                        <span className="font-semibold tabular-nums text-destructive">-{formatETB(payrolls?.reduce((s: number, p: { incomeTax: number }) => s + p.incomeTax, 0) || 0)}</span>
                      </div>
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-sm font-medium">{t.hr.netPay}</span>
                        <span className="text-xl font-bold text-primary tabular-nums">{formatETB(monthlyPayroll)}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full gradient-emerald text-white mt-4"
                      onClick={handleRunPayroll}
                      disabled={runPayroll.isPending}
                    >
                      {runPayroll.isPending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
                      ) : (
                        <><Play className="h-4 w-4 mr-2" />Run Payroll — {payrollPeriod}</>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <ChartCard title="Payroll Breakdown" subtitle="By department (ETB)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={Object.entries(
                    employees?.reduce((acc: Record<string, number>, emp: { department: string; salary: number }) => {
                      acc[emp.department] = (acc[emp.department] || 0) + emp.salary;
                      return acc;
                    }, {}) || {}
                  ).map(([dept, amount]) => ({ dept: dept.charAt(0).toUpperCase() + dept.slice(1), amount }))}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatETB(value)} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="oklch(0.52 0.14 162)" barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard
            title="Payslips"
            subtitle="Generate and download employee payslips"
            action={
              <div className="flex gap-2">
                {employees && employees.length > 0 && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => exportEmployeesHTML(employees as any)}>
                      <Eye className="h-3 w-3 mr-1" />HTML
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportEmployeesCSV(employees as any)}>
                      <FileDown className="h-3 w-3 mr-1" />CSV
                    </Button>
                  </>
                )}
              </div>
            }
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Employee</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Gross (ETB)</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Deductions</TableHead>
                    <TableHead className="text-xs text-right">Net Pay</TableHead>
                    <TableHead className="text-xs text-right">Payslip</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls?.map((p: any) => {
                    const deductions = p.pension + p.incomeTax;
                    return (
                      <TableRow key={p.id} className="hover:bg-muted/30">
                        <TableCell className="text-sm font-medium">{p.employee?.name}</TableCell>
                        <TableCell className="text-sm tabular-nums hidden sm:table-cell">{formatETB(p.grossSalary)}</TableCell>
                        <TableCell className="text-sm tabular-nums hidden sm:table-cell text-destructive">-{formatETB(deductions)}</TableCell>
                        <TableCell className="text-sm font-semibold tabular-nums text-right text-primary">{formatETB(p.netPay)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-primary"
                            onClick={() => exportPayslipHTML(p.employee, { grossSalary: p.grossSalary, pension: p.pension, incomeTax: p.incomeTax, netPay: p.netPay, period: p.period })}
                          >
                            <Eye className="h-3 w-3 mr-1" />View HTML
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Pension Fund", coverage: "100%", employer: "11%", employee: "7%", icon: <Wallet className="h-5 w-5" />, color: "emerald" },
              { name: "Health Insurance", coverage: "92%", employer: "Full", employee: "Optional", icon: <Briefcase className="h-5 w-5" />, color: "deep" },
              { name: "Transport Allowance", coverage: "100%", employer: "ETB 2,000/mo", employee: "—", icon: <TrendingUp className="h-5 w-5" />, color: "amber" },
              { name: "Meal Allowance", coverage: "88%", employer: "ETB 1,500/mo", employee: "—", icon: <TrendingUp className="h-5 w-5" />, color: "terracotta" },
              { name: "Annual Bonus", coverage: "100%", employer: "1 month", employee: "—", icon: <FileText className="h-5 w-5" />, color: "emerald" },
              { name: "Emergency Leave", coverage: "100%", employer: "5 days/yr", employee: "—", icon: <CalendarDays className="h-5 w-5" />, color: "deep" },
            ].map((benefit) => (
              <Card key={benefit.name} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center",
                      benefit.color === "emerald" && "bg-primary/10 text-primary",
                      benefit.color === "deep" && "bg-[oklch(0.40_0.10_162)]/10 text-[oklch(0.40_0.10_162)]",
                      benefit.color === "amber" && "bg-accent/20 text-accent-foreground",
                      benefit.color === "terracotta" && "bg-[oklch(0.60_0.10_35)]/10 text-[oklch(0.60_0.10_35)]"
                    )}>
                      {benefit.icon}
                    </div>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                      {benefit.coverage}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{benefit.name}</p>
                  <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employer</span>
                      <span className="font-medium">{benefit.employer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employee</span>
                      <span className="font-medium">{benefit.employee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leave Requests Tab */}
        <TabsContent value="leave">
          <ChartCard title={t.hr.leaveRequests} subtitle="Pending approvals">
            {leaveLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Employee</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-xs">Duration</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Reason</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveReqs?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                          No leave requests.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaveReqs?.map((req: { id: string; employee: { name: string }; type: string; startDate: string; endDate: string; reason: string; status: string }) => (
                        <TableRow key={req.id} className="hover:bg-muted/30">
                          <TableCell className="text-sm font-medium">{req.employee.name}</TableCell>
                          <TableCell className="text-xs hidden sm:table-cell">
                            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                              {req.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">
                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-xs hidden md:table-cell text-muted-foreground">{req.reason}</TableCell>
                          <TableCell><StatusBadge status={req.status as "pending" | "approved" | "rejected"} /></TableCell>
                          <TableCell className="text-right">
                            {req.status === "pending" ? (
                              <div className="flex gap-1 justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-primary h-7"
                                  onClick={() => handleLeaveAction(req.id, "approved")}
                                  disabled={updateLeave.isPending}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-destructive h-7"
                                  onClick={() => handleLeaveAction(req.id, "rejected")}
                                  disabled={updateLeave.isPending}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
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
