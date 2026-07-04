import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/finance/banks
export async function GET() {
  try {
    const banks = await db.bankAccount.findMany({ orderBy: { balance: "desc" } });
    return NextResponse.json(banks);
  } catch (error) {
    console.error("GET /api/finance/banks error:", error);
    return NextResponse.json({ error: "Failed to fetch bank accounts" }, { status: 500 });
  }
}

// POST /api/finance/banks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankName, accountNo, balance, color } = body;

    const existing = await db.bankAccount.findUnique({ where: { accountNo } });
    if (existing) {
      return NextResponse.json({ error: "Account number already exists" }, { status: 400 });
    }

    const bank = await db.bankAccount.create({
      data: {
        bankName,
        accountNo,
        balance: parseFloat(balance) || 0,
        color: color || "oklch(0.52 0.14 162)",
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Added bank account ${bankName}`,
        entity: "Finance",
        entityId: bank.id,
        details: `Account: ${accountNo}`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(bank, { status: 201 });
  } catch (error) {
    console.error("POST /api/finance/banks error:", error);
    return NextResponse.json({ error: "Failed to create bank account" }, { status: 500 });
  }
}
