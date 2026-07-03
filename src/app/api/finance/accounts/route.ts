import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/finance/accounts
export async function GET() {
  try {
    const accounts = await db.account.findMany({ orderBy: { code: "asc" } });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("GET /api/finance/accounts error:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

// POST /api/finance/accounts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, name, type, balance } = body;

    const existing = await db.account.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Account code already exists" }, { status: 400 });
    }

    const account = await db.account.create({
      data: {
        code,
        name,
        type,
        balance: parseFloat(balance) || 0,
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Created account ${code} - ${name}`,
        entity: "Finance",
        entityId: account.id,
        details: `Type: ${type}, Balance: ${balance} ETB`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("POST /api/finance/accounts error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
