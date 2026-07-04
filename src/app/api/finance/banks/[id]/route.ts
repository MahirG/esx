import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/finance/banks/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bank = await db.bankAccount.findUnique({ where: { id } });
    if (!bank) return NextResponse.json({ error: "Bank account not found" }, { status: 404 });

    await db.bankAccount.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Deleted bank account ${bank.bankName}`,
        entity: "Finance",
        entityId: id,
        details: `Account: ${bank.accountNo}`,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE bank error:", error);
    return NextResponse.json({ error: "Failed to delete bank account" }, { status: 500 });
  }
}
