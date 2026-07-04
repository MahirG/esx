import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/sales/quotations/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quote = await db.quotation.findUnique({ where: { id } });
    if (!quote) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

    await db.quotationItem.deleteMany({ where: { quotationId: id } });
    await db.quotation.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userName: "Hanna Mengistu",
        action: `Deleted quotation ${quote.quoteNo}`,
        entity: "Sales",
        entityId: id,
        ipAddress: "196.188.44.18",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE quotation error:", error);
    return NextResponse.json({ error: "Failed to delete quotation" }, { status: 500 });
  }
}

// PATCH /api/sales/quotations/[id] — update status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const quote = await db.quotation.update({
      where: { id },
      data: { status },
      include: { customer: true, items: { include: { product: true } } },
    });

    await db.auditLog.create({
      data: {
        userName: "Rahel Alemu",
        action: `Updated quotation ${quote.quoteNo} to ${status}`,
        entity: "Sales",
        entityId: id,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json(quote);
  } catch (error) {
    console.error("PATCH quotation error:", error);
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 });
  }
}
