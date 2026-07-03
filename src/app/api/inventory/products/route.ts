import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/inventory/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { category: { contains: search } },
      ];
    }
    if (category && category !== "all") {
      where.category = category;
    }

    const products = await db.product.findMany({
      where,
      include: { warehouse: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/inventory/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/inventory/products
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sku, name, category, quantity, unitPrice, costPrice, reorderLevel, warehouseId, barcode } = body;

    const existing = await db.product.findUnique({ where: { sku } });
    if (existing) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
    }

    const qty = parseInt(quantity) || 0;
    const reorder = parseInt(reorderLevel) || 10;
    const status = qty === 0 ? "outOfStock" : qty <= reorder ? "lowStock" : "inStock";

    const product = await db.product.create({
      data: {
        sku,
        name,
        category,
        quantity: qty,
        unitPrice: parseFloat(unitPrice),
        costPrice: parseFloat(costPrice) || 0,
        reorderLevel: reorder,
        warehouseId,
        barcode,
        status,
      },
      include: { warehouse: true },
    });

    // Create stock movement if initial quantity > 0
    if (qty > 0) {
      await db.stockMovement.create({
        data: {
          productId: product.id,
          warehouseId,
          type: "StockIn",
          quantity: qty,
          reference: "Initial stock",
        },
      });
    }

    await db.auditLog.create({
      data: {
        userName: "Yohannes Girma",
        action: `Added product ${sku} - ${name}`,
        entity: "Inventory",
        entityId: product.id,
        details: `${qty} units at ${unitPrice} ETB`,
        ipAddress: "196.188.44.30",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
