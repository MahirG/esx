// Ethiopian ERP mock data with realistic business context
// All amounts in ETB (Ethiopian Birr)

export const dashboardKPIs = {
  totalRevenue: 18450000,
  netProfit: 4320000,
  vatCollected: 2767500,
  activeEmployees: 142,
  revenueGrowth: 12.4,
  profitGrowth: 8.7,
  vatGrowth: 15.2,
  employeeGrowth: 5.0,
  fiscalHealthScore: 87,
};

export const revenueTrend = [
  { month: "Jul", revenue: 1240000, expense: 890000, profit: 350000 },
  { month: "Aug", revenue: 1380000, expense: 920000, profit: 460000 },
  { month: "Sep", revenue: 1520000, expense: 1050000, profit: 470000 },
  { month: "Oct", revenue: 1410000, expense: 980000, profit: 430000 },
  { month: "Nov", revenue: 1680000, expense: 1120000, profit: 560000 },
  { month: "Dec", revenue: 1950000, expense: 1240000, profit: 710000 },
  { month: "Jan", revenue: 1720000, expense: 1180000, profit: 540000 },
  { month: "Feb", revenue: 1840000, expense: 1210000, profit: 630000 },
  { month: "Mar", revenue: 1680000, expense: 1090000, profit: 590000 },
  { month: "Apr", revenue: 1920000, expense: 1270000, profit: 650000 },
  { month: "May", revenue: 2050000, expense: 1340000, profit: 710000 },
  { month: "Jun", revenue: 2180000, expense: 1410000, profit: 770000 },
];

export const expenseBreakdown = [
  { name: "Payroll & Salaries", value: 6800000, color: "oklch(0.52 0.14 162)" },
  { name: "Inventory & Supplies", value: 4200000, color: "oklch(0.72 0.13 75)" },
  { name: "Operations & Logistics", value: 2100000, color: "oklch(0.60 0.10 35)" },
  { name: "Marketing & Sales", value: 980000, color: "oklch(0.40 0.10 162)" },
  { name: "Technology & IT", value: 740000, color: "oklch(0.78 0.15 85)" },
  { name: "Compliance & Legal", value: 420000, color: "oklch(0.55 0.08 200)" },
];

export const topProducts = [
  { name: "Berbere Spice 500g", sales: 1840, revenue: 552000, change: 18.2 },
  { name: "Ethiopian Coffee Yirgacheffe", sales: 1520, revenue: 912000, change: 24.5 },
  { name: "Injera Flour 5kg", sales: 1240, revenue: 372000, change: -3.2 },
  { name: "Tella Traditional Brew", sales: 980, revenue: 196000, change: 12.1 },
  { name: "Hand-woven Gabi", sales: 320, revenue: 480000, change: 8.7 },
];

export const recentTransactions = [
  { id: "TXN-2841", type: "received", party: "Selam Trading PLC", amount: 184000, date: "2026-07-03", method: "Dashen Bank", status: "completed" },
  { id: "TXN-2840", type: "sent", party: "Mekdim Suppliers", amount: 92000, date: "2026-07-03", method: "CBE", status: "completed" },
  { id: "TXN-2839", type: "received", party: "Bekele Retail Store", amount: 47200, date: "2026-07-02", method: "Telebirr", status: "completed" },
  { id: "TXN-2838", type: "received", party: "Hidase Construction", amount: 312000, date: "2026-07-02", method: "Awash Bank", status: "completed" },
  { id: "TXN-2837", type: "sent", party: "Ethio Telecom", amount: 18400, date: "2026-07-01", method: "Amole", status: "completed" },
  { id: "TXN-2836", type: "received", party: "Yenus Market", amount: 68500, date: "2026-07-01", method: "Telebirr", status: "completed" },
];

export const salesByRegion = [
  { region: "Addis Ababa", sales: 9200000, percentage: 49.9 },
  { region: "Dire Dawa", sales: 2840000, percentage: 15.4 },
  { region: "Amhara", sales: 2480000, percentage: 13.4 },
  { region: "Oromia", sales: 2120000, percentage: 11.5 },
  { region: "SNNPR", sales: 1240000, percentage: 6.7 },
  { region: "Tigray", sales: 570000, percentage: 3.1 },
];

