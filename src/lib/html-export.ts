// HTML Document Export System
// Generates standalone, printable HTML documents that open in browser
// Each document is self-contained with Ethiopian branding

import type {
  Quotation,
  Employee,
  Transaction,
  TaxFiling,
  Account,
  AuditLog,
} from "./types";

const STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1a2e1a;
    background: #f8f6f0;
    padding: 40px 20px;
    line-height: 1.6;
  }
  .doc {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .header {
    background: linear-gradient(135deg, #00A8E1 0%, #2BD5F5 100%);
    color: white;
    padding: 32px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header h1 { font-size: 24px; font-weight: 700; }
  .header p { font-size: 13px; opacity: 0.9; margin-top: 4px; }
  .brand-logo {
    width: 56px; height: 56px;
    background: rgba(255,255,255,0.15);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: bold;
    border: 1px solid rgba(255,255,255,0.2);
  }
  .body { padding: 40px; }
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }
  .meta-box {
    background: #f8f6f0;
    border: 1px solid #e0dfd5;
    border-radius: 8px;
    padding: 16px;
  }
  .meta-box h3 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7c6b;
    margin-bottom: 8px;
  }
  .meta-box p { font-size: 14px; color: #1a2e1a; }
  .meta-box .big { font-size: 18px; font-weight: 600; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
  }
  th {
    background: #00A8E1;
    color: white;
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  th:first-child { border-radius: 8px 0 0 0; }
  th:last-child { border-radius: 0 8px 0 0; }
  td {
    padding: 12px 16px;
    border-bottom: 1px solid #e0dfd5;
    font-size: 14px;
  }
  tr:nth-child(even) td { background: #fafaf5; }
  .totals {
    margin-left: auto;
    width: 300px;
    margin-top: 16px;
  }
  .totals .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 14px;
    border-bottom: 1px solid #e0dfd5;
  }
  .totals .row.grand {
    font-size: 18px;
    font-weight: 700;
    color: #00A8E1;
    border-bottom: 2px solid #00A8E1;
    padding: 12px 0;
  }
  .footer {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 2px solid #e0dfd5;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7c6b;
  }
  .footer .sig {
    border-top: 1px solid #1a2e1a;
    padding-top: 8px;
    width: 200px;
    text-align: center;
    margin-top: 40px;
  }
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .badge.success { background: rgba(0, 168, 225, 0.15); color: #00A8E1; }
  .badge.warning { background: rgba(255, 183, 77, 0.2); color: #B8860B; }
  .badge.danger { background: rgba(255, 82, 82, 0.15); color: #C62828; }
  .status-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    margin: 24px 0;
  }
  .status-bar.success { background: rgba(0, 168, 225, 0.08); border: 1px solid rgba(0, 168, 225, 0.2); }
  .status-bar.warning { background: rgba(255, 183, 77, 0.1); border: 1px solid rgba(255, 183, 77, 0.3); }
  .tax-breakdown {
    background: #f8f6f0;
    border-radius: 8px;
    padding: 24px;
    margin: 24px 0;
  }
  .tax-breakdown h3 {
    font-size: 14px;
    color: #00A8E1;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .print-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, #00A8E1 0%, #2BD5F5 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: transform 0.2s;
  }
  .print-btn:hover { transform: translateY(-2px); }
  @media print {
    body { background: white; padding: 0; }
    .doc { box-shadow: none; max-width: none; }
    .print-btn { display: none; }
  }
`;

function htmlTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Addis ERP</title>
  <style>${STYLES}</style>
</head>
<body>
  ${body}
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
</body>
</html>`;
}

const ORG_INFO = {
  name: "Hisab Trading Enterprise",
  tin: "0009847263",
  vatNumber: "0009847263",
  address: "Bole Road, Friendship Building, Addis Ababa, Ethiopia",
  phone: "+251 11 663 0000",
  email: "info@hisaberp.et",
};

function header(title: string, subtitle: string): string {
  return `<div class="header">
    <div>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
    <div class="brand-logo">H</div>
  </div>`;
}

function footer(): string {
  return `<div class="footer">
    <div>
      <strong>${ORG_INFO.name}</strong><br>
      ${ORG_INFO.address}<br>
      TIN: ${ORG_INFO.tin} • VAT: ${ORG_INFO.vatNumber}<br>
      ${ORG_INFO.phone} • ${ORG_INFO.email}
    </div>
    <div>
      <p>Generated by Hisab ERP</p>
      <p>${new Date().toLocaleString()}</p>
      <p style="margin-top:8px; font-size:11px;">This is a computer-generated document.</p>
    </div>
  </div>`;
}

export function exportQuotationHTML(quote: Quotation): void {
  const itemsRows = quote.items?.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${item.product?.name || "—"}</td>
      <td>${item.product?.sku || "—"}</td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:right;">${item.unitPrice.toLocaleString()} ETB</td>
      <td style="text-align:right; font-weight:600;">${item.total.toLocaleString()} ETB</td>
    </tr>
  `).join("") || "";

  const body = `
    <div class="doc">
      ${header("QUOTATION", quote.quoteNo)}
      <div class="body">
        <div class="meta-grid">
          <div class="meta-box">
            <h3>Quotation Number</h3>
            <p class="big">${quote.quoteNo}</p>
            <p style="margin-top:8px;">Date: ${new Date(quote.date).toLocaleDateString()}</p>
            <p>Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}</p>
          </div>
          <div class="meta-box">
            <h3>Bill To</h3>
            <p class="big">${quote.customer?.name || "—"}</p>
            <p style="margin-top:8px;">${quote.customer?.contact || ""}</p>
            <p>${quote.customer?.email || ""}</p>
          </div>
        </div>

        <div class="status-bar ${quote.status === 'accepted' ? 'success' : 'warning'}">
          <span class="badge ${quote.status === 'accepted' ? 'success' : 'warning'}">${quote.status.toUpperCase()}</span>
          <span>This quotation is valid until ${new Date(quote.validUntil).toLocaleDateString()}. Please reference ${quote.quoteNo} in all communications.</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>SKU</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>

        <div class="totals">
          <div class="row"><span>Subtotal:</span><span>${quote.amount.toLocaleString()} ETB</span></div>
          <div class="row"><span>VAT (15%):</span><span>${quote.vatAmount.toLocaleString()} ETB</span></div>
          <div class="row grand"><span>Total:</span><span>${quote.total.toLocaleString()} ETB</span></div>
        </div>

        ${quote.notes ? `<div class="meta-box" style="margin-top:24px;"><h3>Notes</h3><p>${quote.notes}</p></div>` : ""}

        ${footer()}
      </div>
    </div>
  `;

  openHTML(`Quotation ${quote.quoteNo}`, body);
}

export function exportPayslipHTML(employee: Employee, payroll: { grossSalary: number; pension: number; incomeTax: number; netPay: number; period: string }): void {
  const totalDeductions = payroll.pension + payroll.incomeTax;
  const body = `
    <div class="doc">
      ${header("PAYSLIP", payroll.period)}
      <div class="body">
        <div class="meta-grid">
          <div class="meta-box">
            <h3>Employee</h3>
            <p class="big">${employee.name}</p>
            <p style="margin-top:8px;">ID: ${employee.empId}</p>
            <p>${employee.position}</p>
            <p style="text-transform:capitalize;">${employee.department} Department</p>
          </div>
          <div class="meta-box">
            <h3>Pay Period</h3>
            <p class="big">${payroll.period}</p>
            <p style="margin-top:8px;">Pay Date: ${new Date().toLocaleDateString()}</p>
            <p>Status: <span class="badge success">PROCESSED</span></p>
          </div>
        </div>

        <div class="tax-breakdown">
          <h3>Earnings</h3>
          <table>
            <thead>
              <tr><th>Description</th><th style="text-align:right;">Amount (ETB)</th></tr>
            </thead>
            <tbody>
              <tr><td>Basic Salary</td><td style="text-align:right; font-weight:600;">${payroll.grossSalary.toLocaleString()}</td></tr>
              <tr><td><strong>Gross Pay</strong></td><td style="text-align:right; font-weight:700;">${payroll.grossSalary.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="tax-breakdown">
          <h3>Deductions (Ethiopian ERCA Compliance)</h3>
          <table>
            <thead>
              <tr><th>Description</th><th style="text-align:right;">Amount (ETB)</th></tr>
            </thead>
            <tbody>
              <tr><td>Pension Contribution (7%)</td><td style="text-align:right;">-${payroll.pension.toLocaleString()}</td></tr>
              <tr><td>Income Tax (PAYE)</td><td style="text-align:right;">-${payroll.incomeTax.toLocaleString()}</td></tr>
              <tr><td><strong>Total Deductions</strong></td><td style="text-align:right; font-weight:700; color:oklch(0.45 0.20 27);">-${totalDeductions.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="row"><span>Gross Pay:</span><span>${payroll.grossSalary.toLocaleString()} ETB</span></div>
          <div class="row"><span>Total Deductions:</span><span style="color:oklch(0.45 0.20 27);">-${totalDeductions.toLocaleString()} ETB</span></div>
          <div class="row grand"><span>Net Pay:</span><span>${payroll.netPay.toLocaleString()} ETB</span></div>
        </div>

        <div class="status-bar success">
          <span class="badge success">PAID</span>
          <span>Net pay of ${payroll.netPay.toLocaleString()} ETB has been processed for deposit to employee's bank account.</span>
        </div>

        ${footer()}
      </div>
    </div>
  `;

  openHTML(`Payslip - ${employee.name}`, body);
}

export function exportTransactionsHTML(transactions: Transaction[]): void {
  const rows = transactions.map((t) => `
    <tr>
      <td style="font-family:monospace; font-size:12px;">${t.txnId}</td>
      <td><span class="badge ${t.type === 'received' ? 'success' : 'danger'}">${t.type.toUpperCase()}</span></td>
      <td>${t.party}</td>
      <td>${t.method}</td>
      <td>${new Date(t.date).toLocaleDateString()}</td>
      <td style="text-align:right; font-weight:600; color:${t.type === 'received' ? 'oklch(0.40 0.10 162)' : 'oklch(0.45 0.20 27)'};">
        ${t.type === 'received' ? '+' : '-'}${t.amount.toLocaleString()} ETB
      </td>
      <td><span class="badge ${t.status === 'completed' ? 'success' : 'warning'}">${t.status.toUpperCase()}</span></td>
    </tr>
  `).join("");

  const totalIn = transactions.filter(t => t.type === "received").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === "sent").reduce((s, t) => s + t.amount, 0);

  const body = `
    <div class="doc">
      ${header("TRANSACTION REPORT", `${transactions.length} transactions`)}
      <div class="body">
        <div class="meta-grid">
          <div class="meta-box">
            <h3>Total Inflow</h3>
            <p class="big" style="color:oklch(0.40 0.10 162);">${totalIn.toLocaleString()} ETB</p>
          </div>
          <div class="meta-box">
            <h3>Total Outflow</h3>
            <p class="big" style="color:oklch(0.45 0.20 27);">${totalOut.toLocaleString()} ETB</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Txn ID</th><th>Type</th><th>Party</th><th>Method</th>
              <th>Date</th><th style="text-align:right;">Amount</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="totals">
          <div class="row"><span>Net Cash Flow:</span><span style="font-weight:700; color:${totalIn - totalOut >= 0 ? 'oklch(0.40 0.10 162)' : 'oklch(0.45 0.20 27)'};">${(totalIn - totalOut).toLocaleString()} ETB</span></div>
        </div>

        ${footer()}
      </div>
    </div>
  `;

  openHTML("Transaction Report", body);
}

export function exportAuditLogHTML(logs: AuditLog[]): void {
  const rows = logs.map((l) => `
    <tr>
      <td style="font-family:monospace; font-size:11px;">${new Date(l.timestamp).toLocaleString()}</td>
      <td>${l.userName}</td>
      <td>${l.action}</td>
      <td><span class="badge success">${l.entity}</span></td>
      <td style="font-size:12px; color:#6b7c6b;">${l.details || "—"}</td>
      <td style="font-family:monospace; font-size:11px;">${l.ipAddress || "—"}</td>
    </tr>
  `).join("");

  const body = `
    <div class="doc">
      ${header("AUDIT TRAIL REPORT", `${logs.length} log entries`)}
      <div class="body">
        <div class="status-bar success">
          <span class="badge success">COMPLIANCE READY</span>
          <span>This audit trail is ERCA-compliant and tracks all system changes for regulatory review.</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Timestamp</th><th>User</th><th>Action</th>
              <th>Module</th><th>Details</th><th>IP Address</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        ${footer()}
      </div>
    </div>
  `;

  openHTML("Audit Trail Report", body);
}

export function exportTaxReportHTML(filings: TaxFiling[]): void {
  const rows = filings.map((f) => `
    <tr>
      <td><strong>${f.type}</strong></td>
      <td>${f.period}</td>
      <td>${f.amount.toLocaleString()} ETB</td>
      <td>${new Date(f.dueDate).toLocaleDateString()}</td>
      <td>${f.filedDate ? new Date(f.filedDate).toLocaleDateString() : "—"}</td>
      <td><span class="badge ${f.status === 'filed' ? 'success' : f.status === 'overdue' ? 'danger' : 'warning'}">${f.status.toUpperCase()}</span></td>
    </tr>
  `).join("");

  const totalDue = filings.reduce((s, f) => s + f.amount, 0);
  const totalFiled = filings.filter(f => f.status === "filed").reduce((s, f) => s + f.amount, 0);

  const body = `
    <div class="doc">
      ${header("TAX COMPLIANCE REPORT", "ERCA Filing Status")}
      <div class="body">
        <div class="meta-grid">
          <div class="meta-box">
            <h3>Total Tax Liability</h3>
            <p class="big">${totalDue.toLocaleString()} ETB</p>
          </div>
          <div class="meta-box">
            <h3>Amount Filed</h3>
            <p class="big" style="color:oklch(0.40 0.10 162);">${totalFiled.toLocaleString()} ETB</p>
          </div>
        </div>

        <div class="status-bar ${totalFiled < totalDue ? 'warning' : 'success'}">
          <span class="badge ${totalFiled < totalDue ? 'warning' : 'success'}">${totalFiled < totalDue ? 'PENDING FILINGS' : 'FULLY COMPLIANT'}</span>
          <span>${filings.filter(f => f.status !== "filed").length} tax filing(s) pending. Ensure timely submission to ERCA.</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Tax Type</th><th>Period</th><th>Amount</th>
              <th>Due Date</th><th>Filed Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="totals">
          <div class="row"><span>Total Liability:</span><span>${totalDue.toLocaleString()} ETB</span></div>
          <div class="row"><span>Filed:</span><span style="color:oklch(0.40 0.10 162);">${totalFiled.toLocaleString()} ETB</span></div>
          <div class="row grand"><span>Outstanding:</span><span style="color:oklch(0.45 0.20 27);">${(totalDue - totalFiled).toLocaleString()} ETB</span></div>
        </div>

        ${footer()}
      </div>
    </div>
  `;

  openHTML("Tax Compliance Report", body);
}

export function exportFinancialStatementsHTML(accounts: Account[], type: "pnl" | "balance"): void {
  const title = type === "pnl" ? "PROFIT & LOSS STATEMENT" : "BALANCE SHEET";
  const subtitle = type === "pnl" ? "Income Statement" : "Financial Position";

  const revenue = accounts.filter(a => a.type === "Revenue").reduce((s, a) => s + a.balance, 0);
  const expenses = accounts.filter(a => a.type === "Expense").reduce((s, a) => s + a.balance, 0);
  const assets = accounts.filter(a => a.type === "Asset").reduce((s, a) => s + a.balance, 0);
  const liabilities = accounts.filter(a => a.type === "Liability").reduce((s, a) => s + a.balance, 0);
  const equity = accounts.filter(a => a.type === "Equity").reduce((s, a) => s + a.balance, 0);

  let content = "";
  if (type === "pnl") {
    const revRows = accounts.filter(a => a.type === "Revenue").map(a => `<tr><td>${a.code} - ${a.name}</td><td style="text-align:right;">${a.balance.toLocaleString()} ETB</td></tr>`).join("");
    const expRows = accounts.filter(a => a.type === "Expense").map(a => `<tr><td>${a.code} - ${a.name}</td><td style="text-align:right; color:oklch(0.45 0.20 27);">(${a.balance.toLocaleString()}) ETB</td></tr>`).join("");
    const netProfit = revenue - expenses;
    content = `
      <table>
        <thead><tr><th>Revenue Accounts</th><th style="text-align:right;">Amount</th></tr></thead>
        <tbody>${revRows}</tbody>
      </table>
      <table>
        <thead><tr><th>Expense Accounts</th><th style="text-align:right;">Amount</th></tr></thead>
        <tbody>${expRows}</tbody>
      </table>
      <div class="totals">
        <div class="row"><span>Total Revenue:</span><span style="color:oklch(0.40 0.10 162);">${revenue.toLocaleString()} ETB</span></div>
        <div class="row"><span>Total Expenses:</span><span style="color:oklch(0.45 0.20 27);">(${expenses.toLocaleString()}) ETB</span></div>
        <div class="row grand"><span>Net Profit:</span><span style="color:${netProfit >= 0 ? 'oklch(0.40 0.10 162)' : 'oklch(0.45 0.20 27)'};">${netProfit.toLocaleString()} ETB</span></div>
      </div>
    `;
  } else {
    const assetRows = accounts.filter(a => a.type === "Asset").map(a => `<tr><td>${a.code} - ${a.name}</td><td style="text-align:right;">${a.balance.toLocaleString()} ETB</td></tr>`).join("");
    const liabRows = accounts.filter(a => a.type === "Liability").map(a => `<tr><td>${a.code} - ${a.name}</td><td style="text-align:right;">${a.balance.toLocaleString()} ETB</td></tr>`).join("");
    const eqRows = accounts.filter(a => a.type === "Equity").map(a => `<tr><td>${a.code} - ${a.name}</td><td style="text-align:right;">${a.balance.toLocaleString()} ETB</td></tr>`).join("");
    content = `
      <table>
        <thead><tr><th>Assets</th><th style="text-align:right;">Amount</th></tr></thead>
        <tbody>${assetRows}</tbody>
        <tfoot><tr><td style="padding:12px 16px; font-weight:700;">Total Assets</td><td style="text-align:right; font-weight:700; color:oklch(0.40 0.10 162);">${assets.toLocaleString()} ETB</td></tr></tfoot>
      </table>
      <table>
        <thead><tr><th>Liabilities</th><th style="text-align:right;">Amount</th></tr></thead>
        <tbody>${liabRows}</tbody>
        <tfoot><tr><td style="padding:12px 16px; font-weight:700;">Total Liabilities</td><td style="text-align:right; font-weight:700; color:oklch(0.45 0.20 27);">${liabilities.toLocaleString()} ETB</td></tr></tfoot>
      </table>
      <table>
        <thead><tr><th>Equity</th><th style="text-align:right;">Amount</th></tr></thead>
        <tbody>${eqRows}</tbody>
        <tfoot><tr><td style="padding:12px 16px; font-weight:700;">Total Equity</td><td style="text-align:right; font-weight:700;">${equity.toLocaleString()} ETB</td></tr></tfoot>
      </table>
      <div class="totals">
        <div class="row"><span>Assets:</span><span>${assets.toLocaleString()} ETB</span></div>
        <div class="row"><span>Liabilities + Equity:</span><span>${(liabilities + equity).toLocaleString()} ETB</span></div>
        <div class="row grand"><span>Balanced:</span><span style="color:oklch(0.40 0.10 162);">${assets === liabilities + equity ? '✓ YES' : '✗ NO'}</span></div>
      </div>
    `;
  }

  const body = `
    <div class="doc">
      ${header(title, subtitle)}
      <div class="body">
        <div class="meta-box" style="margin-bottom:24px;">
          <h3>Reporting Period</h3>
          <p class="big">Fiscal Year 2025-26</p>
          <p style="margin-top:8px;">As of ${new Date().toLocaleDateString()}</p>
        </div>
        ${content}
        ${footer()}
      </div>
    </div>
  `;

  openHTML(title, body);
}

export function exportInventoryHTML(products: Array<{ sku: string; name: string; category: string; quantity: number; unitPrice: number; status: string; warehouse?: { name: string } }>): void {
  const rows = products.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td style="font-family:monospace; font-size:12px;">${p.sku}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td style="text-align:center;">${p.quantity}</td>
      <td style="text-align:right;">${p.unitPrice.toLocaleString()} ETB</td>
      <td style="text-align:right; font-weight:600;">${(p.quantity * p.unitPrice).toLocaleString()} ETB</td>
      <td>${p.warehouse?.name || "—"}</td>
      <td><span class="badge ${p.status === 'inStock' ? 'success' : p.status === 'lowStock' ? 'warning' : 'danger'}">${p.status.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</span></td>
    </tr>
  `).join("");

  const totalValue = products.reduce((s, p) => s + p.quantity * p.unitPrice, 0);

  const body = `
    <div class="doc">
      ${header("INVENTORY REPORT", `${products.length} products`)}
      <div class="body">
        <div class="meta-grid">
          <div class="meta-box">
            <h3>Total Stock Value</h3>
            <p class="big" style="color:oklch(0.40 0.10 162);">${totalValue.toLocaleString()} ETB</p>
          </div>
          <div class="meta-box">
            <h3>Items Requiring Attention</h3>
            <p class="big" style="color:oklch(0.50 0.10 75);">${products.filter(p => p.status !== "inStock").length}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th><th>SKU</th><th>Product Name</th><th>Category</th>
              <th style="text-align:center;">Qty</th><th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Total Value</th><th>Warehouse</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        ${footer()}
      </div>
    </div>
  `;

  openHTML("Inventory Report", body);
}

export function exportEmployeesHTML(employees: Employee[]): void {
  const rows = employees.map((e, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td style="font-family:monospace;">${e.empId}</td>
      <td>${e.name}</td>
      <td>${e.position}</td>
      <td style="text-transform:capitalize;">${e.department}</td>
      <td>${e.email || "—"}</td>
      <td>${e.phone || "—"}</td>
      <td style="text-align:right;">${e.salary.toLocaleString()} ETB</td>
      <td>${new Date(e.joinDate).toLocaleDateString()}</td>
      <td><span class="badge ${e.status === 'active' ? 'success' : 'warning'}">${e.status.toUpperCase()}</span></td>
    </tr>
  `).join("");

  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0);

  const body = `
    <div class="doc">
      ${header("EMPLOYEE DIRECTORY", `${employees.length} employees`)}
      <div class="body">
        <div class="meta-grid">
          <div class="meta-box">
            <h3>Total Monthly Payroll</h3>
            <p class="big" style="color:oklch(0.40 0.10 162);">${totalPayroll.toLocaleString()} ETB</p>
          </div>
          <div class="meta-box">
            <h3>Active Employees</h3>
            <p class="big">${employees.filter(e => e.status === "active").length}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th><th>Emp ID</th><th>Name</th><th>Position</th>
              <th>Department</th><th>Email</th><th>Phone</th>
              <th style="text-align:right;">Salary</th><th>Join Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        ${footer()}
      </div>
    </div>
  `;

  openHTML("Employee Directory", body);
}

// Helper to open HTML in new tab
function openHTML(title: string, body: string): void {
  const html = htmlTemplate(title, body);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    // Fallback: download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.html`;
    a.click();
  }
  // Clean up URL after delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// CSV Export utility
export function exportCSV(filename: string, headers: string[], rows: string[][]): void {
  const csv = [
    headers.join(","),
    ...rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Entity-specific CSV exports
export function exportCustomersCSV(customers: Array<{ name: string; contact: string; email?: string | null; totalOrders: number; lifetimeValue: number; status: string }>): void {
  exportCSV("customers", ["Name", "Contact", "Email", "Total Orders", "Lifetime Value (ETB)", "Status"],
    customers.map(c => [c.name, c.contact, c.email || "", String(c.totalOrders), String(c.lifetimeValue), c.status]));
}

export function exportTransactionsCSV(transactions: Transaction[]): void {
  exportCSV("transactions", ["Txn ID", "Type", "Party", "Amount (ETB)", "Method", "Date", "Status"],
    transactions.map(t => [t.txnId, t.type, t.party, String(t.amount), t.method, new Date(t.date).toLocaleDateString(), t.status]));
}

export function exportProductsCSV(products: Array<{ sku: string; name: string; category: string; quantity: number; unitPrice: number; status: string }>): void {
  exportCSV("products", ["SKU", "Name", "Category", "Quantity", "Unit Price (ETB)", "Status"],
    products.map(p => [p.sku, p.name, p.category, String(p.quantity), String(p.unitPrice), p.status]));
}

export function exportEmployeesCSV(employees: Employee[]): void {
  exportCSV("employees", ["Emp ID", "Name", "Position", "Department", "Salary (ETB)", "Email", "Phone", "Status"],
    employees.map(e => [e.empId, e.name, e.position, e.department, String(e.salary), e.email || "", e.phone || "", e.status]));
}

export function exportAuditLogsCSV(logs: AuditLog[]): void {
  exportCSV("audit-logs", ["Timestamp", "User", "Action", "Entity", "Details", "IP Address"],
    logs.map(l => [new Date(l.timestamp).toLocaleString(), l.userName, l.action, l.entity, l.details || "", l.ipAddress || ""]));
}
