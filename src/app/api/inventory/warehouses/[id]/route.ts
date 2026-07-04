import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/inventory/warehouses/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productsCount = await db.product.count({ where: { warehouseId: id } });
    if (productsCount > 0) {
      return NextResponse.json({ error: `Cannot delete warehouse with ${productsCount} products. Move products first.` }, { status: 400 });
    }

    const warehouse = await db.warehouse.findUnique({ where: { id } });
    if (!warehouse) return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });

    await db.warehouse.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userName: "Tewodros Assefa",
        action: `Deleted warehouse ${warehouse.name}`,
        entity: "Inventory",
        entityId: id,
        ipAddress: "196.188.44.30",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE warehouse error:", error);
    return NextResponse.json({ error: "Failed to delete warehouse" }, { status: 500 });
  }
}