export const inventoryAlerts = [
  { product: "Berbere Spice 500g", current: 42, threshold: 50, warehouse: "Addis Ababa", severity: "warning" },
  { product: "Yirgacheffe Coffee 1kg", current: 18, threshold: 30, warehouse: "Addis Ababa", severity: "critical" },
  { product: "Injera Flour 5kg", current: 8, threshold: 25, warehouse: "Bahir Dar", severity: "critical" },
  { product: "Teff Grain 25kg", current: 120, threshold: 100, warehouse: "Hawassa", severity: "ok" },
  { product: "Gabi Traditional Cloth", current: 24, threshold: 30, warehouse: "Dire Dawa", severity: "warning" },
];

export const upcomingTaxDeadlines = [
  { type: "Monthly VAT Return", dueDate: "2026-07-25", amount: 276750, status: "pending" },
  { type: "Withholding Tax", dueDate: "2026-07-15", amount: 92400, status: "pending" },
  { type: "Pension Contribution", dueDate: "2026-07-10", amount: 476000, status: "pending" },
  { type: "Turnover Tax Q2", dueDate: "2026-07-31", amount: 184000, status: "pending" },
  { type: "Business Income Tax", dueDate: "2026-07-15", amount: 1296000, status: "overdue" },
];

// Finance module data
export const bankAccounts = [
  { bank: "Dashen Bank", account: "DASH-5021-8842", balance: 4840000, currency: "ETB", color: "oklch(0.52 0.14 162)" },
  { bank: "Commercial Bank of Ethiopia", account: "CBE-3329-1174", balance: 6280000, currency: "ETB", color: "oklch(0.40 0.10 162)" },
  { bank: "Awash Bank", account: "AWASH-7741-2208", balance: 2920000, currency: "ETB", color: "oklch(0.72 0.13 75)" },
  { bank: "Telebirr", account: "TB-+251911442880", balance: 184000, currency: "ETB", color: "oklch(0.60 0.10 35)" },
  { bank: "Amole", account: "AMO-882194", balance: 92000, currency: "ETB", color: "oklch(0.78 0.15 85)" },
];

