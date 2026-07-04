import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/inventory/products/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await db.stockMovement.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userName: "Yohannes Girma",
        action: `Deleted product ${product.sku} - ${product.name}`,
        entity: "Inventory",
        entityId: id,
        ipAddress: "196.188.44.30",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

// PATCH /api/inventory/products/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, category, unitPrice, costPrice, reorderLevel, quantity } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (unitPrice !== undefined) updateData.unitPrice = parseFloat(unitPrice);
    if (costPrice !== undefined) updateData.costPrice = parseFloat(costPrice);
    if (reorderLevel !== undefined) updateData.reorderLevel = parseInt(reorderLevel);
    if (quantity !== undefined) {
      const qty = parseInt(quantity);
      updateData.quantity = qty;
      updateData.status = qty === 0 ? "outOfStock" : qty <= (reorderLevel ? parseInt(reorderLevel) : 10) ? "lowStock" : "inStock";
    }

    const product = await db.product.update({ where: { id }, data: updateData, include: { warehouse: true } });

    await db.auditLog.create({
      data: {
        userName: "Yohannes Girma",
        action: `Updated product ${product.sku}`,
        entity: "Inventory",
        entityId: id,
        ipAddress: "196.188.44.30",
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("PATCH product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
