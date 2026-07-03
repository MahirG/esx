// Type definitions for ERP entities (used by export system)

export interface QuotationItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: { name: string; sku: string };
}

export interface Quotation {
  id: string;
  quoteNo: string;
  customerId: string;
  date: string;
  validUntil: string;
  amount: number;
  vatAmount: number;
  total: number;
  status: string;
  notes?: string | null;
  customer?: { name: string; contact: string; email?: string };
  items?: QuotationItem[];
}

export interface Employee {
  id: string;
  empId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position: string;
  department: string;
  salary: number;
  status: string;
  joinDate: string;
}

export interface Transaction {
  id: string;
  txnId: string;
  type: string;
  party: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  description?: string | null;
  vatAmount?: number | null;
}

export interface TaxFiling {
  id: string;
  type: string;
  period: string;
  amount: number;
  dueDate: string;
  filedDate?: string | null;
  status: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
}

export interface AuditLog {
  id: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  timestamp: string;
}
