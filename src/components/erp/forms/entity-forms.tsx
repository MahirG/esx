"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormModal } from "@/components/erp/ui/form-modal";
import {
  useCreateTransaction,
  useCreateAccount,
  useCreateBank,
  useCreateProduct,
  useWarehouses,
  useCreateSupplier,
  useCreateMovement,
  useCreateEmployee,
  useCreateCustomer,
  useCreateQuotation,
  useCustomers,
  useProducts,
  useCreateDeal,
  useCreateUser,
} from "@/lib/api-hooks";

// ============================================================
// Transaction Form
// ============================================================
export function TransactionForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateTransaction();
  const [type, setType] = useState("received");
  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Dashen Bank");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!party || !amount) return;
    create.mutate(
      { type, party, amount, method, description },
      { onSuccess: () => { onClose(); reset(); } }
    );
  };

  const reset = () => {
    setParty(""); setAmount(""); setDescription("");
  };

  return (
    <FormModal
      open={open}
      onClose={() => { onClose(); reset(); }}
      title="New Transaction"
      description="Record a payment received or sent"
      onSubmit={submit}
      submitLabel="Create Transaction"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="received">Payment Received</SelectItem>
              <SelectItem value="sent">Payment Sent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Party {type === "received" ? "(Customer)" : "(Supplier/Payee)"}</Label>
          <Input value={party} onChange={(e) => setParty(e.target.value)} placeholder="e.g. Selam Trading PLC" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Amount (ETB)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Dashen Bank">Dashen Bank</SelectItem>
                <SelectItem value="Commercial Bank of Ethiopia">CBE</SelectItem>
                <SelectItem value="Awash Bank">Awash Bank</SelectItem>
                <SelectItem value="Telebirr">Telebirr</SelectItem>
                <SelectItem value="Amole">Amole</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description (Optional)</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Transaction notes..." rows={2} />
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Account Form
// ============================================================
export function AccountForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateAccount();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Asset");
  const [balance, setBalance] = useState("0");

  const submit = () => {
    if (!code || !name) return;
    create.mutate(
      { code, name, type, balance },
      { onSuccess: () => { onClose(); setCode(""); setName(""); setBalance("0"); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="New Account"
      description="Add to chart of accounts"
      onSubmit={submit}
      submitLabel="Create Account"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Account Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. 1100" />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Liability">Liability</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
                <SelectItem value="Revenue">Revenue</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Account Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Petty Cash" />
        </div>
        <div className="space-y-2">
          <Label>Opening Balance (ETB)</Label>
          <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Bank Account Form
// ============================================================
export function BankForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateBank();
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [balance, setBalance] = useState("0");

  const submit = () => {
    if (!bankName || !accountNo) return;
    create.mutate(
      { bankName, accountNo, balance },
      { onSuccess: () => { onClose(); setBankName(""); setAccountNo(""); setBalance("0"); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Add Bank Account"
      description="Connect a new bank or payment method"
      onSubmit={submit}
      submitLabel="Add Account"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Bank / Provider Name</Label>
          <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Dashen Bank" />
        </div>
        <div className="space-y-2">
          <Label>Account Number</Label>
          <Input value={accountNo} onChange={(e) => setAccountNo(e.target.value)} placeholder="e.g. DASH-1234-5678" />
        </div>
        <div className="space-y-2">
          <Label>Opening Balance (ETB)</Label>
          <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Product Form
// ============================================================
export function ProductForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateProduct();
  const { data: warehouses } = useWarehouses();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Spices");
  const [quantity, setQuantity] = useState("0");
  const [unitPrice, setUnitPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [reorderLevel, setReorderLevel] = useState("10");
  const [warehouseId, setWarehouseId] = useState("");

  const submit = () => {
    if (!sku || !name || !unitPrice || !warehouseId) return;
    create.mutate(
      { sku, name, category, quantity, unitPrice, costPrice, reorderLevel, warehouseId },
      { onSuccess: () => { onClose(); reset(); } }
    );
  };

  const reset = () => {
    setSku(""); setName(""); setUnitPrice(""); setCostPrice(""); setQuantity("0"); setReorderLevel("10");
  };

  return (
    <FormModal
      open={open}
      onClose={() => { onClose(); reset(); }}
      title="Add Product"
      description="Create a new inventory item"
      onSubmit={submit}
      submitLabel="Add Product"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} placeholder="e.g. BS-500" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Spices">Spices</SelectItem>
                <SelectItem value="Coffee">Coffee</SelectItem>
                <SelectItem value="Grains">Grains</SelectItem>
                <SelectItem value="Textiles">Textiles</SelectItem>
                <SelectItem value="Natural">Natural</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
                <SelectItem value="Beverages">Beverages</SelectItem>
                <SelectItem value="Seeds">Seeds</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Berbere Spice 500g" />
        </div>
        <div className="space-y-2">
          <Label>Warehouse</Label>
          <Select value={warehouseId} onValueChange={setWarehouseId}>
            <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
            <SelectContent>
              {warehouses?.map((w: { id: string; name: string }) => (
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Reorder Level</Label>
            <Input type="number" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Unit Price (ETB)</Label>
            <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>Cost Price (ETB)</Label>
            <Input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="0.00" />
          </div>
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Stock Adjustment Form
// ============================================================
export function StockAdjustmentForm({ open, onClose, productId, productName }: { open: boolean; onClose: () => void; productId?: string; productName?: string }) {
  const create = useCreateMovement();
  const [type, setType] = useState("StockIn");
  const [quantity, setQuantity] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!productId || !quantity) return;
    create.mutate(
      { productId, type, quantity, reference, notes },
      { onSuccess: () => { onClose(); setQuantity(""); setReference(""); setNotes(""); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Adjust Stock"
      description={productName ? `Adjusting: ${productName}` : undefined}
      onSubmit={submit}
      submitLabel="Adjust Stock"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Movement Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="StockIn">Stock In (Receive)</SelectItem>
              <SelectItem value="StockOut">Stock Out (Issue)</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Reference (From/To)</Label>
          <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. Mekdim Suppliers" />
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional notes..." />
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Supplier Form
// ============================================================
export function SupplierForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateSupplier();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [leadTime, setLeadTime] = useState("7");
  const [rating, setRating] = useState("4.5");

  const submit = () => {
    if (!name || !contact) return;
    create.mutate(
      { name, contact, email, leadTime, rating },
      { onSuccess: () => { onClose(); setName(""); setContact(""); setEmail(""); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Add Supplier"
      description="Register a new supplier"
      onSubmit={submit}
      submitLabel="Add Supplier"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Supplier Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mekdim Suppliers PLC" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+251 911 ..." />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@supplier.et" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Lead Time (days)</Label>
            <Input type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Rating (1-5)</Label>
            <Input type="number" step="0.1" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Employee Form
// ============================================================
export function EmployeeForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateEmployee();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("finance");
  const [salary, setSalary] = useState("");
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split("T")[0]);

  const submit = () => {
    if (!name || !position || !salary) return;
    create.mutate(
      { name, email, phone, position, department, salary, joinDate },
      { onSuccess: () => { onClose(); setName(""); setEmail(""); setPosition(""); setSalary(""); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Add Employee"
      description="Register a new team member"
      onSubmit={submit}
      submitLabel="Add Employee"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Abebe Bekele" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 911 ..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@addiserp.et" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Position</Label>
            <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Accountant" />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="it">IT & Technology</SelectItem>
                <SelectItem value="admin">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Monthly Salary (ETB)</Label>
            <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Join Date</Label>
            <Input type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
          </div>
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Customer Form
// ============================================================
export function CustomerForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateCustomer();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("regular");

  const submit = () => {
    if (!name || !contact) return;
    create.mutate(
      { name, contact, email, address, status },
      { onSuccess: () => { onClose(); setName(""); setContact(""); setEmail(""); setAddress(""); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Add Customer"
      description="Register a new customer"
      onSubmit={submit}
      submitLabel="Add Customer"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Selam Trading PLC" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+251 911 ..." />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@example.et" />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Business address..." />
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Quotation Form
// ============================================================
export function QuotationForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateQuotation();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const [customerId, setCustomerId] = useState("");
  const [validDays, setValidDays] = useState("14");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Array<{ productId: string; quantity: string }>>([{ productId: "", quantity: "1" }]);

  const addItem = () => setItems([...items, { productId: "", quantity: "1" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: "productId" | "quantity", value: string) => {
    setItems(items.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  };

  const total = items.reduce((sum, it) => {
    const prod = products?.find((p: { id: string }) => p.id === it.productId);
    return sum + (prod ? prod.unitPrice * (parseInt(it.quantity) || 0) : 0);
  }, 0);
  const vat = Math.round(total * 0.15);
  const grand = total + vat;

  const submit = () => {
    if (!customerId || items.some((i) => !i.productId)) return;
    create.mutate(
      { customerId, items: items.map((i) => ({ productId: i.productId, quantity: parseInt(i.quantity) })), validDays: parseInt(validDays), notes },
      { onSuccess: () => { onClose(); setCustomerId(""); setItems([{ productId: "", quantity: "1" }]); setNotes(""); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="New Quotation"
      description="Create a quote for a customer"
      onSubmit={submit}
      submitLabel="Create Quotation"
      isSubmitting={create.isPending}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {customers?.map((c: { id: string; name: string }) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valid For (days)</Label>
            <Input type="number" value={validDays} onChange={(e) => setValidDays(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>+ Add Item</Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {items.map((item, idx) => {
              const prod = products?.find((p: { id: string }) => p.id === item.productId);
              const lineTotal = prod ? prod.unitPrice * (parseInt(item.quantity) || 0) : 0;
              return (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Select value={item.productId} onValueChange={(v) => updateItem(idx, "productId", v)}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {products?.map((p: { id: string; name: string; sku: string; unitPrice: number }) => (
                          <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku}) - {p.unitPrice} ETB</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    className="w-20"
                    placeholder="Qty"
                  />
                  <div className="w-24 text-right text-sm font-semibold tabular-nums">
                    {lineTotal > 0 ? `${lineTotal.toLocaleString()} ETB` : "—"}
                  </div>
                  {items.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)}>✕</Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal:</span><span className="font-semibold tabular-nums">{total.toLocaleString()} ETB</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">VAT (15%):</span><span className="font-semibold tabular-nums">{vat.toLocaleString()} ETB</span></div>
          <div className="flex justify-between border-t border-border pt-1.5"><span className="font-medium">Total:</span><span className="font-bold text-primary tabular-nums">{grand.toLocaleString()} ETB</span></div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional notes..." />
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// Deal Form
// ============================================================
export function DealForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateDeal();
  const { data: customers } = useCustomers();
  const [customerId, setCustomerId] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("lead");

  const submit = () => {
    if (!customerId || !title || !value) return;
    create.mutate(
      { customerId, title, value, stage },
      { onSuccess: () => { onClose(); setCustomerId(""); setTitle(""); setValue(""); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="New Pipeline Deal"
      description="Add a deal to the sales pipeline"
      onSubmit={submit}
      submitLabel="Add Deal"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Customer</Label>
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
            <SelectContent>
              {customers?.map((c: { id: string; name: string }) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Deal Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual Supply Contract" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Value (ETB)</Label>
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Stage</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </FormModal>
  );
}

// ============================================================
// User Form
// ============================================================
export function UserForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const submit = () => {
    if (!name || !email) return;
    create.mutate(
      { name, email, role, twoFactor, biometric },
      { onSuccess: () => { onClose(); setName(""); setEmail(""); } }
    );
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Add User"
      description="Create a new system user"
      onSubmit={submit}
      submitLabel="Add User"
      isSubmitting={create.isPending}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Abebe Bekele" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@addiserp.et" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg border border-border/60 cursor-pointer">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Require 2FA on login</p>
            </div>
            <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} className="h-4 w-4" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg border border-border/60 cursor-pointer">
            <div>
              <p className="text-sm font-medium">Biometric Login</p>
              <p className="text-xs text-muted-foreground">Enable fingerprint/face</p>
            </div>
            <input type="checkbox" checked={biometric} onChange={(e) => setBiometric(e.target.checked)} className="h-4 w-4" />
          </label>
        </div>
      </div>
    </FormModal>
  );
}
