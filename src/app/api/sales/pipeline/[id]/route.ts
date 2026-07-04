import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/sales/pipeline/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deal = await db.pipelineDeal.findUnique({ where: { id } });
    if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

    await db.pipelineDeal.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userName: "Rahel Alemu",
        action: `Deleted pipeline deal ${deal.title}`,
        entity: "Sales",
        entityId: id,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE deal error:", error);
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}
