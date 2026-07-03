import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/inventory/suppliers
export async function GET() {
  try {
    const suppliers = await db.supplier.findMany({ orderBy: { rating: "desc" } });
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("GET /api/inventory/suppliers error:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

// POST /api/inventory/suppliers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, email, address, leadTime, rating } = body;

    const supplier = await db.supplier.create({
      data: {
        name,
        contact,
        email,
        address,
        leadTime: parseInt(leadTime) || 7,
        rating: parseFloat(rating) || 4.5,
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Tewodros Assefa",
        action: `Added supplier ${name}`,
        entity: "Inventory",
        entityId: supplier.id,
        details: `Contact: ${contact}`,
        ipAddress: "196.188.44.30",
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory/suppliers error:", error);
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}
