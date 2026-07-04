import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/inventory/warehouses
export async function GET() {
  try {
    const warehouses = await db.warehouse.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });
    // Compute total value per warehouse
    const result = await Promise.all(
      warehouses.map(async (w) => {
        const products = await db.product.findMany({
          where: { warehouseId: w.id },
          select: { quantity: true, unitPrice: true },
        });
        const value = products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
        return { ...w, products: w._count.products, value };
      })
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/inventory/warehouses error:", error);
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 });
  }
}

// POST /api/inventory/warehouses
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, capacity } = body;

    const warehouse = await db.warehouse.create({
      data: { name, location, capacity: parseInt(capacity) || 100 },
    });

    await db.auditLog.create({
      data: {
        userName: "Tewodros Assefa",
        action: `Added warehouse ${name}`,
        entity: "Inventory",
        entityId: warehouse.id,
        details: `Location: ${location}`,
        ipAddress: "196.188.44.30",
      },
    });

    return NextResponse.json(warehouse, { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory/warehouses error:", error);
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 });
  }
}
