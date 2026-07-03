import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/compliance/audit-logs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entity = searchParams.get("entity");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (entity && entity !== "all") {
      where.entity = entity;
    }

    const logs = await db.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/compliance/audit-logs error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
