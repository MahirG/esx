"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  Smartphone,
  Receipt,
  FileText,
  Download,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  useTransactions,
  useAccounts,
  useBankAccounts,
  useCreateTransaction,
} from "@/lib/api-hooks";
import { TransactionForm, AccountForm, BankForm } from "@/components/erp/forms/entity-forms";
import { exportTransactionsHTML, exportTransactionsCSV, exportFinancialStatementsHTML } from "@/lib/html-export";
import { formatETB } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "oklch(1 0.005 85)",
  border: "1px solid oklch(0.90 0.015 85)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.20 0.02 160)",
};

const bankIcons: Record<string, React.ReactNode> = {
  "Dashen Bank": <Landmark className="h-5 w-5" />,
  "Commercial Bank of Ethiopia": <Landmark className="h-5 w-5" />,
  "Awash Bank": <Landmark className="h-5 w-5" />,
  "Telebirr": <Smartphone className="h-5 w-5" />,
  "Amole": <Smartphone className="h-5 w-5" />,
};

export function FinanceModule() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [txnModal, setTxnModal] = useState(false);
  const [acctModal, setAcctModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);

  const { data: transactions, isLoading: txnLoading } = useTransactions();
  const { data: accounts, isLoading: acctLoading } = useAccounts();
  const { data: banks, isLoading: bankLoading } = useBankAccounts();

  const totalBalance = banks?.reduce((sum: number, acc: { balance: number }) => sum + acc.balance, 0) || 0;
  const monthlyIncome = transactions?.filter((t: { type: string }) => t.type === "received").reduce((s: number, t: { amount: number }) => s + t.amount, 0) || 0;
  const monthlyExpense = transactions?.filter((t: { type: string }) => t.type === "sent").reduce((s: number, t: { amount: number }) => s + t.amount, 0) || 0;
  const netCash = monthlyIncome - monthlyExpense;

  // Generate cash flow from transactions
  const cashFlow = (() => {
    const now = new Date();
    const months: Array<{ month: string; inflow: number; outflow: number }> = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTxns = transactions?.filter((t: { date: string }) => {
        const td = new Date(t.date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      }) || [];
      months.push({
        month: monthNames[d.getMonth()],
        inflow: monthTxns.filter((t: { type: string }) => t.type === "received").reduce((s: number, t: { amount: number }) => s + t.amount, 0),
        outflow: monthTxns.filter((t: { type: string }) => t.type === "sent").reduce((s: number, t: { amount: number }) => s + t.amount, 0),
      });
    }
    return months;
  })();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Modals */}
      <TransactionForm open={txnModal} onClose={() => setTxnModal(false)} />
      <AccountForm open={acctModal} onClose={() => setAcctModal(false)} />
      <BankForm open={bankModal} onClose={() => setBankModal(false)} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title={t.finance.balance}
          value={formatETB(totalBalance, { compact: true })}
          icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
          change={8.4}
        />
        <KPICard
          title={t.finance.income}
          value={formatETB(monthlyIncome, { compact: true })}
          icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
          change={12.6}
        />
        <KPICard
          title={t.finance.expensesLabel}
          value={formatETB(monthlyExpense, { compact: true })}
          icon={<TrendingDown className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="terracotta"
          change={-4.2}
        />
        <KPICard
          title={t.finance.netCash}
          value={formatETB(netCash, { compact: true })}
          icon={<Receipt className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
          change={18.3}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
          <TabsTrigger value="accounts" className="text-xs sm:text-sm py-2">{t.finance.accounts}</TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs sm:text-sm py-2">{t.finance.transactions}</TabsTrigger>
          <TabsTrigger value="banks" className="text-xs sm:text-sm py-2">{t.finance.bankAccounts}</TabsTrigger>
          <TabsTrigger value="tax" className="text-xs sm:text-sm py-2">{t.finance.taxCompliance}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title={t.finance.cashFlow} subtitle="Monthly inflow vs outflow (ETB)" className="lg:col-span-2">
              {txnLoading ? (
                <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cashFlow} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.52 0.14 162)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.52 0.14 162)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.60 0.10 35)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="oklch(0.60 0.10 35)" stopOpacity={0} />
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
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatETB(value)} />
                    <Area type="monotone" dataKey="inflow" stroke="oklch(0.52 0.14 162)" strokeWidth={2} fill="url(#inflowGrad)" name="Inflow" />
                    <Area type="monotone" dataKey="outflow" stroke="oklch(0.60 0.10 35)" strokeWidth={2} fill="url(#outflowGrad)" name="Outflow" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Bank Balances" subtitle="Distribution by institution">
              {bankLoading ? (
                <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={banks} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <YAxis type="category" dataKey="bankName" tick={{ fontSize: 10, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatETB(value)} />
                    {banks?.map((entry: { color: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Bar dataKey="balance" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Recent Transactions */}
          <ChartCard
            title={t.finance.transactions}
            subtitle="Latest activity across all accounts"
            action={
              <div className="flex gap-2">
                {transactions && transactions.length > 0 && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => exportTransactionsHTML(transactions as any)}>
                      <FileText className="h-4 w-4 mr-1" />HTML
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportTransactionsCSV(transactions as any)}>
                      <FileDown className="h-4 w-4 mr-1" />CSV
                    </Button>
                  </>
                )}
                <Button size="sm" className="gradient-emerald text-white" onClick={() => setTxnModal(true)}><Plus className="h-4 w-4 mr-1" />{t.finance.newTransaction}</Button>
              </div>
            }
          >
            <TransactionTable transactions={transactions?.slice(0, 8) || []} loading={txnLoading} />
          </ChartCard>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <ChartCard
            title={t.finance.accounts}
            subtitle="Standard Ethiopian chart of accounts"
            action={<Button size="sm" className="gradient-emerald text-white" onClick={() => setAcctModal(true)}><Plus className="h-4 w-4 mr-1" />New Account</Button>}
          >
            {acctLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Code</TableHead>
                      <TableHead className="text-xs">Account Name</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs text-right">Balance (ETB)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts?.map((account: { code: string; name: string; type: string; balance: number }) => (
                      <TableRow key={account.code} className="hover:bg-muted/30">
                        <TableCell className="text-xs font-mono">{account.code}</TableCell>
                        <TableCell className="text-sm font-medium">{account.name}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-block text-xs font-medium px-2 py-0.5 rounded-md",
                            account.type === "Asset" && "bg-primary/10 text-primary",
                            account.type === "Liability" && "bg-destructive/10 text-destructive",
                            account.type === "Equity" && "bg-accent/30 text-accent-foreground",
                            account.type === "Revenue" && "bg-[oklch(0.40_0.10_162)]/10 text-[oklch(0.40_0.10_162)]",
                            account.type === "Expense" && "bg-[oklch(0.60_0.10_35)]/10 text-[oklch(0.60_0.10_35)]"
                          )}>
                            {account.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-right tabular-nums">
                          {formatETB(account.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ChartCard>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <ChartCard
            title={t.finance.transactions}
            subtitle="All transactions this period"
            action={<Button size="sm" className="gradient-emerald text-white" onClick={() => setTxnModal(true)}><Plus className="h-4 w-4 mr-1" />{t.finance.newTransaction}</Button>}
          >
            <TransactionTable transactions={transactions || []} loading={txnLoading} showAll />
          </ChartCard>
        </TabsContent>

        {/* Banks Tab */}
        <TabsContent value="banks" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" className="gradient-emerald text-white" onClick={() => setBankModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" />Add Bank Account
            </Button>
          </div>
          {bankLoading ? (
            <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {banks?.map((bank: { id: string; bankName: string; accountNo: string; balance: number; color: string }) => (
                <Card key={bank.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${bank.color}20` }}>
                        <span style={{ color: bank.color }}>{bankIcons[bank.bankName] || <Landmark className="h-5 w-5" />}</span>
                      </div>
                      <StatusBadge status="connected" label="Active" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{bank.bankName}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{bank.accountNo}</p>
                    <div className="mt-4 pt-4 border-t border-border/60">
                      <p className="text-xs text-muted-foreground">Available Balance</p>
                      <p className="text-xl font-bold text-foreground tabular-nums mt-1">{formatETB(bank.balance)}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Download className="h-3 w-3 mr-1" />Statement
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        {t.finance.reconcile}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tax Tab */}
        <TabsContent value="tax" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title={t.finance.vatRate} subtitle="Ethiopian VAT compliance (15%)">
              <div className="space-y-4">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{t.finance.vatCollected}</p>
                      <p className="text-2xl font-bold text-primary mt-1">{formatETB(monthlyIncome * 0.15)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{t.finance.witholdingTax}</p>
                    <p className="text-lg font-bold mt-1">{formatETB(monthlyExpense * 0.02)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{t.finance.businessIncomeTax}</p>
                    <p className="text-lg font-bold mt-1">{formatETB(netCash * 0.30)}</p>
                  </div>
                </div>
                <Button className="w-full gradient-emerald text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  {t.finance.vatReturns} — June 2026
                </Button>
              </div>
            </ChartCard>

            <ChartCard title="Tax Reports" subtitle="Generate compliance documents">
              <div className="space-y-2">
                {[
                  { name: t.finance.profitLoss, period: "Q2 2026", icon: <FileText className="h-4 w-4" />, action: () => accounts && exportFinancialStatementsHTML(accounts as any, "pnl") },
                  { name: t.finance.balanceSheet, period: "As of Jun 30", icon: <FileText className="h-4 w-4" />, action: () => accounts && exportFinancialStatementsHTML(accounts as any, "balance") },
                  { name: t.finance.cashFlow, period: "FY 2025-26", icon: <FileText className="h-4 w-4" />, action: () => transactions && exportTransactionsHTML(transactions as any) },
                  { name: t.finance.vatReturns, period: "Monthly", icon: <Receipt className="h-4 w-4" />, action: () => accounts && exportFinancialStatementsHTML(accounts as any, "pnl") },
                ].map((report) => (
                  <div key={report.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-border/40">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {report.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.period}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={report.action}>
                      <FileText className="h-3 w-3 mr-1" />View HTML
                    </Button>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs text-foreground">
                    All reports are ERCA-compliant and follow Ethiopian accounting standards. Click "View HTML" to open in browser.
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable Transaction Table
function TransactionTable({ transactions, loading, showAll = false }: { transactions: Array<{ id: string; txnId: string; type: string; party: string; amount: number; date: string; method: string; status: string }>; loading: boolean; showAll?: boolean }) {
  const { t } = useTranslation();
  if (loading) {
    return <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">ID</TableHead>
            <TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Party</TableHead>
            <TableHead className="text-xs hidden sm:table-cell">Method</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
            <TableHead className="text-xs text-right">Amount</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                No transactions yet. Create your first one!
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((txn) => (
              <TableRow key={txn.id} className="hover:bg-muted/30">
                <TableCell className="text-xs font-mono">{txn.txnId}</TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md",
                    txn.type === "received" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  )}>
                    {txn.type === "received" ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                    {txn.type === "received" ? t.finance.paymentReceived : t.finance.paymentSent}
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium">{txn.party}</TableCell>
                <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">{txn.method}</TableCell>
                <TableCell className="text-xs hidden md:table-cell text-muted-foreground">{new Date(txn.date).toLocaleDateString()}</TableCell>
                <TableCell className={cn(
                  "text-sm font-semibold text-right tabular-nums",
                  txn.type === "received" ? "text-primary" : "text-destructive"
                )}>
                  {txn.type === "received" ? "+" : "-"}{formatETB(txn.amount, { compact: !showAll })}
                </TableCell>
                <TableCell><StatusBadge status={txn.status as "completed"} /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
