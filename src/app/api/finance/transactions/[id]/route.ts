import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/finance/transactions/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const txn = await db.transaction.findUnique({ where: { id } });
    if (!txn) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    // Reverse bank balance update
    if (txn.bankAccountId) {
      const bank = await db.bankAccount.findUnique({ where: { id: txn.bankAccountId } });
      if (bank) {
        const newBalance = txn.type === "received"
          ? bank.balance - txn.amount
          : bank.balance + txn.amount;
        await db.bankAccount.update({ where: { id: bank.id }, data: { balance: newBalance } });
      }
    }

    await db.transaction.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Deleted transaction ${txn.txnId}`,
        entity: "Finance",
        entityId: id,
        details: `${txn.type} ${txn.amount} ETB ${txn.party}`,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE transaction error:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
