"use client";

import { useState } from "react";
import {
  Package,
  Warehouse,
  Truck,
  ScanLine,
  Plus,
  AlertTriangle,
  Boxes,
  MapPin,
  Star,
  Search,
  Filter,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KPICard } from "@/components/erp/ui/kpi-card";
import { ChartCard } from "@/components/erp/ui/chart-card";
import { StatusBadge } from "@/components/erp/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  useProducts,
  useWarehouses,
  useSuppliers,
  useStockMovements,
} from "@/lib/api-hooks";
import { ProductForm, SupplierForm, StockAdjustmentForm } from "@/components/erp/forms/entity-forms";
import { BarcodeScanner } from "@/components/erp/forms/barcode-scanner";
import { exportInventoryHTML, exportProductsCSV } from "@/lib/html-export";
import { formatETB } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { FileDown, FileText } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "oklch(1 0.005 85)",
  border: "1px solid oklch(0.90 0.015 85)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "oklch(0.20 0.02 160)",
};

export function InventoryModule() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [productModal, setProductModal] = useState(false);
  const [supplierModal, setSupplierModal] = useState(false);
  const [adjustModal, setAdjustModal] = useState(false);
  const [scannerModal, setScannerModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | undefined>();

  const { data: products, isLoading: prodLoading } = useProducts(searchQuery);
  const { data: warehouses, isLoading: whLoading } = useWarehouses();
  const { data: suppliers, isLoading: supLoading } = useSuppliers();
  const { data: movements, isLoading: movLoading } = useStockMovements();

  const totalStockValue = products?.reduce((sum: number, p: { quantity: number; unitPrice: number }) => sum + p.quantity * p.unitPrice, 0) || 0;
  const lowStockCount = products?.filter((p: { status: string }) => p.status === "lowStock").length || 0;
  const outOfStockCount = products?.filter((p: { status: string }) => p.status === "outOfStock").length || 0;

  const openAdjust = (product: { id: string; name: string }) => {
    setSelectedProduct(product);
    setAdjustModal(true);
  };

  const warehouseData = warehouses?.map((w: { name: string; products: number; capacity: number; value: number }) => ({
    name: w.name.replace(" Warehouse", ""),
    products: w.products,
    capacity: w.capacity,
    value: w.value,
  })) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Modals */}
      <ProductForm open={productModal} onClose={() => setProductModal(false)} />
      <SupplierForm open={supplierModal} onClose={() => setSupplierModal(false)} />
      <StockAdjustmentForm
        open={adjustModal}
        onClose={() => setAdjustModal(false)}
        productId={selectedProduct?.id}
        productName={selectedProduct?.name}
      />
      <BarcodeScanner open={scannerModal} onClose={() => setScannerModal(false)} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title={t.inventory.totalProducts}
          value={(products?.length || 0).toString()}
          icon={<Package className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
          subtitle={`${products?.reduce((s: number, p: { quantity: number }) => s + p.quantity, 0) || 0} units total`}
        />
        <KPICard
          title={t.inventory.lowStock}
          value={(lowStockCount + outOfStockCount).toString()}
          icon={<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
          subtitle={`${outOfStockCount} out of stock`}
        />
        <KPICard
          title={t.inventory.stockValue}
          value={formatETB(totalStockValue, { compact: true })}
          icon={<Boxes className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
          change={6.2}
        />
        <KPICard
          title={t.inventory.warehouseCount}
          value={(warehouses?.length || 0).toString()}
          icon={<Warehouse className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="terracotta"
          subtitle="Across Ethiopia"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2">{t.inventory.products}</TabsTrigger>
            <TabsTrigger value="warehouses" className="text-xs sm:text-sm py-2">{t.inventory.warehouses}</TabsTrigger>
            <TabsTrigger value="suppliers" className="text-xs sm:text-sm py-2">{t.inventory.suppliers}</TabsTrigger>
            <TabsTrigger value="movements" className="text-xs sm:text-sm py-2">{t.inventory.stockMovements}</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setScannerModal(true)}>
              <ScanLine className="h-4 w-4 mr-1.5" />
              {t.inventory.scanBarcode}
            </Button>
            <Button size="sm" className="gradient-emerald text-white" onClick={() => setProductModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              {t.inventory.addProduct}
            </Button>
          </div>
        </div>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, SKU, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
            </Button>
            {products && products.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => exportInventoryHTML(products as any)}>
                  <FileText className="h-4 w-4 mr-1.5" />HTML
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportProductsCSV(products as any)}>
                  <FileDown className="h-4 w-4 mr-1.5" />CSV
                </Button>
              </>
            )}
          </div>

          <ChartCard title={t.inventory.products} subtitle={`${products?.length || 0} items`}>
            {prodLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t.inventory.productName}</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">SKU</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">{t.inventory.category}</TableHead>
                      <TableHead className="text-xs text-right">{t.inventory.quantity}</TableHead>
                      <TableHead className="text-xs text-right hidden sm:table-cell">{t.inventory.unitPrice}</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">Warehouse</TableHead>
                      <TableHead className="text-xs">{t.inventory.status}</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                          No products found. Add your first product!
                        </TableCell>
                      </TableRow>
                    ) : (
                      products?.map((product: { id: string; name: string; sku: string; category: string; quantity: number; unitPrice: number; status: string; warehouse?: { name: string } }) => (
                        <TableRow key={product.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground sm:hidden">{product.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-mono hidden sm:table-cell">{product.sku}</TableCell>
                          <TableCell className="text-xs hidden md:table-cell text-muted-foreground">{product.category}</TableCell>
                          <TableCell className="text-sm font-semibold text-right tabular-nums">{product.quantity}</TableCell>
                          <TableCell className="text-sm text-right tabular-nums hidden sm:table-cell">{formatETB(product.unitPrice)}</TableCell>
                          <TableCell className="text-xs hidden lg:table-cell text-muted-foreground">{product.warehouse?.name}</TableCell>
                          <TableCell>
                            <StatusBadge status={product.status as "inStock" | "lowStock" | "outOfStock"} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => openAdjust({ id: product.id, name: product.name })}
                            >
                              Adjust
                            </Button>
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

        {/* Warehouses Tab */}
        <TabsContent value="warehouses" className="space-y-4">
          {whLoading ? (
            <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {warehouses?.map((wh: { id: string; name: string; location: string; capacity: number; products: number; value: number }) => (
                  <Card key={wh.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Warehouse className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{wh.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {wh.location}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status="active" label="Active" />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Products</p>
                          <p className="text-lg font-bold">{wh.products}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Capacity</p>
                          <p className="text-lg font-bold">{wh.capacity}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Value</p>
                          <p className="text-lg font-bold">{formatETB(wh.value, { compact: true })}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Capacity Used</span>
                          <span className="font-medium">{wh.capacity}%</span>
                        </div>
                        <Progress value={wh.capacity} className={cn(
                          "h-2",
                          wh.capacity > 80 ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"
                        )} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ChartCard title="Warehouse Capacity" subtitle="Capacity utilization by location">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={warehouseData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.015 85)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 160)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="capacity" radius={[4, 4, 0, 0]} barSize={40}>
                      {warehouseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.capacity > 80 ? "oklch(0.58 0.22 27)" : "oklch(0.52 0.14 162)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <div className="flex justify-end mb-4">
            <Button size="sm" className="gradient-emerald text-white" onClick={() => setSupplierModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" />Add Supplier
            </Button>
          </div>
          {supLoading ? (
            <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers?.map((supplier: { id: string; name: string; contact: string; email: string; productCount: number; leadTime: number; rating: number }) => (
                <Card key={supplier.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-11 w-11 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        <Star className="h-3 w-3 fill-current" />
                        {supplier.rating}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{supplier.name}</p>
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="font-mono">{supplier.contact}</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{supplier.email}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Products</p>
                        <p className="text-sm font-bold">{supplier.productCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t.inventory.leadTime}</p>
                        <p className="text-sm font-bold">{supplier.leadTime} days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements">
          <ChartCard title={t.inventory.stockMovements} subtitle="Recent stock in/out activity">
            {movLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Product</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Reference</TableHead>
                      <TableHead className="text-xs text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                          No stock movements yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      movements?.map((mov: { id: string; date: string; product: { name: string; sku: string }; type: string; reference: string | null; quantity: number }) => (
                        <TableRow key={mov.id} className="hover:bg-muted/30">
                          <TableCell className="text-xs text-muted-foreground">{new Date(mov.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm font-medium">{mov.product?.name || "—"}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-block text-xs font-medium px-2 py-0.5 rounded-md",
                              mov.type === "StockIn" && "bg-primary/10 text-primary",
                              mov.type === "StockOut" && "bg-destructive/10 text-destructive",
                              mov.type === "Transfer" && "bg-accent/30 text-accent-foreground"
                            )}>
                              {mov.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">{mov.reference || "—"}</TableCell>
                          <TableCell className={cn(
                            "text-sm font-semibold text-right tabular-nums",
                            mov.type === "StockIn" ? "text-primary" : mov.type === "StockOut" ? "text-destructive" : ""
                          )}>
                            {mov.type === "StockIn" ? "+" : mov.type === "StockOut" ? "-" : ""}{mov.quantity}
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
