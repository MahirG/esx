import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/finance/transactions
export async function GET() {
  try {
    const transactions = await db.transaction.findMany({
      include: { bankAccount: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET /api/finance/transactions error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// POST /api/finance/transactions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, party, amount, method, description, vatAmount } = body;

    // Generate txn ID
    const count = await db.transaction.count();
    const txnId = `TXN-${String(count + 2842).padStart(4, "0")}`;

    // Find bank account by method name
    const bankAccount = await db.bankAccount.findFirst({
      where: { bankName: method },
    });

    const transaction = await db.transaction.create({
      data: {
        txnId,
        type,
        party,
        amount: parseFloat(amount),
        method,
        description,
        vatAmount: vatAmount ? parseFloat(vatAmount) : null,
        bankAccountId: bankAccount?.id,
        date: new Date(),
        status: "completed",
      },
      include: { bankAccount: true },
    });

    // Update bank balance
    if (bankAccount) {
      const newBalance = type === "received"
        ? bankAccount.balance + parseFloat(amount)
        : bankAccount.balance - parseFloat(amount);
      await db.bankAccount.update({
        where: { id: bankAccount.id },
        data: { balance: newBalance },
      });
    }

    // Log to audit
    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Created transaction ${txnId}`,
        entity: "Finance",
        entityId: transaction.id,
        details: `${type} ${amount} ETB ${type === "received" ? "from" : "to"} ${party}`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/finance/transactions error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
