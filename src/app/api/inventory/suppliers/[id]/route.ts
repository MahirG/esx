import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/inventory/suppliers/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supplier = await db.supplier.findUnique({ where: { id } });
    if (!supplier) return NextResponse.json({ error: "Supplier not found" }, { status: 404 });

    await db.supplier.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userName: "Tewodros Assefa",
        action: `Deleted supplier ${supplier.name}`,
        entity: "Inventory",
        entityId: id,
        ipAddress: "196.188.44.30",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE supplier error:", error);
    return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
  }
}