export const chartOfAccounts = [
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

// Inventory module data
export const products = [
  { id: "P-001", name: "Berbere Spice 500g", sku: "BS-500", category: "Spices", quantity: 248, unitPrice: 300, warehouse: "Addis Ababa", status: "inStock", reorderLevel: 50 },
  { id: "P-002", name: "Yirgacheffe Coffee 1kg", sku: "YC-1KG", category: "Coffee", quantity: 18, unitPrice: 600, warehouse: "Addis Ababa", status: "lowStock", reorderLevel: 30 },
  { id: "P-003", name: "Injera Flour 5kg", sku: "IF-5KG", category: "Grains", quantity: 8, unitPrice: 300, warehouse: "Bahir Dar", status: "outOfStock", reorderLevel: 25 },
  { id: "P-004", name: "Teff Grain 25kg", sku: "TG-25KG", category: "Grains", quantity: 120, unitPrice: 1800, warehouse: "Hawassa", status: "inStock", reorderLevel: 100 },
  { id: "P-005", name: "Hand-woven Gabi", sku: "HW-GABI", category: "Textiles", quantity: 24, unitPrice: 1500, warehouse: "Dire Dawa", status: "lowStock", reorderLevel: 30 },
  { id: "P-006", name: "Ethiopian Honey 1kg", sku: "EH-1KG", category: "Natural", quantity: 84, unitPrice: 450, warehouse: "Addis Ababa", status: "inStock", reorderLevel: 40 },
  { id: "P-007", name: "Kolo Mixed Snack 500g", sku: "KS-500", category: "Snacks", quantity: 320, unitPrice: 180, warehouse: "Addis Ababa", status: "inStock", reorderLevel: 100 },
  { id: "P-008", name: "Tella Traditional Brew 1L", sku: "TB-1L", category: "Beverages", quantity: 980, unitPrice: 200, warehouse: "Bahir Dar", status: "inStock", reorderLevel: 200 },
  { id: "P-009", name: "Shiro Powder 1kg", sku: "SP-1KG", category: "Spices", quantity: 12, unitPrice: 380, warehouse: "Addis Ababa", status: "lowStock", reorderLevel: 50 },
  { id: "P-010", name: "Sesame Seeds 5kg", sku: "SS-5KG", category: "Seeds", quantity: 0, unitPrice: 950, warehouse: "Dire Dawa", status: "outOfStock", reorderLevel: 30 },
];

export const warehouses = [
  { id: "W-01", name: "Addis Ababa Warehouse", location: "Addis Ababa, Akaki Kality", capacity: 85, products: 1248, value: 3280000 },
  { id: "W-02", name: "Dire Dawa Warehouse", location: "Dire Dawa, Keble 09", capacity: 62, products: 842, value: 1840000 },
  { id: "W-03", name: "Bahir Dar Warehouse", location: "Bahir Dar, Amhara", capacity: 74, products: 684, value: 920000 },
  { id: "W-04", name: "Hawassa Warehouse", location: "Hawassa, SNNPR", capacity: 48, products: 420, value: 580000 },
];

export const suppliers = [
  { id: "S-001", name: "Mekdim Suppliers PLC", contact: "+251 911 234 567", email: "info@mekdim.et", products: 24, leadTime: 5, rating: 4.7 },
  { id: "S-002", name: "Selam Trading Enterprise", contact: "+251 911 345 678", email: "sales@selam.et", products: 18, leadTime: 7, rating: 4.5 },
  { id: "S-003", name: "Yenus Agricultural Coop", contact: "+251 911 456 789", email: "contact@yenus.et", products: 32, leadTime: 4, rating: 4.8 },
  { id: "S-004", name: "Bekele Textiles", contact: "+251 911 567 890", email: "info@bekele.et", products: 12, leadTime: 10, rating: 4.3 },
  { id: "S-005", name: "Hidase Logistics", contact: "+251 911 678 901", email: "ops@hidase.et", products: 8, leadTime: 3, rating: 4.6 },
];

// HR module data
export const employees = [
  { id: "E-001", name: "Abebe Bekele", position: "Finance Manager", department: "finance", salary: 42000, joinDate: "2021-03-15", status: "active", email: "abebe.b@addiserp.et" },
  { id: "E-002", name: "Sara Tadesse", position: "HR Specialist", department: "hr", salary: 28000, joinDate: "2022-07-01", status: "active", email: "sara.t@addiserp.et" },
  { id: "E-003", name: "Yohannes Girma", position: "Inventory Supervisor", department: "operations", salary: 32000, joinDate: "2020-11-20", status: "active", email: "yohannes.g@addiserp.et" },
  { id: "E-004", name: "Hanna Mengistu", position: "Sales Representative", department: "sales", salary: 24000, joinDate: "2023-02-10", status: "active", email: "hanna.m@addiserp.et" },
  { id: "E-005", name: "Daniel Kebede", position: "IT Support", department: "it", salary: 30000, joinDate: "2022-09-05", status: "active", email: "daniel.k@addiserp.et" },
  { id: "E-006", name: "Meseret Lemma", position: "Accountant", department: "finance", salary: 26000, joinDate: "2021-12-01", status: "leave", email: "meseret.l@addiserp.et" },
  { id: "E-007", name: "Rahel Alemu", position: "Sales Lead", department: "sales", salary: 36000, joinDate: "2020-05-18", status: "active", email: "rahel.a@addiserp.et" },
  { id: "E-008", name: "Tewodros Assefa", position: "Operations Manager", department: "operations", salary: 48000, joinDate: "2019-08-22", status: "active", email: "tewodros.a@addiserp.et" },
  { id: "E-009", name: "Bethel Solomon", position: "Marketing Specialist", department: "sales", salary: 28000, joinDate: "2023-04-12", status: "active", email: "bethel.s@addiserp.et" },
  { id: "E-010", name: "Nahom Tesfaye", position: "Admin Assistant", department: "admin", salary: 22000, joinDate: "2022-10-30", status: "active", email: "nahom.t@addiserp.et" },
];

export const payrollSummary = {
  totalGross: 4180000,
  totalPension: 292600,
  totalIncomeTax: 836000,
  totalNet: 3051400,
  employeeCount: 142,
  period: "June 2026",
};

export const attendanceToday = {
  present: 128,
  onLeave: 9,
  absent: 5,
  remote: 12,
};

// Sales & CRM data
export const customers = [
  { id: "C-001", name: "Selam Trading PLC", contact: "+251 911 234 567", email: "purchase@selamtrading.et", totalOrders: 184, lifetimeValue: 2840000, status: "vip" },
  { id: "C-002", name: "Bekele Retail Store", contact: "+251 911 345 678", email: "bekele.retail@gmail.com", totalOrders: 142, lifetimeValue: 980000, status: "active" },
  { id: "C-003", name: "Hidase Construction", contact: "+251 911 456 789", email: "procurement@hidase.et", totalOrders: 96, lifetimeValue: 4200000, status: "vip" },
  { id: "C-004", name: "Yenus Market", contact: "+251 911 567 890", email: "yenus.market@gmail.com", totalOrders: 78, lifetimeValue: 412000, status: "active" },
  { id: "C-005", name: "Merkato Distributors", contact: "+251 911 678 901", email: "info@merkato.et", totalOrders: 64, lifetimeValue: 1840000, status: "active" },
  { id: "C-006", name: "Piazza Food Mart", contact: "+251 911 789 012", email: "piazza.food@gmail.com", totalOrders: 52, lifetimeValue: 268000, status: "active" },
  { id: "C-007", name: "Bole Mini Market", contact: "+251 911 890 123", email: "bole.mini@gmail.com", totalOrders: 42, lifetimeValue: 198000, status: "regular" },
  { id: "C-008", name: "Sarbet Wholesale", contact: "+251 911 901 234", email: "sarbet.wholesale@gmail.com", totalOrders: 38, lifetimeValue: 412000, status: "regular" },
];

export const salesPipeline = [
  { stage: "lead", count: 24, value: 1840000 },
  { stage: "qualified", count: 18, value: 2760000 },
  { stage: "proposal", count: 12, value: 4200000 },
  { stage: "negotiation", count: 8, value: 3840000 },
  { stage: "won", count: 14, value: 9240000 },
  { stage: "lost", count: 6, value: 920000 },
];

export const quotations = [
  { id: "Q-2026-084", customer: "Selam Trading PLC", date: "2026-07-02", amount: 184000, status: "sent", validUntil: "2026-07-16" },
  { id: "Q-2026-083", customer: "Hidase Construction", date: "2026-07-01", amount: 420000, status: "accepted", validUntil: "2026-07-15" },
  { id: "Q-2026-082", customer: "Merkato Distributors", date: "2026-06-30", amount: 92000, status: "pending", validUntil: "2026-07-14" },
  { id: "Q-2026-081", customer: "Bole Mini Market", date: "2026-06-29", amount: 48000, status: "expired", validUntil: "2026-07-13" },
  { id: "Q-2026-080", customer: "Bekele Retail Store", date: "2026-06-28", amount: 124000, status: "accepted", validUntil: "2026-07-12" },
];

// Compliance data
export const taxRules = [
  { name: "VAT (Value Added Tax)", rate: "15%", description: "Standard rate for taxable goods and services", threshold: "500,000 ETB annual turnover" },
  { name: "Turnover Tax", rate: "2%", description: "For businesses not registered for VAT", threshold: "100,000 ETB annual turnover" },
  { name: "Withholding Tax (Payment)", rate: "2%", description: "On payments to suppliers", threshold: "All taxable payments" },
  { name: "Withholding Tax (Import)", rate: "3%", description: "On import payments", threshold: "All imports" },
  { name: "Business Income Tax", rate: "30%", description: "Corporate income tax", threshold: "All registered companies" },
  { name: "Pension Contribution (Employer)", rate: "11%", description: "Social security contribution", threshold: "All employees" },
  { name: "Pension Contribution (Employee)", rate: "7%", description: "Social security contribution", threshold: "All employees" },
  { name: "Excise Tax", rate: "Variable", description: "On specific goods (alcohol, tobacco, fuel)", threshold: "Specific products" },
];

export const auditLogs = [
  { user: "Abebe Bekele", action: "Approved invoice INV-2026-084", entity: "Finance", timestamp: "2026-07-03 14:32:18", ip: "196.188.44.22" },
  { user: "Sara Tadesse", action: "Updated employee record E-004", entity: "HR", timestamp: "2026-07-03 13:18:42", ip: "196.188.44.22" },
  { user: "Yohannes Girma", action: "Adjusted inventory for P-003", entity: "Inventory", timestamp: "2026-07-03 11:24:09", ip: "196.188.44.30" },
  { user: "Rahel Alemu", action: "Generated VAT return for June 2026", entity: "Compliance", timestamp: "2026-07-03 09:48:55", ip: "196.188.44.22" },
  { user: "Tewodros Assefa", action: "Modified supplier S-002 contact", entity: "Inventory", timestamp: "2026-07-02 17:12:38", ip: "196.188.44.30" },
  { user: "Hanna Mengistu", action: "Created quotation Q-2026-084", entity: "Sales", timestamp: "2026-07-02 15:42:11", ip: "196.188.44.18" },
  { user: "Daniel Kebede", action: "Changed user permissions for E-010", entity: "Admin", timestamp: "2026-07-02 14:08:24", ip: "196.188.44.30" },
  { user: "Abebe Bekele", action: "Bank reconciliation for Dashen Bank", entity: "Finance", timestamp: "2026-07-02 11:34:52", ip: "196.188.44.22" },
];

// Admin data
export const systemUsers = [
  { id: "U-001", name: "Abebe Bekele", email: "abebe.b@addiserp.et", role: "admin", lastActive: "2 min ago", status: "online" },
  { id: "U-002", name: "Sara Tadesse", email: "sara.t@addiserp.et", role: "manager", lastActive: "15 min ago", status: "online" },
  { id: "U-003", name: "Yohannes Girma", email: "yohannes.g@addiserp.et", role: "manager", lastActive: "1 hour ago", status: "away" },
  { id: "U-004", name: "Hanna Mengistu", email: "hanna.m@addiserp.et", role: "staff", lastActive: "3 hours ago", status: "offline" },
  { id: "U-005", name: "Daniel Kebede", email: "daniel.k@addiserp.et", role: "admin", lastActive: "Yesterday", status: "offline" },
  { id: "U-006", name: "Rahel Alemu", email: "rahel.a@addiserp.et", role: "manager", lastActive: "5 min ago", status: "online" },
  { id: "U-007", name: "Tewodros Assefa", email: "tewodros.a@addiserp.et", role: "admin", lastActive: "30 min ago", status: "online" },
  { id: "U-008", name: "Bethel Solomon", email: "bethel.s@addiserp.et", role: "staff", lastActive: "2 hours ago", status: "away" },
];

export const organizationInfo = {
  name: "Addis Trading Enterprise",
  tin: "0009847263",
  vatNumber: "0009847263",
  address: "Bole Road, Friendship Building, Addis Ababa, Ethiopia",
  currency: "ETB (Ethiopian Birr)",
  timezone: "Africa/Addis_Ababa (UTC+3)",
  language: "English (Default) + Amharic",
  fiscalYearStart: "July 7 (Ethiopian New Year)",
};

export const integrations = [
  { name: "Dashen Bank API", type: "Banking", status: "connected", lastSync: "2 min ago" },
  { name: "Commercial Bank of Ethiopia", type: "Banking", status: "connected", lastSync: "5 min ago" },
  { name: "Awash Bank", type: "Banking", status: "connected", lastSync: "12 min ago" },
  { name: "Telebirr", type: "Mobile Money", status: "connected", lastSync: "1 min ago" },
  { name: "Amole", type: "Mobile Money", status: "connected", lastSync: "8 min ago" },
  { name: "ERCA e-Filing", type: "Government", status: "connected", lastSync: "1 hour ago" },
  { name: "Ethio Post", type: "Logistics", status: "pending", lastSync: "Never" },
  { name: "Ethio Telecom SMS", type: "Communication", status: "connected", lastSync: "30 min ago" },
];

// Cash flow data
export const cashFlow = [
  { month: "Jul", inflow: 1840000, outflow: 980000 },
  { month: "Aug", inflow: 1920000, outflow: 1120000 },
  { month: "Sep", inflow: 2080000, outflow: 1180000 },
  { month: "Oct", inflow: 1840000, outflow: 1080000 },
  { month: "Nov", inflow: 2240000, outflow: 1240000 },
  { month: "Dec", inflow: 2480000, outflow: 1380000 },
  { month: "Jan", inflow: 2180000, outflow: 1280000 },
  { month: "Feb", inflow: 2380000, outflow: 1340000 },
  { month: "Mar", inflow: 2120000, outflow: 1180000 },
  { month: "Apr", inflow: 2520000, outflow: 1420000 },
  { month: "May", inflow: 2640000, outflow: 1480000 },
  { month: "Jun", inflow: 2780000, outflow: 1540000 },
];
