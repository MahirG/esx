import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/finance/accounts/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const account = await db.account.findUnique({ where: { id } });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    await db.account.delete({ where: { id } });
    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Deleted account ${account.code} - ${account.name}`,
        entity: "Finance",
        entityId: id,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE account error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

// PATCH /api/finance/accounts/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, type, balance } = body;

    const account = await db.account.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(balance !== undefined && { balance: parseFloat(balance) }),
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Updated account ${account.code}`,
        entity: "Finance",
        entityId: id,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json(account);
  } catch (error) {
    console.error("PATCH account error:", error);
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}
