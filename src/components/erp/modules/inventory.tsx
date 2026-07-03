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
  TrendingUp,
  Search,
  Filter,
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
import { products, warehouses, suppliers } from "@/lib/mock-data";
import { formatETB } from "@/lib/currency";
import { cn } from "@/lib/utils";

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

  const totalStockValue = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
  const lowStockCount = products.filter((p) => p.status === "lowStock").length;
  const outOfStockCount = products.filter((p) => p.status === "outOfStock").length;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const warehouseData = warehouses.map((w) => ({
    name: w.name.replace(" Warehouse", ""),
    products: w.products,
    capacity: w.capacity,
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title={t.inventory.totalProducts}
          value={products.length.toString()}
          icon={<Package className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
          subtitle={`${products.reduce((s, p) => s + p.quantity, 0)} units total`}
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
          value={warehouses.length.toString()}
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
            <Button variant="outline" size="sm">
              <ScanLine className="h-4 w-4 mr-1.5" />
              {t.inventory.scanBarcode}
            </Button>
            <Button size="sm" className="gradient-emerald text-white">
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
          </div>

          <ChartCard title={t.inventory.products} subtitle={`${filteredProducts.length} items`}>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
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
                      <TableCell className="text-xs hidden lg:table-cell text-muted-foreground">{product.warehouse}</TableCell>
                      <TableCell>
                        <StatusBadge status={product.status as "inStock" | "lowStock" | "outOfStock"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </TabsContent>

        {/* Warehouses Tab */}
        <TabsContent value="warehouses" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warehouses.map((wh) => (
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
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
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
                      <p className="text-sm font-bold">{supplier.products}</p>
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
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements">
          <ChartCard title={t.inventory.stockMovements} subtitle="Recent stock in/out activity">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Product</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">From/To</TableHead>
                    <TableHead className="text-xs text-right">Quantity</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "2026-07-03", product: "Yirgacheffe Coffee 1kg", type: "Stock In", from: "Yenus Agricultural Coop", qty: 50, status: "completed" },
                    { date: "2026-07-03", product: "Berbere Spice 500g", type: "Stock Out", from: "Selam Trading PLC", qty: 24, status: "completed" },
                    { date: "2026-07-02", product: "Injera Flour 5kg", type: "Stock Out", from: "Bekele Retail Store", qty: 18, status: "completed" },
                    { date: "2026-07-02", product: "Teff Grain 25kg", type: "Stock In", from: "Mekdim Suppliers PLC", qty: 80, status: "completed" },
                    { date: "2026-07-01", product: "Hand-woven Gabi", type: "Transfer", from: "Addis Ababa → Dire Dawa", qty: 12, status: "completed" },
                    { date: "2026-07-01", product: "Ethiopian Honey 1kg", type: "Stock Out", from: "Hidase Construction", qty: 32, status: "completed" },
                  ].map((mov, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30">
                      <TableCell className="text-xs text-muted-foreground">{mov.date}</TableCell>
                      <TableCell className="text-sm font-medium">{mov.product}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-block text-xs font-medium px-2 py-0.5 rounded-md",
                          mov.type === "Stock In" && "bg-primary/10 text-primary",
                          mov.type === "Stock Out" && "bg-destructive/10 text-destructive",
                          mov.type === "Transfer" && "bg-accent/30 text-accent-foreground"
                        )}>
                          {mov.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">{mov.from}</TableCell>
                      <TableCell className={cn(
                        "text-sm font-semibold text-right tabular-nums",
                        mov.type === "Stock In" ? "text-primary" : mov.type === "Stock Out" ? "text-destructive" : ""
                      )}>
                        {mov.type === "Stock In" ? "+" : mov.type === "Stock Out" ? "-" : ""}{mov.qty}
                      </TableCell>
                      <TableCell><StatusBadge status={mov.status as "completed"} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
