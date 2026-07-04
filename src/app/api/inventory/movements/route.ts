import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/inventory/movements
export async function GET() {
  try {
    const movements = await db.stockMovement.findMany({
      include: { product: true, warehouse: true },
      orderBy: { date: "desc" },
      take: 50,
    });
    return NextResponse.json(movements);
  } catch (error) {
    console.error("GET /api/inventory/movements error:", error);
    return NextResponse.json({ error: "Failed to fetch stock movements" }, { status: 500 });
  }
}

// POST /api/inventory/movements — adjust stock
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, type, quantity, reference, notes, warehouseId } = body;

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      return NextResponse.json({ error: "Quantity must be positive" }, { status: 400 });
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      include: { warehouse: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calculate new quantity
    let newQty = product.quantity;
    if (type === "StockIn") {
      newQty = product.quantity + qty;
    } else if (type === "StockOut") {
      newQty = Math.max(0, product.quantity - qty);
    } else if (type === "Transfer") {
      // Transfers don't change total but log movement
      newQty = product.quantity;
    }

    // Update product status
    const status = newQty === 0 ? "outOfStock" : newQty <= product.reorderLevel ? "lowStock" : "inStock";

    const movement = await db.stockMovement.create({
      data: {
        productId,
        warehouseId: warehouseId || product.warehouseId,
        type,
        quantity: qty,
        reference,
        notes,
      },
      include: { product: true, warehouse: true },
    });

    await db.product.update({
      where: { id: productId },
      data: { quantity: newQty, status },
    });

    await db.auditLog.create({
      data: {
        userName: "Yohannes Girma",
        action: `${type} for ${product.sku} - ${product.name}`,
        entity: "Inventory",
        entityId: product.id,
        details: `${qty} units. ${reference || ""}`,
        ipAddress: "196.188.44.30",
      },
    });

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory/movements error:", error);
    return NextResponse.json({ error: "Failed to create stock movement" }, { status: 500 });
  }
}
