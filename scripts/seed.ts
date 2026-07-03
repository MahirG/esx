// Database seed script — Ethiopian business data
// Run with: bun run db:seed

import { db } from "../src/lib/db";
import { calculatePayroll } from "../src/lib/tax-engine";

async function main() {
  console.log("🌱 Seeding Addis ERP database...");

  // Clean existing data
  await db.auditLog.deleteMany();
  await db.quotationItem.deleteMany();
  await db.quotation.deleteMany();
  await db.pipelineDeal.deleteMany();
  await db.customer.deleteMany();
  await db.leaveRequest.deleteMany();
  await db.payroll.deleteMany();
  await db.attendance.deleteMany();
  await db.employee.deleteMany();
  await db.stockMovement.deleteMany();
  await db.supplier.deleteMany();
  await db.product.deleteMany();
  await db.warehouse.deleteMany();
  await db.transaction.deleteMany();
  await db.bankAccount.deleteMany();
  await db.account.deleteMany();
  await db.taxFiling.deleteMany();
  await db.systemUser.deleteMany();
  await db.organization.deleteMany();

  // === Organization ===
  await db.organization.create({
    data: {
      name: "Addis Trading Enterprise",
      tin: "0009847263",
      vatNumber: "0009847263",
      address: "Bole Road, Friendship Building, Addis Ababa, Ethiopia",
      phone: "+251 11 663 0000",
      email: "info@addistrading.et",
      currency: "ETB",
      timezone: "Africa/Addis_Ababa",
      language: "en",
      vatRate: 15.0,
    },
  });

  // === System Users ===
  const users = [
    { name: "Abebe Bekele", email: "abebe.b@addiserp.et", role: "admin", status: "online", avatar: "AB" },
    { name: "Sara Tadesse", email: "sara.t@addiserp.et", role: "manager", status: "online", avatar: "ST" },
    { name: "Yohannes Girma", email: "yohannes.g@addiserp.et", role: "manager", status: "away", avatar: "YG" },
    { name: "Hanna Mengistu", email: "hanna.m@addiserp.et", role: "staff", status: "offline", avatar: "HM" },
    { name: "Daniel Kebede", email: "daniel.k@addiserp.et", role: "admin", status: "offline", avatar: "DK" },
    { name: "Rahel Alemu", email: "rahel.a@addiserp.et", role: "manager", status: "online", avatar: "RA" },
    { name: "Tewodros Assefa", email: "tewodros.a@addiserp.et", role: "admin", status: "online", avatar: "TA" },
    { name: "Bethel Solomon", email: "bethel.s@addiserp.et", role: "staff", status: "away", avatar: "BS" },
  ];
  for (const u of users) {
    await db.systemUser.create({ data: u });
  }

  // === Chart of Accounts ===
  const accounts = [
    { code: "1000", name: "Cash & Equivalents", type: "Asset", balance: 14280000 },
    { code: "1200", name: "Accounts Receivable", type: "Asset", balance: 3840000 },
    { code: "1500", name: "Inventory", type: "Asset", balance: 5920000 },
    { code: "1700", name: "Fixed Assets", type: "Asset", balance: 12400000 },
    { code: "2000", name: "Accounts Payable", type: "Liability", balance: 2780000 },
    { code: "2200", name: "VAT Payable", type: "Liability", balance: 276750 },
    { code: "2300", name: "Pension Payable", type: "Liability", balance: 476000 },
    { code: "3000", name: "Owner's Equity", type: "Equity", balance: 28000000 },
    { code: "4000", name: "Sales Revenue", type: "Revenue", balance: 18450000 },
    { code: "5000", name: "Cost of Goods Sold", type: "Expense", balance: 9200000 },
    { code: "6000", name: "Operating Expenses", type: "Expense", balance: 4930000 },
  ];
  for (const a of accounts) {
    await db.account.create({ data: a });
  }

  // === Bank Accounts ===
  const banks = [
    { bankName: "Dashen Bank", accountNo: "DASH-5021-8842", balance: 4840000, color: "oklch(0.52 0.14 162)" },
    { bankName: "Commercial Bank of Ethiopia", accountNo: "CBE-3329-1174", balance: 6280000, color: "oklch(0.40 0.10 162)" },
    { bankName: "Awash Bank", accountNo: "AWASH-7741-2208", balance: 2920000, color: "oklch(0.72 0.13 75)" },
    { bankName: "Telebirr", accountNo: "TB-+251911442880", balance: 184000, color: "oklch(0.60 0.10 35)" },
    { bankName: "Amole", accountNo: "AMO-882194", balance: 92000, color: "oklch(0.78 0.15 85)" },
  ];
  for (const b of banks) {
    await db.bankAccount.create({ data: b });
  }

  // === Warehouses ===
  const warehouses = [
    { name: "Addis Ababa Warehouse", location: "Addis Ababa, Akaki Kality", capacity: 85 },
    { name: "Dire Dawa Warehouse", location: "Dire Dawa, Keble 09", capacity: 62 },
    { name: "Bahir Dar Warehouse", location: "Bahir Dar, Amhara", capacity: 74 },
    { name: "Hawassa Warehouse", location: "Hawassa, SNNPR", capacity: 48 },
  ];
  const whRecords = [];
  for (const w of warehouses) {
    whRecords.push(await db.warehouse.create({ data: w }));
  }

  // === Suppliers ===
  const suppliers = [
    { name: "Mekdim Suppliers PLC", contact: "+251 911 234 567", email: "info@mekdim.et", productCount: 24, leadTime: 5, rating: 4.7 },
    { name: "Selam Trading Enterprise", contact: "+251 911 345 678", email: "sales@selam.et", productCount: 18, leadTime: 7, rating: 4.5 },
    { name: "Yenus Agricultural Coop", contact: "+251 911 456 789", email: "contact@yenus.et", productCount: 32, leadTime: 4, rating: 4.8 },
    { name: "Bekele Textiles", contact: "+251 911 567 890", email: "info@bekele.et", productCount: 12, leadTime: 10, rating: 4.3 },
    { name: "Hidase Logistics", contact: "+251 911 678 901", email: "ops@hidase.et", productCount: 8, leadTime: 3, rating: 4.6 },
  ];
  for (const s of suppliers) {
    await db.supplier.create({ data: s });
  }

  // === Products ===
  const products = [
    { sku: "BS-500", name: "Berbere Spice 500g", category: "Spices", quantity: 248, unitPrice: 300, costPrice: 180, reorderLevel: 50, warehouseIdx: 0 },
    { sku: "YC-1KG", name: "Yirgacheffe Coffee 1kg", category: "Coffee", quantity: 18, unitPrice: 600, costPrice: 380, reorderLevel: 30, warehouseIdx: 0 },
    { sku: "IF-5KG", name: "Injera Flour 5kg", category: "Grains", quantity: 8, unitPrice: 300, costPrice: 210, reorderLevel: 25, warehouseIdx: 2 },
    { sku: "TG-25KG", name: "Teff Grain 25kg", category: "Grains", quantity: 120, unitPrice: 1800, costPrice: 1400, reorderLevel: 100, warehouseIdx: 3 },
    { sku: "HW-GABI", name: "Hand-woven Gabi", category: "Textiles", quantity: 24, unitPrice: 1500, costPrice: 900, reorderLevel: 30, warehouseIdx: 1 },
    { sku: "EH-1KG", name: "Ethiopian Honey 1kg", category: "Natural", quantity: 84, unitPrice: 450, costPrice: 280, reorderLevel: 40, warehouseIdx: 0 },
    { sku: "KS-500", name: "Kolo Mixed Snack 500g", category: "Snacks", quantity: 320, unitPrice: 180, costPrice: 110, reorderLevel: 100, warehouseIdx: 0 },
    { sku: "TB-1L", name: "Tella Traditional Brew 1L", category: "Beverages", quantity: 980, unitPrice: 200, costPrice: 120, reorderLevel: 200, warehouseIdx: 2 },
    { sku: "SP-1KG", name: "Shiro Powder 1kg", category: "Spices", quantity: 12, unitPrice: 380, costPrice: 240, reorderLevel: 50, warehouseIdx: 0 },
    { sku: "SS-5KG", name: "Sesame Seeds 5kg", category: "Seeds", quantity: 0, unitPrice: 950, costPrice: 700, reorderLevel: 30, warehouseIdx: 1 },
  ];
  for (const p of products) {
    const status = p.quantity === 0 ? "outOfStock" : p.quantity <= p.reorderLevel ? "lowStock" : "inStock";
    await db.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        costPrice: p.costPrice,
        reorderLevel: p.reorderLevel,
        warehouseId: whRecords[p.warehouseIdx].id,
        status,
      },
    });
  }

  // === Employees ===
  const employees = [
    { empId: "E-001", name: "Abebe Bekele", email: "abebe.b@addiserp.et", phone: "+251911234567", position: "Finance Manager", department: "finance", salary: 42000, joinDate: "2021-03-15", status: "active" },
    { empId: "E-002", name: "Sara Tadesse", email: "sara.t@addiserp.et", phone: "+251911345678", position: "HR Specialist", department: "hr", salary: 28000, joinDate: "2022-07-01", status: "active" },
    { empId: "E-003", name: "Yohannes Girma", email: "yohannes.g@addiserp.et", phone: "+251911456789", position: "Inventory Supervisor", department: "operations", salary: 32000, joinDate: "2020-11-20", status: "active" },
    { empId: "E-004", name: "Hanna Mengistu", email: "hanna.m@addiserp.et", phone: "+251911567890", position: "Sales Representative", department: "sales", salary: 24000, joinDate: "2023-02-10", status: "active" },
    { empId: "E-005", name: "Daniel Kebede", email: "daniel.k@addiserp.et", phone: "+251911678901", position: "IT Support", department: "it", salary: 30000, joinDate: "2022-09-05", status: "active" },
    { empId: "E-006", name: "Meseret Lemma", email: "meseret.l@addiserp.et", phone: "+251911789012", position: "Accountant", department: "finance", salary: 26000, joinDate: "2021-12-01", status: "leave" },
    { empId: "E-007", name: "Rahel Alemu", email: "rahel.a@addiserp.et", phone: "+251911890123", position: "Sales Lead", department: "sales", salary: 36000, joinDate: "2020-05-18", status: "active" },
    { empId: "E-008", name: "Tewodros Assefa", email: "tewodros.a@addiserp.et", phone: "+251911901234", position: "Operations Manager", department: "operations", salary: 48000, joinDate: "2019-08-22", status: "active" },
    { empId: "E-009", name: "Bethel Solomon", email: "bethel.s@addiserp.et", phone: "+251911012345", position: "Marketing Specialist", department: "sales", salary: 28000, joinDate: "2023-04-12", status: "active" },
    { empId: "E-010", name: "Nahom Tesfaye", email: "nahom.t@addiserp.et", phone: "+251911123456", position: "Admin Assistant", department: "admin", salary: 22000, joinDate: "2022-10-30", status: "active" },
  ];
  for (const e of employees) {
    await db.employee.create({
      data: {
        ...e,
        joinDate: new Date(e.joinDate),
      },
    });
  }

  // === Customers ===
  const customers = [
    { name: "Selam Trading PLC", contact: "+251 911 234 567", email: "purchase@selamtrading.et", totalOrders: 184, lifetimeValue: 2840000, status: "vip" },
    { name: "Bekele Retail Store", contact: "+251 911 345 678", email: "bekele.retail@gmail.com", totalOrders: 142, lifetimeValue: 980000, status: "active" },
    { name: "Hidase Construction", contact: "+251 911 456 789", email: "procurement@hidase.et", totalOrders: 96, lifetimeValue: 4200000, status: "vip" },
    { name: "Yenus Market", contact: "+251 911 567 890", email: "yenus.market@gmail.com", totalOrders: 78, lifetimeValue: 412000, status: "active" },
    { name: "Merkato Distributors", contact: "+251 911 678 901", email: "info@merkato.et", totalOrders: 64, lifetimeValue: 1840000, status: "active" },
    { name: "Piazza Food Mart", contact: "+251 911 789 012", email: "piazza.food@gmail.com", totalOrders: 52, lifetimeValue: 268000, status: "active" },
    { name: "Bole Mini Market", contact: "+251 911 890 123", email: "bole.mini@gmail.com", totalOrders: 42, lifetimeValue: 198000, status: "regular" },
    { name: "Sarbet Wholesale", contact: "+251 911 901 234", email: "sarbet.wholesale@gmail.com", totalOrders: 38, lifetimeValue: 412000, status: "regular" },
  ];
  const custRecords = [];
  for (const c of customers) {
    custRecords.push(await db.customer.create({ data: c }));
  }

  // === Transactions ===
  const txns = [
    { txnId: "TXN-2841", type: "received", party: "Selam Trading PLC", amount: 184000, method: "Dashen Bank", status: "completed", date: "2026-07-03" },
    { txnId: "TXN-2840", type: "sent", party: "Mekdim Suppliers", amount: 92000, method: "CBE", status: "completed", date: "2026-07-03" },
    { txnId: "TXN-2839", type: "received", party: "Bekele Retail Store", amount: 47200, method: "Telebirr", status: "completed", date: "2026-07-02" },
    { txnId: "TXN-2838", type: "received", party: "Hidase Construction", amount: 312000, method: "Awash Bank", status: "completed", date: "2026-07-02" },
    { txnId: "TXN-2837", type: "sent", party: "Ethio Telecom", amount: 18400, method: "Amole", status: "completed", date: "2026-07-01" },
    { txnId: "TXN-2836", type: "received", party: "Yenus Market", amount: 68500, method: "Telebirr", status: "completed", date: "2026-07-01" },
  ];
  for (const t of txns) {
    const bank = banks.find(b => b.bankName === t.method) || banks[0];
    const bankAccount = await db.bankAccount.findFirst({ where: { accountNo: bank.accountNo } });
    await db.transaction.create({
      data: {
        ...t,
        date: new Date(t.date),
        bankAccountId: bankAccount?.id,
      },
    });
  }

  // === Tax Filings ===
  const taxFilings = [
    { type: "Monthly VAT Return", period: "June 2026", amount: 276750, dueDate: "2026-07-25", status: "pending" },
    { type: "Withholding Tax", period: "June 2026", amount: 92400, dueDate: "2026-07-15", status: "pending" },
    { type: "Pension Contribution", period: "June 2026", amount: 476000, dueDate: "2026-07-10", status: "pending" },
    { type: "Turnover Tax Q2", period: "Q2 2026", amount: 184000, dueDate: "2026-07-31", status: "pending" },
    { type: "Business Income Tax", period: "FY 2025-26", amount: 1296000, dueDate: "2026-07-15", status: "overdue" },
  ];
  for (const tf of taxFilings) {
    await db.taxFiling.create({
      data: { ...tf, dueDate: new Date(tf.dueDate) },
    });
  }

  // === Payroll for June 2026 ===
  const empRecords = await db.employee.findMany();
  for (const emp of empRecords) {
    const calc = calculatePayroll(emp.salary);
    await db.payroll.create({
      data: {
        employeeId: emp.id,
        period: "June 2026",
        grossSalary: calc.grossSalary,
        pension: calc.pensionEmployee,
        incomeTax: calc.incomeTax,
        netPay: calc.netPay,
        status: "processed",
      },
    });
  }

  // === Quotations ===
  const productRecords = await db.product.findMany();
  const quotations = [
    { quoteNo: "Q-2026-084", customerIdx: 0, date: "2026-07-02", validUntil: "2026-07-16", status: "sent", items: [{ prodIdx: 0, qty: 200 }, { prodIdx: 5, qty: 50 }] },
    { quoteNo: "Q-2026-083", customerIdx: 2, date: "2026-07-01", validUntil: "2026-07-15", status: "accepted", items: [{ prodIdx: 3, qty: 100 }, { prodIdx: 1, qty: 80 }] },
    { quoteNo: "Q-2026-082", customerIdx: 4, date: "2026-06-30", validUntil: "2026-07-14", status: "pending", items: [{ prodIdx: 6, qty: 300 }] },
    { quoteNo: "Q-2026-081", customerIdx: 6, date: "2026-06-29", validUntil: "2026-07-13", status: "expired", items: [{ prodIdx: 8, qty: 40 }] },
    { quoteNo: "Q-2026-080", customerIdx: 1, date: "2026-06-28", validUntil: "2026-07-12", status: "accepted", items: [{ prodIdx: 2, qty: 60 }, { prodIdx: 7, qty: 120 }] },
  ];
  for (const q of quotations) {
    let amount = 0;
    for (const item of q.items) {
      amount += productRecords[item.prodIdx].unitPrice * item.qty;
    }
    const vatAmount = Math.round(amount * 0.15);
    const total = amount + vatAmount;
    const quote = await db.quotation.create({
      data: {
        quoteNo: q.quoteNo,
        customerId: custRecords[q.customerIdx].id,
        date: new Date(q.date),
        validUntil: new Date(q.validUntil),
        amount,
        vatAmount,
        total,
        status: q.status,
      },
    });
    for (const item of q.items) {
      const prod = productRecords[item.prodIdx];
      await db.quotationItem.create({
        data: {
          quotationId: quote.id,
          productId: prod.id,
          quantity: item.qty,
          unitPrice: prod.unitPrice,
          total: prod.unitPrice * item.qty,
        },
      });
    }
  }

  // === Pipeline Deals ===
  const pipelineDeals = [
    { customerIdx: 0, title: "Annual Supply Contract", value: 1840000, stage: "negotiation" },
    { customerIdx: 1, title: "Retail Partnership", value: 480000, stage: "proposal" },
    { customerIdx: 2, title: "Construction Materials", value: 4200000, stage: "won" },
    { customerIdx: 3, title: "Market Expansion", value: 320000, stage: "qualified" },
    { customerIdx: 4, title: "Distribution Deal", value: 920000, stage: "lead" },
    { customerIdx: 5, title: "Food Supply Contract", value: 280000, stage: "lost" },
    { customerIdx: 6, title: "Mini Market Supply", value: 198000, stage: "won" },
    { customerIdx: 7, title: "Wholesale Agreement", value: 412000, stage: "negotiation" },
  ];
  for (const p of pipelineDeals) {
    await db.pipelineDeal.create({
      data: {
        customerId: custRecords[p.customerIdx].id,
        title: p.title,
        value: p.value,
        stage: p.stage,
      },
    });
  }

  // === Initial Audit Logs ===
  const adminUser = await db.systemUser.findFirst({ where: { role: "admin" } });
  const auditLogs = [
    { action: "System initialized", entity: "System", userName: "System", details: "Database seeded with initial data" },
    { action: "Approved invoice INV-2026-084", entity: "Finance", userName: "Abebe Bekele", details: "Payment received from Selam Trading" },
    { action: "Updated employee record E-004", entity: "HR", userName: "Sara Tadesse", details: "Salary adjustment" },
    { action: "Adjusted inventory for P-003", entity: "Inventory", userName: "Yohannes Girma", details: "Stock correction" },
    { action: "Generated VAT return for June 2026", entity: "Compliance", userName: "Rahel Alemu" },
    { action: "Modified supplier S-002 contact", entity: "Inventory", userName: "Tewodros Assefa" },
    { action: "Created quotation Q-2026-084", entity: "Sales", userName: "Hanna Mengistu" },
    { action: "Bank reconciliation for Dashen Bank", entity: "Finance", userName: "Abebe Bekele" },
  ];
  for (const log of auditLogs) {
    await db.auditLog.create({
      data: {
        ...log,
        userId: adminUser?.id,
        ipAddress: "196.188.44.22",
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`   - ${users.length} users`);
  console.log(`   - ${accounts.length} accounts`);
  console.log(`   - ${banks.length} bank accounts`);
  console.log(`   - ${warehouses.length} warehouses`);
  console.log(`   - ${suppliers.length} suppliers`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${employees.length} employees`);
  console.log(`   - ${customers.length} customers`);
  console.log(`   - ${txns.length} transactions`);
  console.log(`   - ${taxFilings.length} tax filings`);
  console.log(`   - ${empRecords.length} payroll records`);
  console.log(`   - ${quotations.length} quotations`);
  console.log(`   - ${pipelineDeals.length} pipeline deals`);
  console.log(`   - ${auditLogs.length} audit logs`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
