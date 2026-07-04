import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/compliance/tax-filings
export async function GET() {
  try {
    const filings = await db.taxFiling.findMany({ orderBy: { dueDate: "asc" } });
    return NextResponse.json(filings);
  } catch (error) {
    console.error("GET /api/compliance/tax-filings error:", error);
    return NextResponse.json({ error: "Failed to fetch tax filings" }, { status: 500 });
  }
}

// PATCH /api/compliance/tax-filings — mark as filed
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const filing = await db.taxFiling.update({
      where: { id },
      data: {
        status: "filed",
        filedDate: new Date(),
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Filed tax: ${filing.type} for ${filing.period}`,
        entity: "Compliance",
        entityId: filing.id,
        details: `Amount: ${filing.amount} ETB`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(filing);
  } catch (error) {
    console.error("PATCH /api/compliance/tax-filings error:", error);
    return NextResponse.json({ error: "Failed to update tax filing" }, { status: 500 });
  }
}
