import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/sales/pipeline
export async function GET() {
  try {
    const deals = await db.pipelineDeal.findMany({
      include: { customer: true },
      orderBy: { value: "desc" },
    });

    // Group by stage
    const stages = ["lead", "qualified", "proposal", "negotiation", "won", "lost"];
    const grouped = stages.map((stage) => {
      const stageDeals = deals.filter((d) => d.stage === stage);
      return {
        stage,
        count: stageDeals.length,
        value: stageDeals.reduce((s, d) => s + d.value, 0),
        deals: stageDeals,
      };
    });

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("GET /api/sales/pipeline error:", error);
    return NextResponse.json({ error: "Failed to fetch pipeline" }, { status: 500 });
  }
}

// POST /api/sales/pipeline
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, title, value, stage } = body;

    const deal = await db.pipelineDeal.create({
      data: {
        customerId,
        title,
        value: parseFloat(value),
        stage: stage || "lead",
      },
      include: { customer: true },
    });

    await db.auditLog.create({
      data: {
        userName: "Rahel Alemu",
        action: `Created pipeline deal ${title}`,
        entity: "Sales",
        entityId: deal.id,
        details: `Value: ${value} ETB, Stage: ${stage}`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("POST /api/sales/pipeline error:", error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}

// PATCH /api/sales/pipeline — update stage
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, stage } = body;

    const deal = await db.pipelineDeal.update({
      where: { id },
      data: { stage },
      include: { customer: true },
    });

    await db.auditLog.create({
      data: {
        userName: "Rahel Alemu",
        action: `Moved deal ${deal.title} to ${stage}`,
        entity: "Sales",
        entityId: deal.id,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("PATCH /api/sales/pipeline error:", error);
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
  }
}
